exports.response = function(path, params) {
    return {
        "success": "true",
        "message": {},
        "result": {
            id: params.id
        }
    };
};