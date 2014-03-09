/**
 * @file 检查引用路径是否正确
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */

var edp = require('edp-core');

var fs = require('fs');

var EXT = {
    JS: '.js'
};

var REQUIRE_RULE = /require\(\s*(['"'])([^'"]+)\1\s*\)/g;
var COMMENT_RULE = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;

/**
 * moduleConfig配置
 *
 * @type {Object}
 */
var moduleConfig = {};

/**
 * moduleConf文件路径
 *
 * @type {String}
 */
var moduleConfigPath = '';

/**
 * 根据value去掉数组中的项
 *
 * @param  {Array} arr   待删除元素的数组
 * @param  {Array|String} value 将要去掉的元素
 */
function removeByVal(arr, value) {
    if (!arr || !arr.length) {
        return;
    }

    /**
     * 根据value去掉数组中的项
     *
     * @param  {Array} l 待删除元素的数组
     * @param  {String} item 将要去掉的元素
     */
    function _del(l, item) {
        var index = l.indexOf(item);
        if (index > -1) {
            l.splice(index, 1);
        }
    }
    if (Array.isArray(value)) {
        value.forEach(function (v) {
            _del(arr, v);
        });
    }
    else if (
        Object.prototype.toString.call(value)
        ===
        '[object String]'
    ) {
        _del(arr, v);
    }
}


/**
 * 获取文件夹内的js文件
 *
 * @param  {String} dir 目标文件夹
 */
function getJSFiles(dir, isPackage) {
    var ret  = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        var absolutePath = edp.path.resolve(dir, file);
        var stat         = fs.statSync(absolutePath);
        var extName      = edp.path.extname(file);
        var fileName     = edp.path.basename(file, extName);
        if (stat && stat.isDirectory()) {
            ret = ret.concat(getJSFiles(absolutePath, isPackage));
        }
        else {
            if (extName === EXT.JS) {
                var content = fs.readFileSync(absolutePath, 'utf8');
                // package类项目里面每个模块并没有包装成 define的形式
                // 因此这里获取每个js require的模块名称，判断是否是相对路径
                if (isPackage) {
                    var tmp = {
                        fileName: fileName,
                        filePath: absolutePath,
                        requireMods: []
                    };
                    content.toString()
                        .replace(COMMENT_RULE, '')
                        .replace(REQUIRE_RULE, function ($0, $1, depId) {
                            tmp.requireMods.push(depId);
                        });
                    ret.push(tmp);
                }
                else {
                    var ast = edp.esl.getAst(content, fileName);
                    var moduleInfo = edp.esl.analyseModule(ast);

                    var actualDependencies =
                        moduleInfo && moduleInfo.actualDependencies || null;

                    // 把依赖中的 require，exports，module去掉，不检测
                    removeByVal(
                        actualDependencies,
                        ['require', 'exports', 'module']
                    );

                    ret.push({
                        fileName: fileName,
                        filePath: absolutePath,
                        requireMods: actualDependencies
                    });
                }
            }
        }
    });
    return ret;
}

/**
 * 分析每个文件中require的模块
 *
 * @param  {Array}   list     文件集合
 * @param  {Function} callback 回调
 */
function analyzeModPath(list, callback) {
    var fileName;
    var filePath;
    var requireMods;
    list.forEach(function (item) {
        fileName = item.fileName;
        filePath = item.filePath;
        requireMods = item.requireMods;
        if (requireMods && requireMods.length > 0) {
            requireMods.forEach(function (mod) {
                callback(mod, fileName);
            });
        }
    });
}

/**
 * 在当前文件中检测require的模块对应的文件是否存在，文件名区分大小写
 *
 * @param  {Array} fileList  文件集合
 * @param  {String} targetFile  目标文件
 * @param  {String} fileName 当前文件
 * @param  {String} requireMod  当前文件当前分析的模块
 */
function checkExistCaseSensitive(fileList, targetFile, fileName, requireMod) {
    // 如果存在，则还需要检测大小写
    if (fs.existsSync(targetFile)) {
        fileList.forEach(function (fileItem, index) {
            if (fileItem.filePath !== targetFile) {
                if (
                    fileItem.filePath.toLowerCase()
                    ===
                    targetFile.toLowerCase()
                ) {
                    edp.log.error(
                        '→ In the file `%s%s`, require path `%s` '
                            + 'is not exist(case insensitive)',
                        fileName, EXT.JS, requireMod
                    );
                }
            }
        });
    }
    else {
        edp.log.error(
            '→ In the file `%s%s`, require path `%s` is not exist',
            fileName, EXT.JS, requireMod
        );
    }
}

module.exports = function(args, opts) {
    edp.log.info('Checking require path...');

    // 判断是否是package类项目，默认为project类项目
    var isPackage = !!opts['package'];

    // 检测package类项目检测所有非依赖包的require全部是相对路径
    if (isPackage) {
        var packageConfigPath = edp.path.join(process.cwd(), 'package.json');
        if (!fs.existsSync(packageConfigPath)) {
            edp.log.error('→ No such file %s', packageConfigPath);
            return;
        }

        var packageConfig = {};

        try {
            packageConfig = JSON.parse(
                fs.readFileSync(packageConfigPath, 'utf8')
            );
        }
        catch (ex) {
            edp.log.error(
                'JSON.parse failed, maybe it\'s invalid json format.'
            );
            return;
        }

        // package.json里的dependencies和devDependencies
        var dependenciesObj = edp.util.mix(
            packageConfig.dependencies,
            packageConfig.devDependencies
        );

        // 当前文件夹内的文件集合
        var fileList = getJSFiles(process.cwd(), isPackage);

        analyzeModPath(fileList, function (mod, fileName) {
            // dependencies配置的模块不检测
            if (!dependenciesObj[mod]) {
                if (!edp.path.isLocalPath(mod)) {
                    edp.log.error(
                        '→ In the file `%s%s`, require path `%s` '
                                + 'is not a relative path',
                        fileName, EXT.JS, mod
                    );
                }
            }
        });
    }
    // 检测project类项目依赖于module.conf
    else {
        moduleConfigPath = edp.path.join(process.cwd(), 'module.conf');
        if (!fs.existsSync(moduleConfigPath)) {
            edp.log.error('→ No such file %s', moduleConfigPath);
            return;
        }

        try {
            moduleConfig = JSON.parse(
                fs.readFileSync(moduleConfigPath, 'utf8')
            );
        }
        catch (ex) {
            edp.log.error(
                'JSON.parse failed, maybe it\'s invalid json format.'
            );
            return;
        }

        // moduleConf baseUrl 文件夹内的文件集合
        var fileList = getJSFiles(moduleConfig.baseUrl);
        analyzeModPath(fileList, function (mod, fileName) {
            // require的模块对应的路径
            var modPath = edp.esl.getModuleFile(mod, moduleConfigPath);
            checkExistCaseSensitive(fileList, modPath, fileName, mod);
        });
    }
};