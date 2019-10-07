const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const nunjucks = require('koa-nunjucks-2');
const session = require('./middleware/session');
const routes = require('./routes/index.js');
const path = require('path');
const checkToken = require("./middleware/checktoken").check;
const server = require('http').Server(app.callback());
const port = 8081;
require('./database/db');
require('./websocket/io')(server);

app.use(bodyParser());

app.use(nunjucks({
    ext: 'html', // 指定视图文件默认后缀
    path: path.join(__dirname, 'views'), // 指定视图目录
    nunjucksConfig: {
        trimBlocks: true // 开启转义，防止Xss漏洞
    }
}));

// log request URL:
app.use(async (ctx, next) => {

    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

app.use(koaStatic(path.resolve(__dirname, 'static')));

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        let msg = e.message || '发生错误',
            status = e.statusCode || e.status || 500;
        ctx.status = status;
        await ctx.render("error", {
            title: msg,
            msg: msg,
            status: status
        });
    }
});


app.use(async (ctx, next) => {
    await checkToken(ctx, next);
})

session(app)
routes(app)

server.listen(process.env.PORT || port, () => {
    console.log(`app run at : http://127.0.0.1:${port}`);
})
// app.listen(4000, () => {
//     console.log('app started at port 127.0.0.1:4000...');
// });