!(function () {

    let hostname = window.location.hostname == '127.0.0.1'?'127.0.0.1:8081':window.location.hostname;
    console.log("这个host",host)

    let socket = io('ws://' + hostname + '/namespace'),
        _id,
        main = document.getElementById("main"),
        msgLayout = document.getElementById("msg-layout"),
        sendMsg = document.getElementById("sendMsg"),
        btnSend = document.getElementById("btnSend"),
        btnjoin = document.getElementById("btnjoin"),
        btnLeave = document.getElementById("btnLeave"),
        btnMenu = document.getElementById("btnMenu"),
        Menu = document.getElementById("Menu"),
        online = document.getElementById("online"),
        Warning = document.getElementById("Warning"),
        WarningSpan = document.getElementById("Warning-span"),
        WarningTimer,
        inGroup = true,
        once = false,
        showMenu = false;

    // 连接成功
    socket.on("connect", () => {
        // 连接成功
        !once && joinRoom();
    });

    // 自动重连成功
    socket.on("reconnect", () => {
        // 如果断开连接前是在房间内
        if (inGroup) joinRoom();
    });

    socket.on("receiveMsg", data => {
        setHtml(data, 0);
    });

    socket.on("SystemMessage", data => {
        online.innerText = ' ' + data.online
    });

    socket.on("error", () => {
        console.log("error")
    });

    socket.on("connect_failed", () => {
        console.log("connect_failed")
    });

    btnSend.addEventListener("click", sendMessage);

    btnjoin.addEventListener('click', joinRoom);

    btnMenu.addEventListener("touchstart", () => {
        btnMenu.style.background = "#efefef";
    });

    btnMenu.addEventListener("touchend", () => {
        btnMenu.style.background = "none";
    });

    btnSend.addEventListener("touchstart", () => {
        btnSend.style.background = "#efefef";
    });

    btnSend.addEventListener("touchend", () => {
        btnSend.style.background = "none";
    });

    btnMenu.addEventListener("click", (event) => {
        toggleMenu(0);
        var e = event || window.event;
        if (e.cancelBubble) {
            e.cancelBubble = true; //ie 阻止事件冒泡
        } else {
            e.stopPropagation(); // 其余浏览器 阻止事件冒泡
        }
    });

    btnLeave.addEventListener("click", () => {
        socket.emit("leaveGroup", data => {
            if (data.code === 0) inGroup = false;
            showWarning(data.msg)
            // console.log("离开房间：" + JSON.stringify(data))
        });

        toggleMenu(1);
    });

    document.addEventListener('click', function () {
        toggleMenu(1);
    })

    // 监听键盘回车事件
    document.addEventListener("keydown", (e) => {
        var event = window.event || e;
        var code = event.keyCode || event.which || event.charCode;
        if (code == 13) sendMessage();
    });

    // 加入房间
    function joinRoom() {

        socket.emit("joinRoom", data => {
            if (data.code === 0) inGroup = true;
            showWarning(data.msg)
            // console.log("加入房间：" + JSON.stringify(data));
            let obj = JSON.parse(JSON.stringify(data))
            _id = obj.user._id;
        });

        once = true;

        toggleMenu(1);
    }

    // 发送消息
    function sendMessage() {
        let msg = sendMsg.value;
        if (!msg) return;
        socket.emit("sendMsg", {
            msg
        }, data => {
            if (data.code === -1) {
                showWarning(data.msg)
            } else {
                data.msg = msg;
                setHtml(data, 1);
                sendMsg.value = "";
                sendMsg.style.height = "36px";
            }
        });
    }


    function showWarning(msg) {
        let classNameArr = Warning.className.split(" ");
        if (classNameArr.indexOf("Warning-show") >= 0) {
            clearTimeout(WarningTimer)
            Warning.classList.remove("Warning-show");
            WarningTimer = setTimeout(function () {
                show()
            }, 300);
        } else {
            show();
        }

        function show() {
            WarningSpan.innerText = msg;
            Warning.classList.add("Warning-show");
            WarningTimer = setTimeout(function () {
                Warning.classList.remove("Warning-show");
            }, 3000)
        }
    }


    // 获取当前时间
    function NowTime() {
        let time = new Date(),
            year = time.getFullYear(),
            month = time.getMonth() + 1,
            day = time.getDate(),
            hour = time.getHours(),
            minu = time.getMinutes(),
            second = time.getSeconds(),
            add0 = (n) => {
                return n < 10 ? n += '0' : n;
            }

        let data = year + "-";
        data += add0(month) + "-";
        data += add0(day) + " ";
        data += add0(hour) + ":";
        data += add0(minu) + ":";
        data += add0(second);

        return data;
    }

    function setHtml(data, type) {

        let classNameArr = ['msg-l', 'msg-r', ],
            person = 1;

        if (type === 0) {
            person = data.user._id == _id ? 1 : 0;
        }

        let msg = document.createElement("div"),
            msg_name = document.createElement("p"),
            msg_head = document.createElement("img"),
            msg_box = document.createElement("div"),
            msg_time = document.createElement("p");

        msg.classList.add("msg");
        msg.classList.add(classNameArr[person]);
        msg_name.classList.add("msg-name");
        msg_name.innerText = data.user.nickName;
        msg_head.classList.add("msg-head");
        msg_head.src = `http://127.0.0.1:8081/images/head/sex_${data.user.sex}.png`;
        msg_box.classList.add("msg-box");
        msg_box.innerText = data.msg;
        msg_time.classList.add("msg-time");
        msg_time.innerText = NowTime();

        msg.appendChild(msg_name);
        msg.appendChild(msg_head);
        msg.appendChild(msg_box);
        msg.appendChild(msg_time);

        msgLayout.appendChild(msg);

        checkMainHeight();

        // 消息模板 收到：msg-l 发出：msg-r
        // <div class="msg msg-l">
        //     <p class="msg-name">用户</p>
        //     <img class="msg-head" src="http://127.0.0.1:8081/images/head/sex_0.png">
        //     <div class="msg-box">
        //         这是一条消息
        //     </div>
        //     <p class="msg-time">2019-10-05</p>
        // </div>
    }

    function toggleMenu(type) {
        showMenu = type === 0 ? !showMenu : false;
        Menu.style.display = showMenu ? 'block' : 'none';
        btnjoin.style.display = !inGroup ? "block" : "none";
        btnLeave.style.display = inGroup ? "block" : "none";
    }

    let event = "orientationchange" in window ? "orientationchange" : "resize",
        doc = window.document,
        el = doc.documentElement,
        fun = function () {
            clientHeight = el.clientHeight;
            main.style.height = clientHeight - 50 + "px";
            // console.log("el.scrollHeigh.", el.scrollHeight)
            checkMainHeight();
        };
    doc.addEventListener && (window.addEventListener(event, fun, false), doc.addEventListener("DOMContentLoaded", fun, false))

    function checkMainHeight() {
        mainH = main.clientHeight;
        layoutH = msgLayout.scrollHeight;

        if (layoutH > mainH) {
            msgLayout.scrollTop = layoutH - mainH + 50;
        }
    }

    // 输入框高度随文字行数改变
    var autoTextarea = function (elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
            addEvent = function (type, callback) {
                elem.addEventListener ?
                    elem.addEventListener(type, callback, false) :
                    elem.attachEvent('on' + type, callback);
            },
            getStyle = elem.currentStyle ? function (name) {
                var val = elem.currentStyle[name];

                if (name === 'height' && val.search(/px/i) !== 1) {
                    var rect = elem.getBoundingClientRect();
                    return rect.bottom - rect.top -
                        parseFloat(getStyle('paddingTop')) -
                        parseFloat(getStyle('paddingBottom')) + 'px';
                };

                return val;
            } : function (name) {
                return getComputedStyle(elem, null)[name];
            },
            minHeight = parseFloat(getStyle('height'));

        elem.style.resize = 'none';

        var change = function () {
            var scrollTop, height,
                padding = 0,
                style = elem.style;

            if (elem._length === elem.value.length) return;
            elem._length = elem.value.length;

            if (!isFirefox && !isOpera) {
                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
            };
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            elem.style.height = minHeight + 'px';
            if (elem.scrollHeight > minHeight) {
                if (maxHeight && elem.scrollHeight > maxHeight) {
                    height = maxHeight - padding;
                    style.overflowY = 'auto';
                } else {
                    height = elem.scrollHeight - padding;
                    // style.overflowY = 'auto';
                };
                style.height = height + extra + 'px';
                scrollTop += parseInt(style.height) - elem.currHeight;
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                elem.currHeight = parseInt(style.height);
            };
        };

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
    };

    autoTextarea(sendMsg);

})(window)