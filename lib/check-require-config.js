/**
 * @file 检查 html 中擅自修改的 require.config
 * @author ielgnaw(wuji0223@gmail.com)
 */

var fs = require('fs');
var edp = require('edp-core');
var _ = require('underscore');
var util = require('./util');

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
    var invalidResource = [];

    // 检测 baseUrl
    if (moduleConfInHtml.baseUrl != moduleConf.baseUrl) {
        invalidResource.push({
            msg: '`baseUrl` is not the same',
            url: relativeUrl
        });
    }

    // 检测 paths
    if (!_.isEqual(moduleConfInHtml.paths, moduleConf.paths)) {
        invalidResource.push({
            msg: '`paths` is not the same',
            url: relativeUrl
        });
    }

    // 检测 packages
    if (!_.isEqual(moduleConfInHtml.packages, moduleConf.packages)) {
        invalidResource.push({
            msg: '`packages` is not the same',
            url: relativeUrl
        });
    }

    function dump(invalidMap) {
        edp.log.error('→ %s, %s', invalidMap.url, invalidMap.msg);
    }

    if (invalidResource.length) {
        edp.log.info('%s', edp.path.relative(process.cwd(), file));
        invalidResource.forEach(dump);
    }

}

module.exports = function (args, opts) {

    if (!fs.existsSync('module.conf')) {
        return;
    }

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
