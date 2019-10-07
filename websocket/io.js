const cookie = require('cookie');
const verifyToken = require('../middleware/checktoken').verifyToken;
const jwtsecret = require('../config/secret').jwtsecret; // 密钥
const findeOne = require('../database/users').findOne;
const uniqueArr = require('../public/lib').uniqueArr;
const removeArrItem = require('../public/lib').removeArrItem;
let user, userArray = Array.from([]),
    usersObj = new Object();

async function getClients(io) {
    io.clients((error, clients) => {
        if (error) throw error;
        // console.log("当前在线客户端", clients.length);
        console.log("在线用户人数：%s \r\n在线用户_id：[%s] \r\n在线客户端：%s", userArray.length, userArray, clients.length)
    });
}

async function getNickName(socket) {
    if (!socket.request.headers.cookie) return "未命名游客" + socket.id;
    let cookies = await cookie.parse(socket.request.headers.cookie),
        token = cookies.token,
        tourist = cookies.tourist,
        nk,
        sex,
        _id = socket.id,
        data,
        res;

    if (Object.prototype.toString.call(token) !== "[object Undefined]") {
        // 解析token
        let vf = await verifyToken(token, jwtsecret);

        // 验证身份
        res = await findeOne({
            _id: vf._id,
            token: token
        });

        data = res.data;
    }

    if (Object.prototype.toString.call(res) !== "[object Undefined]" && res.code === 0) {
        nk = Object.prototype.toString.call(data.nickname) !== "[object Undefined]" ? data.nickname : "未设置昵称用户";
        sex = Object.prototype.toString.call(data.sex) !== "[object Undefined]" ? data.sex : 0;
        _id = Object.prototype.toString.call(data._id) !== "[object Undefined]" ? data._id : _id;
    } else {
        // Buffer base64 转 字符
        nk = Object.prototype.toString.call(tourist) !== "[object Undefined]" ? new Buffer(tourist, 'base64').toString() : "未命名游客" + socket.id;
        sex = 0;
        _id = nk;
    }

    return {
        id: socket.id,
        nickName: nk,
        sex: sex,
        _id:_id.toString()
    };
}

module.exports = (server) => {
    const io = require('socket.io')(server);
    io.use(async (socket, next) => {
        user = await getNickName(socket);
        console.log("用户 %s 连接上线", user.nickName)
        next();
    });

    io
        .of("/namespace")
        .on('connection', async socket => {

            // 获取在线用户
            userArray = await uniqueArr(userArray, [user._id]);
            usersObj[user._id] = user.id;

            // console.log('connection-usersObj', usersObj)
            // 打印连接
            getClients(io);

            //加入房间
            socket.on("joinRoom", async callback => {
                user = await getNickName(socket);
                usersObj[user._id] = user.id;
                socket.join("chatGroup");
                callback({
                    "code": 0,
                    "msg": "加入房间成功",
                    user
                });

                // 给命名空间某个房间发送
                io.of('namespace').in('chatGroup').emit("SystemMessage", {
                    type: 0,
                    msg: user.nickName + "加入群聊",
                    online: Object.keys(usersObj).length
                });
            });

            // 退出房间
            socket.on("leaveGroup", async callback => {
                user = await getNickName(socket);
                delete usersObj[user._id];
                socket.leave("chatGroup");
                callback({
                    "code": 0,
                    "msg": "已退出房间成功",
                    user
                });

                io.of('namespace').in('chatGroup').emit("SystemMessage", {
                    type: 0,
                    msg: user.nickName + "退出群聊",
                    online: Object.keys(usersObj).length
                });
            });

            // sendMsg 事件
            socket.on("sendMsg", async (data, callback) => {

                // console.log("data", data)
                user = await getNickName(socket);
                userArray = await uniqueArr(userArray, [user._id]);
                usersObj[user._id] = user.id;
                // console.log('sendMsg-usersObj', usersObj)
                await getClients(io);
                let msg, code;
                data.user = user;

                // 用户是否在房间内
                if ("chatGroup" in socket.rooms) {
                    socket.broadcast.to("chatGroup").emit("receiveMsg", data); // 广播 不包括自己
                    // io.sockets.in('chatGroup').emit("receiveMsg", data); // 广播 包括自己 
                    code = 0;
                    msg = "消息发生成功";
                } else {
                    code = -1;
                    msg = "你已经不在该群组，无法发送消息";
                }

                callback({
                    code,
                    msg,
                    user
                });

                io.of('namespace').in('chatGroup').emit("SystemMessage", {
                    type: -1,
                    online: Object.keys(usersObj).length
                });
            });

            // 出错
            socket.on('error', (error) => {
                // ...
            });

            // 用户断开
            socket.on('disconnecting', async (reason) => {
                user = await getNickName(socket);
                // 删除退出的用户
                await removeArrItem(userArray, user._id);
                delete usersObj[user._id];
                // console.log('disconnecting-usersObj', usersObj)
                await getClients(io);
                io.of('namespace').in('chatGroup').emit("SystemMessage", {
                    type: 0,
                    msg: user.nickName + "断开连接",
                    online: Object.keys(usersObj).length
                });
                console.log("断开连接的_id:", user._id)
                console.log("断开原因：", reason)
                // let rooms = Object.keys(socket.rooms);
                // console.log("disconnecting - rooms", rooms)
                // ...
            })

        })
}