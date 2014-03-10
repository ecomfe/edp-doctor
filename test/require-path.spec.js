/**
 * lib/check-require-path.js的测试用例
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */

var edp = require('edp-core');
var Project = edp.path.resolve(__dirname, 'data', 'project');
var Package = edp.path.resolve(__dirname, 'data', 'package');

var requirePathCheck = require('../lib/check-require-path');

describe('Project: check require path', function () {
    it('default', function () {
        process.chdir(Project);
        requirePathCheck(null, {});
    });
});

describe('Package: check require path', function () {
    it('default', function () {
        process.chdir(Package);
        requirePathCheck(null, {'package': true});
    });
});