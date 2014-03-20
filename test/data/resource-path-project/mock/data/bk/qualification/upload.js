// 上传文件

exports.response = function(path, params){
    console.log(params);
    return '<!doctype html><html><meta charset="utf-8" /><script type="text/javascript">' +
            ((params && params.callback)) +
            '(' + JSON.stringify(params) + ');</script></html>';
};

exports.timeout = 2000;