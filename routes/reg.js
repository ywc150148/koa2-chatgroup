const Router = require('koa-router')
const router = new Router();
const userModel = require("../database/model").userModel

router.get('/', async (ctx) => {
    await ctx.render('reg', {
        title: "注册",
        route_name: "注册",
        active:2
    });
})

router.post('/', async (ctx, next) => {
    let {
        name,
        password
    } = ctx.request.body;

    if (!name || !password) {
        return ctx.body = "用户名或者密码不能为空！";
    }

    let findUser = await userModel.findOne({name});

    if (findUser != null) {
        return ctx.response.body = "用户 '" + name + "'已存在了";
    }

    const careateUser = async () => {
        let err = null,
            res = null;
        try {
            let doc = await userModel.create({
                name: name,
                password: password
            })
            code = 0;
            res = doc;
        } catch (err) {
            err = err;
        }

        return {
            err,
            res
        };
    }

    let {
        err,
        res
    } = await careateUser(ctx)

    if (err) {
        ctx.response.body = "注册失败：" + err;
    } else {
        ctx.response.body = "注册成功：\r\n" + res;
    }
})

module.exports = router