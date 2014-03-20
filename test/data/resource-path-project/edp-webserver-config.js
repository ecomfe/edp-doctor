exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var querystring = require('querystring');
var fs = require('fs');

// union test config
//var remoteIp = '10.46.164.69';//hongquan
//var remotePort = '8080';

//zhenhua
//var remoteIp = '172.17.237.4';
//var remotePort = '8088';

//yuanhang
var remoteIp = '172.17.236.15';
var remotePort = '8888';
//var remoteIp = '10.46.164.66';
//var remotePort = '8080';

function commonHandler (request) {
    var path = request.pathname || '';
    var pathSegments = path.split(/\//);
    var notEmptySegments = [];
    pathSegments.forEach(function (item) {
        item && notEmptySegments.push(item);
    });

    var filePath = notEmptySegments.join('/');

    var mockModuleName = './mock/' + filePath;
    if (fs.existsSync(mockModuleName + '.js')) {
        if ('req'.green) {
            console.log('req path: '.green + request.pathname);
        }
        else {
            console.log('req path: ' + request.pathname);
        }
        delete require.cache[require.resolve(mockModuleName)];
        var mockDataHandler = require(mockModuleName);
        return mockDataHandler;
    }
    else {
        return false;
    }
}

function common404 (context) {
    context.status = 404;
    console.log('Not Mock Path: '.red + context.request.pathname.red);
    context.start();
}

function common500 (context, e) {
    context.status = 500;
    console.log('\nError Happen: '.red + e.toString().red + '\n');
    context.start();
}

/**
 * 同步保存文件到本地
 *
 * @param {string} path 要保存的文件目标路径
 * @param {string} data 要保存的文件的数据
 */
function writeFileSync(path, data) {
    if (fs.existsSync(path)) {

        // 已经存在，直接写入
        fs.writeFileSync(path, data, 'utf-8');
    }
    else {
        var segments = path.split('/');
        var checkPath = '.';

        // 检查目录是否存在，不存在就创建之
        for (var i = 0, len = segments.length - 1; i < len; i++) {
            checkPath += '/' + segments[i];

            if (!fs.existsSync(checkPath)) {
                fs.mkdirSync(checkPath);
            }
        }

        fs.writeFileSync(path, data, 'utf-8');
    }
}

exports.getLocations = function () {
    return [
        { 
            location: /\/$/, 
            handler: home( 'index.html' )
        },
        { 
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        { 
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss()
            ]
        },
        { 
            location: /\.less($|\?)/, 
            handler: [
                file(),
                less()
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus()
            ]
        },
        {
            location: function (request) {
                if (request.pathname.match(/^\/data\//)
                    && request.headers.referer
                    && request.headers.referer.match(/[?&](?:ed|enable_debug)\b/i)
                    && remoteIp) {
                    return true;
                }

                return false;
            },
            handler: [
                function (context) {
                    if ('req'.green) {
                        console.log('req path: '.green + context.request.pathname);
                    }
                    else {
                        console.log('req path: ' + context.request.pathname);
                    }
                },
                proxy(remoteIp, remotePort)
            ]
        },
        {
            location: function (request) {
                if (request.pathname.match(/^\/data.+upload$/) ) {
                    return true;
                }
                else {
                    return false;
                }
            },
            handler: [
                function(context, uploadType) {
                    try {
                        context.stop();
                        var request = context.request;
                        var mockDataHandler = commonHandler(request);

                        if (mockDataHandler) {
                            var postData = request.bodyBuffer || '';
                            var reqBody = postData.toString();
                            var fileReg = new RegExp(/name="callback"\r\n\r\n([\w\.\[\]'"]+)\r\n[\s\S]+?filename="(.*?)\.([^\.]+?)"\r\nContent\-Type: [a-zA-z\/\.\-]+?\r\n\r\n([\s\S]+?)\-{6}/);
                            var result = fileReg.exec(reqBody);
                            var callback = (result && result[1]) || '';
                            console.log(callback);
                            var fileName = (result && result[2]) || '';
                            var fileType = (result && result[3]) || '';
                            var fileData = (result && result[4]) || '';

                            var data, res;
                            var timeout = mockDataHandler.timeout;
                            if (!fileName || !fileData) {
                                data = mockDataHandler.response(request.pathname, { success: "false", callback: callback });
                            }
                            else {
                                writeFileSync('./mock/tmp/' + fileName + fileType, fileData);

                                res = {
                                    url: request.headers.host + '/mock/tmp/' + fileName + '.' + fileType
                                };
                                data = mockDataHandler.response(request.pathname, {
                                    success: "true",
                                    callback: callback,
                                    fileName: fileName,
                                    fileType: fileType,
                                    result:res
                                });
                            }

                            context.status = 200;
                            context.header['Content-Type'] = 'text/html;charset=UTF-8';
                            context.content = data;

                            if (timeout) {
                                setTimeout(function () {
                                    context.start();
                                }, timeout);
                            }
                            else {
                                context.start();
                            }
                        }
                        else {
                            common404(context);
                        }
                    }
                    catch (e) {
                        common500(context, e);
                    }
                }
            ]
        },
        {
            location: /^\/data\//,
            handler: [
                function (context) {
                    try {
                        context.stop();
                        var request = context.request;
                        var mockDataHandler = commonHandler(request);

                        if (mockDataHandler) {
                            var query = querystring.parse(request.search.substr(1));

                            // parse url-encoded post params
                            var postData = context.request.bodyBuffer || '';
                            var reqBody = querystring.parse(postData.toString());
                            var data = mockDataHandler.response(request.pathname, reqBody, context);

                            var timeout = mockDataHandler.timeout;

                            // 返回值未指定内容类型，默认按JSON格式处理返回
                            if (!context.header['Content-Type']) {
                                context.header['Content-Type'] = 'application/json;charset=UTF-8';
                                context.content = JSON.stringify(data || {});
                            }

                            if (timeout) {
                                setTimeout(function () {
                                    context.start();
                                }, timeout);
                            }
                            else {
                                context.start();
                            }
                        }
                        else {
                            common404(context);
                        }
                    }
                    catch (e) {
                        common500(context, e);
                    }
                }
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
