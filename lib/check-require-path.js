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

// 以 ./ 或者 ../开头
var PREFIX_DOT = /^\.+\//;

/**
 * moduleConfig配置
 *
 * @type {Object}
 */
var moduleConfig = {};

/**
 * moduleConf文件路径
 *
 * @type {string}
 */
var moduleConfigPath = '';

/**
 * 获取文件夹内的js文件
 *
 * @param  {string} dir 目标文件夹
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
                var ast = edp.esl.getAst(content, fileName);
                var moduleInfo = edp.esl.analyseModule(ast);

                var actualDependencies =
                    moduleInfo && moduleInfo.actualDependencies || null;

                if ( moduleInfo ) {
                    ret.push({
                        moduleId: moduleInfo.id,
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
    var moduleId;
    var requireMods;
    list.forEach(function (item) {
        fileName = item.fileName;
        filePath = item.filePath;
        moduleId = item.moduleId;
        requireMods = item.requireMods;
        if (requireMods && requireMods.length > 0) {
            requireMods.forEach(function (mod) {
                callback(mod, fileName, filePath, moduleId);
            });
        }
    });
}

/**
 * 在当前文件中检测require的模块对应的文件是否存在，文件名区分大小写
 *
 * @param  {Array} fileList  文件集合
 * @param  {string} targetFile  目标文件
 * @param  {string} fileName 当前文件
 * @param  {string} requireMod  当前文件当前分析的模块
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

/**
 * 获取插件资源路径
 *
 * @param  {string} resourceId       插件资源id
 * @param  {string} moduleConfigPath module.conf路径
 *
 * @return {string}                  插件资源的绝对路径
 */
function getResourceFile(resourceId, moduleConfigPath) {
    var tpl = edp.esl.getModuleFile(resourceId, moduleConfigPath);
    // 因为总是会追加.js后缀，因此我们需要删掉
    tpl = tpl.replace(/\.js$/, '');
    return tpl;
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
            // package类项目不用检测require、exports、module，
            // 都是相对路径，所以这里不用排除
            // dependencies配置的模块不检测
            if (!dependenciesObj[mod]) {
                if (!edp.path.isRelativePath(mod)) {
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
        analyzeModPath(
            fileList,
            /**
             * 模块分析的回调函数
             *
             * @param  {string} mod         依赖的模块
             * @param  {string} fileName    当前分析的文件名
             * @param  {string} filePath    当前分析的文件路径
             * @param  {string} curModuleId 当前分析的文件的模块名
             *                              如果是匿名模块，则此参数为空
             */
            function (mod, fileName, filePath, curModuleId) {
                // 排除 require、exports、module模块的检测
                if (
                    mod === 'require'
                    ||
                    mod === 'exports'
                    ||
                    mod === 'module'
                ) {
                    return;
                }

                // 插件的处理
                if (mod.indexOf('!') !== -1) {
                    var parts = mod.split('!');
                    var resourceId = parts[1];
                    if (edp.path.isLocalPath(resourceId)) {
                        var tpl = null;
                        // ./ 或者 ../ 开头的插件
                        // tpl!./tpl/list.tpl.html
                        // tpl!../tpl/list.tpl.html
                        if (PREFIX_DOT.test(resourceId)) {
                            if (!curModuleId) {
                                tpl = edp.path.normalize(
                                    edp.path.join(
                                        edp.path.dirname(filePath),
                                        resourceId
                                    )
                                );
                            }
                            else {
                                resourceId = edp.esl.resolveModuleId(
                                    resourceId,
                                    curModuleId
                                );
                                tpl = getResourceFile(
                                    resourceId,
                                    moduleConfigPath
                                );
                            }
                        }
                        // tpl!ecma/tpl/list.tpl.html
                        else {
                            tpl = getResourceFile(resourceId, moduleConfigPath);
                        }

                        // 有的项目里面会把tpl编译成js的
                        if (
                            tpl
                            &&
                            !(fs.existsSync(tpl) || fs.existsSync(tpl + '.js'))
                        ) {
                            edp.log.error(
                                '→ In the file `%s%s`, require path `%s` '
                                    + 'is not exist',
                                fileName, EXT.JS, mod
                            );
                        }
                    }
                }
                else {
                    var modPaths = [];
                    // relative id转换成 top-level id
                    if (PREFIX_DOT.test(mod)) {
                        // 当前依赖模块的top-level id
                        // 以当前模块的top-level id作为baseId去将
                        // 依赖的相对的模块id转换为绝对id
                        var requireModTopLevelId = '';
                        if (curModuleId) {
                            requireModTopLevelId = edp.esl.resolveModuleId(
                                mod,
                                curModuleId
                            );
                            modPaths.push(
                                edp.esl.getModuleFile(
                                    requireModTopLevelId,
                                    moduleConfigPath
                                )
                            );
                        }
                        else {
                            // 当前模块的top-level id
                            var topLevelIds = edp.esl.getModuleId(
                                filePath,
                                moduleConfigPath
                            );

                            topLevelIds.forEach(function (item) {
                                requireModTopLevelId = edp.esl.resolveModuleId(
                                    mod,
                                    item
                                );
                                modPaths.push(
                                    edp.esl.getModuleFile(
                                        requireModTopLevelId,
                                        moduleConfigPath
                                    )
                                );
                            });
                        }
                    }
                    else {
                        modPaths.push(
                            edp.esl.getModuleFile(mod, moduleConfigPath)
                        );
                    }
                    modPaths.forEach(function (modPath) {
                        checkExistCaseSensitive(
                            fileList,
                            modPath,
                            fileName,
                            mod
                        );
                    });
                }
            }
        );
    }
};
