/**
 * lib/check-tpl-target.js的测试用例
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */

var edp = require('edp-core');
var Project = edp.path.resolve(__dirname, 'data', 'resource-path-project');

var tplTargetCheck = require('../lib/check-tpl-target');

describe('Project: check tpl target', function () {
    it('default', function () {
        process.chdir(Project);
        tplTargetCheck();
    });
});
