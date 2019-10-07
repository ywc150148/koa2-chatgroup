const userModel = require('./model').userModel;

const findOne = async (obj) => {
    let code, data, msg;
    try {
        data = await userModel.findOne(obj);
        code = 0;

        if (data === null) {
            code = -1;
            msg = "用户不存在";
        }

    } catch (err) {
        code = -1;
        msg = "查询失败";
    }

    return {
        code,
        msg,
        data
    };
}

const saveNickName = async (ctx, params) => {
    let code,
        data, msg, {
            _id,
            nickname
        } = params;

    if (!_id || !nickname) {
        code = -1;
        msg = !_id ? "未传入_id" : "未传入昵称";
    } else {
        try {
            data = await userModel.updateOne({
                _id: _id
            }, {
                "$set": {
                    nickname: nickname
                }
            });

            if (data.ok !== 1) {
                code = -1;
                msg = "保存昵称失败";
            } else {
                code = 0;
                msg = "保存昵称成功";
            }
        } catch (err) {
            code = -1;
            msg = "更新用户昵称失败";
        }
    }

    return {
        code,
        msg,
        data
    };
}


const saveUserInfo = async (ctx, query, params) => {
    let code, data, msg;

    if (!query._id) {
        msg = "未传入_id";
    } else {
        try {
            data = await userModel.updateOne(query, {
                "$set": params
            });

            if (data.ok !== 1) {
                code = -1;
                msg = "保存用户信息失败";
            } else {
                code = 0;
                msg = "保存用户信息成功";
            }
        } catch (err) {
            code = -1;
            msg = "更新用户信息失败";
        }
    }

    return {
        code,
        msg,
        data
    };
}

const saveToken = async (ctx, params) => {
    let code,
        data, msg, {
            _id,
            token
        } = params;

    if (!_id || !token) {
        code = -1;
        msg = !_id ? "未传入_id" : "未传入token";
    } else {
        try {
            data = await userModel.updateOne({
                _id: _id
            }, {
                "$set": {
                    token: token
                }
            });
            code = 0;
            msg = "保存tokne成功";
        } catch (err) {
            code = -1;
            msg = "更新用户token失败";
        }
    }

    return {
        code,
        msg,
        data
    };
}

const checkToken = async (ctx, params) => {
    let code,
        data, msg, {
            _id,
            token
        } = params;

    if (!_id || !token) {
        code = -1;
        msg = !_id ? "未传入_id" : "未传入token";
    } else {
        try {
            data = await userModel.findOne({
                _id: _id,
                token: token
            });
            code = data === null ? -1 : 0;
            msg = data === null ? "用户token匹配失败" : "用户token匹配成功";
        } catch (err) {
            code = -1;
            msg = "查询失败用户信息";
        }
    }
    return {
        code,
        msg
    };
}


module.exports = {
    findOne,
    saveNickName,
    saveUserInfo,
    saveToken,
    checkToken
}