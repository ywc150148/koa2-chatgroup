const mongoose = require('mongoose');

// 定义模式
let UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    token: String,
    sex: {
        type: Number,
        min: 0,
        max: 2,
        default: 0
    },
    nickname: String,
    headimgurl: {
        type: String,
        default: "/images/head/sex_0.png"
    },
    regDate: {
        type: Date,
        default: Date.now
    },
});

// 将模式“编译”模型
let userModel = mongoose.model('User', UserSchema);

// const model = {
//     userModel
// }

// 输出数据表模型
module.exports = {
    userModel
};