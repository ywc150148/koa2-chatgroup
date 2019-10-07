const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/koademo', {useNewUrlParser:true});

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

let db = mongoose.connection
mongoose.Promise = global.Promise // 防止Mongoose: mpromise 错误

db.on('error', function (err) {
  console.log('数据库连接出错', err)
})

db.on('open', function () {
  console.log('数据库连接成功')
})

db.on('disconnected', function () {
  console.log('数据库连接断开')
})