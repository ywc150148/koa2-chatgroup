运行项目：
``` base
$ PORT=8081 node app.js
```
或者在`package.json`中设置（端口按自己需求），设置端口8081，热更新，运行项目
```
"scripts": {
    "start": "set PORT=8081&&nodemon app.js",
    "start2": "set PORT=8081&&node server.js",
}
```

运行项目：
``` base
$ npm start
```
----

# 以下自言自语的笔记，忽略

在代码中获取其他信息：
``` javascript
ctx.host // 获取host 127.0.0.1:8081
ctx.hostname // 获取hostname 127.0.0.1
process.env.PORT // 获取端口号 8081
```

如果是cookie设置不成功，除了中文字符未转换64，还有可能是设置cookie的时候domain使用ctx.hostname定义了。
domain是"localhost"，浏览器访问127.0.0.1可能会设置cookie失败。

----

``` javascript
setInterval(function () {

    //给所有客户端广播消息
    io.sockets.emit("sayhello", {
        msg: "hello,all",
        id:'666'
    });

    // 给在www房间里面的客户端发送消息
    io.sockets.in('www').emit('receiveMsg', {
        msg: "hello,all",
        id: '666'
    })

    // 给指定用户发送消息 需要sockets.id
    io.sockets.connected[userid].emit('senduser', {
        msg: "你好，只有你看到我的消息",
        id: '666'
    });

}, 3000)

// io.of('namespace').emit('SystemMessage', 'the tournament will start soon'); // 给命名空间发送
io.of('namespace').in('chatGroup').emit("SystemMessage", '哈哈'); // 给命名空间某个房间发送

[https://www.jianshu.com/p/07a167b1482b](https://www.jianshu.com/p/07a167b1482b)
```

```bash

# 把工作区文件全部提交到缓存区
git add .  

# 将缓存中的文件Commit到git库
git commit -m "添加注释"

# 提交到远程库
git push origin master

# 从远程库拉取代码回来覆盖本地！
git pull 
```