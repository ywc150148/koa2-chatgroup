const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx) => {
    await ctx.render('index',{
        title:"首页",
        route_name: "首页",
        active:1
    });
})

module.exports = router