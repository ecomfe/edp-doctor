/**
 * @file 检查资源引用路径
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */


var edp = require('edp-core');
var fs = require('fs');

/**
 * 不合法的资源集合
 *
 * @type {Array.<Object>}
 */
var invalidResource = [];

/**
 * 需要检测文件的后缀名
 */
var FILE_EXTS = [
    '.html', '.htm', '.vm',
    '.phtml', '.tpl',
    '.js', '.css', '.less'
];

/**
 * 匹配css中图片的正则
 */
var REG_CSS_IMG = /\burl\s*\((["']?)([^\)]+)\1\)/g;

/**
 * 匹配html中图片的正则
 */
var REG_HTML_IMG = /<img[^>]+src\s*=\s*(['\"])([^'\"]+)\1[^>]*>/g;

/**
 * 待检测文件的集合
 */
var fileList = [];

/**
 * 检查css引用的图片是否正确
 * @param {string} file css文件的路径.
 */
function checkResouce(file) {
    invalidResource = [];
    var data = edp.fs.readFileSync(file.path);
    var match = null;
    while (
        (match = REG_CSS_IMG.exec(data))
        ||
        (match = REG_HTML_IMG.exec(data))
    ) {
        var url = match[2];
        if (
            edp.path.isLocalPath(url)
            &&
            !/^\${[\s\S]*}/.test(url)  // 排除掉模板变量 ${url}
        ) {
            var resourceUrl = edp.path.normalize(
                edp.path.join(edp.path.dirname(file.path), url)
            );
            resourceUrl = resourceUrl.replace(/[#\?].*$/g, '');
            if (!fs.existsSync(resourceUrl)) {
                invalidResource.push({
                    path: file.path,
                    resourceUrl: url
                });
            }
        }
    }

    if (invalidResource.length) {
        edp.log.info('%s', edp.path.relative(process.cwd(), file.path));
        invalidResource.forEach(function (item) {
            edp.log.error('→ %s', item.resourceUrl);
        });
    }
}

/**
 * 获取目录下的文件
 *
 * @param  {string}  dir          目录
 * @param  {boolean} isScanFolder 是否扫描子目录
 *
 * @return {Array}               文件集合
 */
function getFileList(dir, isScanFolder) {
    var ret  = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        var absolutePath = edp.path.resolve(dir, file);
        var stat         = fs.statSync(absolutePath);
        var extName      = edp.path.extname(file);
        var fileName     = edp.path.basename(file, extName);
        if (stat && stat.isDirectory()) {
            if (isScanFolder) {
                ret = ret.concat(getFileList(absolutePath, isScanFolder));
            }
        }
        else {
            if (
                fileName !== 'edp-build-config'
                &&
                fileName !== 'edp-webserver-config'
            ) {
                FILE_EXTS.forEach(
                    function (ext) {
                        var reg = new RegExp('\\' + ext + '$', 'i');
                        if (reg.test(extName)) {
                            ret.push({
                                name: fileName,
                                path: absolutePath
                            });
                        }
                    }
                );
            }
        }
    });
    return ret;
}


module.exports = function(args, opts) {
    edp.log.info('Checking resource path...');

    // 检测src目录以及项目根目录下的css文件和html/tpl文件
    var srcDirPath = edp.path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcDirPath)) {
        edp.log.error('→ No such dir %s', srcDirPath);
        return;
    }

    fileList =
        getFileList(srcDirPath, true)  // 获取src目录下的html/tpl，css/less
            .concat(
                getFileList(process.cwd()) // 获取根目录下的html/tpl，css/less
            );

    fileList.forEach(
        function (file) {
            checkResouce(file);
        }
    );
};