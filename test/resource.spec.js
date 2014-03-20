/**
 * lib/check-resource-path.js的测试用例
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */

var edp = require('edp-core');
var Project = edp.path.resolve(__dirname, 'data', 'resource-path-project');

var resourcePathCheck = require('../lib/check-resource-path');

describe('Project: check resource path', function () {
    it('default', function () {
        process.chdir(Project);
        resourcePathCheck(null, {});
    });
});
