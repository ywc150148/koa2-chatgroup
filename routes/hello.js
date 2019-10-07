const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx) => {
    await ctx.render('hello',{
        title:"hello"
    })
})

module.exports = router