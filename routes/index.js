const Router = require('koa-router');
const router = new Router();

const home = require('./home');
const hello = require('./hello');
const reg = require('./reg');
const users = require('./users');
const user = require('./user');
const login = require('./login');
const client = require('./client');
const chatgroup = require('./chatgroup');
const namespace = require('./namespace');

module.exports = function (app) {
	//路由表
	app.use(router.routes()).use(router.allowedMethods());
	
	// app.use(router.routes(),router.allowedMethods());

	router.use('/', home.routes(), home.allowedMethods());
	router.use('/hello', hello.routes(), hello.allowedMethods());
	router.use('/reg', reg.routes(), reg.allowedMethods());
	router.use('/users', users.routes(), users.allowedMethods());
	router.use('/user', user.routes(), router.allowedMethods());
	router.use('/login', login.routes(), login.allowedMethods());
	router.use('/client', client.routes(), client.allowedMethods());
	router.use('/chatgroup', chatgroup.routes(), chatgroup.allowedMethods());
	router.use('/namespace', namespace.routes(), namespace.allowedMethods());
}