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
 * 获取文件夹内的js文件
 *
 * @param  {String} dir 目标文件夹
 */
function getJSFiles(dir) {
    var ret  = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        var absolutePath = edp.path.resolve(dir, file);
        var stat         = fs.statSync(absolutePath);
        var extName      = edp.path.extname(file);
        var fileName     = edp.path.basename(file, extName);
        if (stat && stat.isDirectory()) {
            ret = ret.concat(getJSFiles(absolutePath));
        }
        else {
            if (extName === EXT.JS) {
                var content = fs.readFileSync(absolutePath, 'utf8');
                ret.push(getRequireModule(fileName, absolutePath, content));
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
                    edp.log.error(''
                        + '→ In the file `'
                        + fileName
                        + EXT.JS
                        + '`, '
                        + 'require path `'
                        + requireMod
                        + '` is not exist(case insensitive)'
                    );
                }
            }
        });
    }
    else {
        edp.log.error(''
            + '→ In the file `'
            + fileName
            + EXT.JS
            + '`, '
            + 'require path `'
            + requireMod
            + '` is not exist'
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
        var fileList = getJSFiles(process.cwd());

        analyzeModPath(fileList, function (mod, fileName) {
            // dependencies配置的模块不检测
            if (!dependenciesObj[mod]) {
                if (!edp.path.isLocalPath(mod)) {
                    edp.log.error(''
                        + '→ In the file `'
                        + fileName
                        + EXT.JS
                        + '`, '
                        + 'require path `'
                        + mod
                        + '` is not a relative path'
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

/**
 * 获取文件中require的模块
 *
 * @param  {String} fileName 待分析文件
 * @param  {String} filePath 待分析文件的路径
 * @param  {String} content  文件内容
 */
function getRequireModule(fileName, filePath, content) {
    var res = {
        fileName: fileName,
        filePath: filePath,
        requireMods: []
    };

    // define({})或者define(function () {})
    // define factory主体的开始位置
    var index = content.indexOf('{');

    // 判断define factory里是否有require
    if (content.indexOf('require', index) === -1) {
        return res;
    }

    // content的长度
    var length = content.length;

    // 当前字符
    var curChar = null;

    // 圆括号集合
    var circleBracketStack = [];

    // 圆括号状态
    var circleBracketStatus = false;

    // 是否是模块名字
    var isModName = false;

    // 是否在放括号里
    var inSquareBracket = false;

    // 是否是正则
    var isReg = true;

    /**
     * 获取下一个字符
     */
    function getNextChar() {
        curChar = content.charAt(index++);
    }

    /**
     * 是否是空格
     */
    function isBlank() {
        return /\s/.test(curChar);
    }

    /**
     * 是否是引号
     */
    function isQuote() {
        return curChar === '"' || curChar === "'";
    }

    /**
     * 是否是字母
     */
    function isWord() {
        return /[\w$.]/.test(curChar);
    }

    /**
     * 处理引号的情况
     */
    function dealQuote() {
        var start = index;
        var c     = curChar;
        var end   = content.indexOf(c, start);

        if (!inSquareBracket) {
            if (content.charAt(end - 1) !== '\\') {
                index = end + 1;
            }
            else {
                while (index < length) {
                    getNextChar();
                    if (curChar == '\\') {
                        index++;
                    } else if (curChar === c) {
                        break;
                    }
                }
            }
            if (isModName) {
                res.requireMods.push(content.slice(start, index - 1));
                isModName = false;
            }
        }
        else {
            isModName = true;
            if (content.charAt(end - 1) != '\\') {
                index = end + 1;
            }
            else {
                while (index < length) {
                    getNextChar();
                    if (curChar == '\\') {
                        index++;
                    }
                    else if (curChar == c) {
                        break;
                    }
                }
            }
            if (isModName) {
                res.requireMods.push(content.slice(start, index - 1));
                isModName = false;
            }
        }
    }

    /**
     * 处理字母
     */
    function dealWord() {
        if (/[\w$.]/.test(content.charAt(index))) {
            var r   = /^[\w$.]+/.exec(content.slice(index - 1))[0];
            isModName = (/^require(\s*\.\s*)?$/.test(r));
            index   += r.length - 1;
            circleBracketStatus = ['if', 'for', 'while'].indexOf(r) !== -1;
            // if (circleBracketStatus) debugger;
            isReg = [
                'else',
                'in',
                'return',
                'typeof',
                'delete'
            ].indexOf(r) !== -1;
        }
        else {
            isModName = false;
            isReg = false;
        }
    }

    /**
     * 处理正则
     */
    function dealReg() {
        index--;
        while (index < length) {
            getNextChar();
            if (curChar === '\\') {
                index++;
            }
            else if (curChar === '/') {
                break;
            }
            else if (curChar === '[') {
                while (index < length) {
                    getNextChar();
                    if (curChar === '\\') {
                        index++;
                    }
                    else if (curChar === ']') {
                        break;
                    }
                }
            }
        }
    }

    while (index < length) {
        getNextChar();
        // debugger
        if (!isBlank()){
            if (isQuote()) {
                dealQuote();
                isReg = true;
            }
            else if (curChar === '/') {
                getNextChar();
                if (curChar === '/') {
                    index = content.indexOf('\n', index);
                    if (index === -1) {
                        index = content.length;
                    }
                    isReg = true;
                }
                else if (curChar === '*') {
                    index = content.indexOf('*/', index) + 2;
                    isReg = true;
                }
                else if (isReg) {
                    dealReg();
                    isReg = false;
                }
                else {
                    index--;
                    isReg = true;
                }
            }
            else if (isWord()) {
                dealWord();
            }
            else if (curChar === '(') {
                circleBracketStack.push(circleBracketStatus);
                isReg = true;
            }
            else if (curChar === ')') {
                isReg = circleBracketStack.pop();
            }
            else if (curChar === '[') {
                circleBracketStack.push(circleBracketStatus);
                isReg = true;
                if (isModName) {
                    inSquareBracket = true;
                }
            }
            else if (curChar === ',') {
                if(inSquareBracket){
                    circleBracketStack.push(circleBracketStatus);
                    isReg = true;
                }
            }
            else if (curChar === ']') {
                isReg = circleBracketStack.pop();
                // if (isModName) {
                    inSquareBracket = false;
                // }
            }
            else {
                isReg = curChar !== ']';
                isModName = false;
            }
        }
    }

    return res;
}