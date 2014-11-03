/**
 * @file 检查 html 中擅自修改的 require.config
 * @author ielgnaw(wuji0223@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var edp = require('edp-core');
var util = require('./util');


/**
 * 比较 paths 配置
 *
 * @param {Object} pathsInHtml html 文件中的 paths 配置
 * @param {Object} pathsInConf module.conf 中的 paths 配置
 * @param {string} fileName 当前检测文件的文件名
 *
 * @return {Array} 不合法的集合
 */
function comparePaths(pathsInHtml, pathsInConf, baseName) {
    var invalids = [];

    if (!pathsInHtml && !pathsInConf) {
        return invalids;
    }

    function deal(validPaths, bName) {
        var arr = Object.keys(validPaths);
        arr.forEach(
            function (property) {
                var hValue = pathsInHtml && pathsInHtml[property];
                var cValue = pathsInConf && pathsInConf[property];
                if (hValue && cValue) {
                    if (hValue != cValue) {
                        invalids.push(property + ' (in ' + bName + ')');
                    }
                }
                else {
                    invalids.push(property + ' (in ' + bName + ')');
                }
            }
        );
    }

    if (pathsInHtml) {
        deal(pathsInHtml, baseName);
    }

    if (pathsInConf) {
        deal(pathsInConf, 'module.conf');
    }

    return invalids;
}


/**
 * 比较 packages 配置
 *
 * @param {Object} packagesInHtml html 文件中的 packages 配置
 * @param {Object} packagesInConf module.conf 中的 packages 配置
 * @param {string} fileName 当前检测文件的文件名
 *
 * @return {Array} 不合法的集合
 */
function comparePackages(packagesInHtml, packagesInConf, baseName) {

    var invalids = [];

    if (!packagesInHtml && !packagesInConf) {
        return invalids;
    }
    else if (packagesInHtml && !packagesInConf) {
        invalids.push('packages not config in module.conf');
        return invalids;
    }
    else if (!packagesInHtml && packagesInConf) {
        invalids.push('packages not config in ' + baseName);
        return invalids;
    }

    function sortBy(x, y) {
        return x.name > y.name ? 1 : -1;
    }

    packagesInHtml.sort(sortBy);
    packagesInConf.sort(sortBy);

    var htmlLen = packagesInHtml.length;
    var confLen = packagesInConf.length;

    outerloop: for (var i = 0; i < htmlLen; i++) {
        var itemInHtml = packagesInHtml[i];
        for (var j = 0; j < confLen; j++) {
            var itemInConf = packagesInConf[j];
            if (itemInHtml.name != itemInConf.name
                || itemInHtml.location != itemInConf.location
                || itemInHtml.main != itemInConf.main
            ) {
                invalids.push(itemInHtml.name + ' (in ' + baseName + ')');
                break;
            }
            break outerloop;
        }
    }

    return invalids;
}

/**
 * 检测文件中的 require.config 配合和 module.conf 中的配置是否一致
 * 1. baseUrl
 * 2. paths
 * 3. packages
 *
 * @param {string} file 文件路径
 * @param {Object} moduleConfInHtml 文件中的 require.config 配置
 * @param {Object} moduleConf module.conf 中的配置
 */
function checkRequireConfig(file, moduleConfInHtml, moduleConf) {
    var relativeUrl = edp.path.relative(process.cwd(), file);
    var baseName = path.basename(relativeUrl);
    var invalidResource = [];

    // 检测 baseUrl
    var baseUrlInHtml = moduleConfInHtml.baseUrl;
    var baseUrlInConf = moduleConf.baseUrl;

    // 获取当前检测的 html 的绝对路径
    var absoluteUrl = path.join(process.cwd(), file);

    // 当前 html 所在的文件夹的绝对路径
    var dirName = path.dirname(absoluteUrl);

    var calculateBaseUrl = path.resolve(dirName, baseUrlInHtml);

    if (calculateBaseUrl != path.join(process.cwd(), baseUrlInConf)) {
        invalidResource.push({
            msg: '`baseUrl` is not the same',
            url: relativeUrl
        });
    }

    // 检测 paths
    var invalidPaths = comparePaths(
        moduleConfInHtml.paths,
        moduleConf.paths,
        baseName
    );

    var invalidPathsDiff = [];
    invalidPaths.forEach(
        function (invalidPath) {
            invalidPathsDiff.push(invalidPath);
        }
    );

    if (invalidPathsDiff.length) {
        invalidResource.push({
            msg: ''
                + 'paths: `'
                + invalidPathsDiff.join(', ')
                + '`',
            url: relativeUrl
        });
    }

    // 检测 packages
    var invalidPackages = comparePackages(
        moduleConfInHtml.packages,
        moduleConf.packages,
        baseName
    );

    var invalidPackagesDiff = [];
    invalidPackages.forEach(
        function (invalidPackage) {
            invalidPackagesDiff.push(invalidPackage);
        }
    );

    if (invalidPackagesDiff.length) {
        invalidResource.push({
            msg: ''
                + 'packages: `'
                + invalidPackagesDiff.join(', ')
                + '`',
            url: relativeUrl
        });
    }

    function dump(invalidMap) {
        edp.log.error(
            '→ %s, %s',
            invalidMap.url,
            invalidMap.msg
        );
    }

    if (invalidResource.length) {
        edp.log.info(
            '%s, %s',
            edp.path.relative(process.cwd(), file),
            'You should modify module.conf when change require.config, do not change in HTML file'
        );
        invalidResource.forEach(dump);
    }

}

module.exports = function (args, opts) {

    if (!fs.existsSync('module.conf')) {
        return;
    }

    console.log('');
    edp.log.info('Checking require configuration...');

    var moduleConf = null;

    try {
        moduleConf = JSON.parse(fs.readFileSync('module.conf', 'utf-8'));

        var candidates = util.getCandidates(
            args,
            [
                '**/*.{html,htm,vm,phtml,tpl}',
                '!output/**',
                '!dep/**',
                '!test/**',
                '!node_modules/**'
            ]
        );

        // 匹配文件中的 require.config 内容
        var pattern = /require\.config\(([\s\S]*?)\)/mg;
        var match = null;
        candidates.forEach(
            function (candidate) {
                var data = edp.fs.readFileSync(candidate);
                data = data.replace(/'/g, '"');

                match = null; // reset match

                while (!!(match = pattern.exec(data))) {
                    var configStr = match[1];
                    checkRequireConfig(
                        candidate,
                        JSON.parse(configStr),
                        moduleConf
                    );
                }
            }
        );

    } catch (ex) {
        edp.log.error('JSON.parse failed, maybe it\'s invalid json format.');
    }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
