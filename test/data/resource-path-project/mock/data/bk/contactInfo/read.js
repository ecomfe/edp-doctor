var random = underscore.random;

exports.response = function (path, params) {
    return {
        "success": "true",
        "message": {},
        "result": {
            "contactEmail1" : "somebody@baidu.com",
            "contact1" : mockUser[random(0, 2)],
            "contactCellPhone1" : "13345678901",
            "contactEmail2" : "somebody@baidu.com",
            "contact2" : mockUser[random(0, 2)],
            "contactCellPhone2" : "13345678902"
        }
    };
}
// delay
exports.timeout = 0;