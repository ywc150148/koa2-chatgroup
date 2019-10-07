const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx) => {
    await ctx.render('chatgroup', {
        title: "网络聊天室-chatGroup-socket-客户端",
        host: ctx.host,
        port: process.env.PORT,
        route_name: "网络聊天室"
    });
})

module.exports = router