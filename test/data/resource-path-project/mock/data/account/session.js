// add global lib
require('../../util');

var random = underscore.random;

exports.response = function (require) {
    return {
        "success" : "true",
        "message" : {},
        "result" : {
            "visitor": {        // 登录用户的信息
                "id" : 1023213,
                "name" : "用户登录名",
                "userName" : mockUser[random(0, 2)]
            },
            "adOwner": {
                "id" : 121233,  // aderId 对应的广告主信息，可能与visitor信息一致
                "name" : "广告主登录名",
                "userName" : "广告主昵称",
                "hasEmail" : false
            }
        }
    }
}