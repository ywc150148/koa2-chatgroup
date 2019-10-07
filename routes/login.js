const Router = require('koa-router')
const router = new Router();
const userModel = require("../database/model").userModel;
const saveToken = require("../database/users").saveToken;
const jwt = require('jsonwebtoken');
const jwtsecret = require('../config/secret').jwtsecret;

router.get('/', async (ctx) => {
    await ctx.render('login', {
        title: "登录",
        route_name: "登录",
        active:3
    });
})

router.post('/', async (ctx, next) => {

    let result, {
        name,
        password
    } = ctx.request.body;

    if (!name || !password) {
        return ctx.body = "用户名或者密码不能为空！";
    }

    try {
        result = await userModel.findOne({
            name: name,
            password: password
        });

    } catch (err) {
        ctx.throw(500, "查询用户时发生错误");
        await next();
    }

    if (result === null) {
        ctx.response.body = "用户名或密码错误！";
        await next();
    }

    let token = jwt.sign({
        name: result.name,
        _id: result._id,
        nickname: result.nickname,
        sex:result.sex
    }, jwtsecret, {
        expiresIn: '24h'
    });

    token = token.toString();
    // console.log("token.toString()", token)

    var exp = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); //后一天
    // console.log("exp.toGMTString()", exp.toGMTString())
    console.log("host--------------------\r\n",ctx.hostname)
    console.log("host-request----不要---------------\r\n",ctx.request.hostname)
    await ctx.cookies.set('token', token, {
        // domain: ctx.request.hostname, // 写cookie所在的域名
        path: '/', // 写cookie所在的路径
        maxAge: 24 * 60 * 60 * 1000, // cookie有效时长
        expires: exp.toGMTString(), // cookie失效时间
        httpOnly: false, // 是否只用于http请求中获取
        overwrite: false // 是否允许重写
    });

    // 将token保存到数据库
    let saveTkresult = await saveToken(ctx, {
        _id: result._id,
        token
    });

    // 获取token
    // let ddd = await ctx.cookies.get('token');
    // console.log('token============================================\r\n', ddd)

    ctx.session.user = {
        _id: result._id,
        token,
        nickname: result.nickname,
        sex:result.nickname
    }

    // ctx.body = {
    //     code: 0,
    //     data: token,
    //     msg: '登录成功'
    // }
    await ctx.redirect("/user")
})

module.exports = router