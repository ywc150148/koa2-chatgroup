const Router = require('koa-router')
const router = new Router();

router.get('/', async (ctx) => {
    await ctx.render('namespace', {
        title: "网络聊天室-客户端-socket.io",
        host: ctx.host,
        port: process.env.PORT,
        groupname: "大家来网上冲浪",
        route_name: "聊天室"
    });
})

module.exports = router