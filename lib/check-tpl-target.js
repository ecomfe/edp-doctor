/**
 * @file 检查重复的target名字
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */
var edp = require('edp-core');

/**
 * 检测模板文件中的target
 *
 * @param  {string} file 文件路径
 */
function checkTplTarget(file) {
    var data = edp.fs.readFileSync(file);
    var pattern = /^(<\!--\s+target:\s+)(\b\w+\b)/gm;
    var invalidResource = [];
    var tmp = {};
    while (!!( match = pattern.exec(data))) {
        var curMatch = match[2];
        if (!tmp[curMatch]) {
            tmp[curMatch] = true;
        }
        else {
            invalidResource.push(curMatch);
        }
    }

    if (invalidResource.length) {
        edp.log.info('%s', edp.path.relative(process.cwd(), file));
        invalidResource.forEach(function(resourceUrl){
            edp.log.error('→ Target name `%s` is already exist', resourceUrl);
        });
    }
}

module.exports = exports = function(args, opts) {
    edp.log.info('Checking tpl target...');
    edp.glob.sync(
        ['src/**/*.tpl', 'src/**/*.tpl.html']
    ).forEach(
        function (file) {
            checkTplTarget(file);
        }
    );
};