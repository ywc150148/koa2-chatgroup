const Router = require('koa-router')
const router = new Router();
const {
    findOne,
    saveNickName,
    saveUserInfo
} = require('../database/users');

router.get('/', async (ctx) => {

    let {
        name,
        _id
    } = ctx.session.user;
    // console.log("name,_id", name, _id)
    let doc = await findOne( {
        name,
        _id
    });

    if (doc.code === -1) {
        ctx.throw(401, doc.msg);
        await next()
    }

    await ctx.render('user', {
        title: "用户信息",
        name: doc.data.name,
        nickname: doc.data.nickname,
        sex: doc.data.sex,
        route_name: "个人中心",
        active:4
    });

}).post('/modify/password', async (ctx) => {

    let {
        password,
        newpassword
    } = ctx.request.body,
        _id = ctx.session.user._id;

    console.log("password", password)
    console.log("newpassword", newpassword)

    if (!password || !newpassword) {
        ctx.throw(401, "未输入原密码或新密码");
        await next();
    }

    let res = await findOne( {
        _id,
        password
    });

    console.log('res', res)

    if (res.code === -1) {
        ctx.throw(401, "修改失败，可能是原密码不正确。");
        await next();
    } else {

        let doc = await saveUserInfo(ctx, {
            _id: _id
        }, {
            password: newpassword
        });

        if (doc.code === -1) {
            ctx.throw(401, doc.msg);
            await next();
        }

        ctx.cookies.set("token", null, {
            maxAge: -1,
        });

        ctx.throw(401, "修改密码成功，请重新登录");
        await next();
    }

    ctx.response.redirect('/user');
}).post('/modify/nickname', async (ctx) => {

    let nickname = ctx.request.body.nickname,
        _id = ctx.session.user._id;

    if (!nickname || nickname.length>13) {
        ctx.throw(401, "昵称不能为空且长度不大于13");
        await next();
    }
    

    let doc = await saveNickName(ctx, {
        _id,
        nickname
    });

    if (doc.code === -1) {
        ctx.throw(401, doc.msg);
        await next();
    }

    ctx.response.redirect('/user');

}).post('/modify/sex', async (ctx) => {

    let sex = ctx.request.body.sex,
        _id = ctx.session.user._id;

    console.log("sex", sex)
    console.log("sex", typeof sex)

    if (!sex) {
        ctx.throw(401, "请输入昵称");
        await next();
    }

    let doc = await saveUserInfo(ctx, {
        _id: _id
    }, {
        sex: sex
    });

    if (doc.code === -1) {
        ctx.throw(401, doc.msg);
        await next();
    }
    ctx.response.redirect('/user');
})




module.exports = router