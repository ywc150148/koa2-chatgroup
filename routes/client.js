const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx) => {
    await ctx.render('client',{
        title:"socket-客户端",
        route_name: "socket"
    });
})

module.exports = router