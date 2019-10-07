// 检查token，针对特定路由，需要检查的路由写在links里面
const verify = require('jsonwebtoken').verify;
const jwtsecret = require('../config/secret').jwtsecret;
const checkToken = require('../database/users').checkToken;
const links = [
    "/users",
    "/user"
]
// token验证中间件
async function check(ctx, next) {

    // 每个用户（包括登录用户）的游客id
    let tourist = await ctx.cookies.get("tourist");
    if (!tourist) {
        let tourist = "游客" + new Date().getTime() + Math.ceil(Math.random() * 100).toString();
        // tourist = new Buffer(tourist).toString('base64');
        await setNickName(ctx,tourist);
    }

    // 访问路径是否需要验证
    if (links.indexOf(ctx.path) < 0) { // 不需要验证
        return await next();
    }

    // 获取token
    let token = await ctx.cookies.get('token');

    ctx.session.user = null;

    if (token == undefined) {
        // 没有token
        ctx.throw(401, "没有提供认证信息：token");
        next()
    } else {

        // 解析token
        let data = await verifyToken(token, jwtsecret);
        // console.log('data-----', data)
        // 从数据库中匹配用户和token
        let checkTkRes = await checkToken(ctx, {
            _id: data._id,
            token: token
        });

        // 匹配失败或出错
        if (checkTkRes.code === -1) {
            ctx.throw(401, checkTkRes.msg);
            next()
        }

        let {
            iat, // 签约日期
            exp // 过期日期
        } = data;

        // 获取当前系统时间转字符串截取前10位数
        let now = new Date().getTime().toString().substring(0, 10);
        if (now <= exp) {
            // 未过期

            ctx.session.user = {
                _id: data._id,
                name: data.name,
                nickname: data.nickname
            }

            // data.nickname && await setNickName(ctx,data.nickname);

        } else {
            // 过期
            ctx.throw(401, 'token已过期');
            // 删除cokkie
            ctx.cookies.set("token", null, {
                maxAge: -1,
            });

        }
        await next()
    }
}

// 解析token，需要2个参数，token和密钥
function verifyToken(...args) {
    return new Promise((resolve, reject) => {
        verify(...args, (error, decoded) => {
            error ? reject(error) : resolve(decoded);
        });
    });
}

async function setNickName(ctx, nickname) {
    let value = new Buffer(nickname).toString('base64')
    // console.log("----nickname----",nickname) 
    // console.log("----value----",value)
    var exp = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); //后一天
    await ctx.cookies.set(
        'tourist',
        value, {
            domain: ctx.request.hostname, // 写cookie所在的域名
            path: '/', // 写cookie所在的路径
            maxAge: 24 * 60 * 60 * 1000, // cookie有效时长
            expires: exp.toGMTString(), // cookie失效时间
            httpOnly: false, // 是否只用于http请求中获取
            overwrite: false // 是否允许重写
        }
    );
}

module.exports = {
    check,
    verifyToken
};