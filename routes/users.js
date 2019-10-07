const Router = require('koa-router')
const router = new Router();
const userModel = require("../database/model").userModel

router.get('/', async (ctx) => {

    // 删除所有数据
    // const removeAllUser = async () => {
    //     let err;
    //     try {
    //         rmdoc = await userModel.deleteMany(function (err) {
    //             err = err
    //         });
    //     } catch (err) {
    //         err = err
    //     }

    //     return err
    // }

    // let rmerr = await removeAllUser();

    // 查询所有用户
    const findAllUser = async () => {
        let err, doc;
        try {
            doc = await userModel.find({});
        } catch (err) {
            err = err
        }
        return {err,doc}
    }

    let {err,doc} = await findAllUser();
    ctx.response.body = "暂停访问";
    // ctx.response.body = {
    //     err,
    //     doc
    // }

})


module.exports = router