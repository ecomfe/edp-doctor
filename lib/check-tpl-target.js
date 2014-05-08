/**
 * @file 检查重复的target名字
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */
var edp = require( 'edp-core' );

/**
 * 项目粒度的target存储
 *
 * @type {Object}
 */
var allTargets = {};

/**
 * 检测模板文件中的target
 *
 * @param  {string} file 文件路径
 */
function checkTplTarget( file ) {
    var data = edp.fs.readFileSync( file );
    var pattern = /^(<\!--\s+target:\s+)(\b\w+\b)/gm;
    var invalidResource = [];
    var tmp = {};
    while ( !!( match = pattern.exec( data ) ) ) {
        var curMatch = match[ 2 ];
        if ( !tmp[ curMatch ] ) {
            tmp[ curMatch ] = true;
            if ( !allTargets[ curMatch ] ) {
                allTargets[ curMatch ] = [];
            }
            allTargets[ curMatch ].push( file );
        }
        // 在当前文件中target已经重复了，直接抛出信息
        // 不用再检测其他文件中是否有重名的target了，
        // 因此要在allTargets中去掉当前target对应的这个文件，
        else {
            allTargets[ curMatch ].splice(
                allTargets[ curMatch ].indexOf( curMatch ),
                1
            );
            invalidResource.push( curMatch );
        }
    }

    if ( invalidResource.length ) {
        edp.log.info( '%s', file );
        invalidResource.forEach(
            function ( name ) {
                edp.log.error( '→ Target name `%s` is already exist', name );
            }
        );
    }
}

module.exports = exports = function(args, opts) {
    edp.log.info( 'Checking tpl target...' );

    var util = require('./util');

    var candidates = util.getCandidates(
        args,
        [ 'src/**/*.tpl', 'src/**/*.tpl.html' ]
    );

    if ( candidates.length ) {
        candidates.forEach(
            function (item) {
                if ( util.isIgnored( item ) ) {
                    return;
                }
                checkTplTarget( item );
            }
        );
    }

    Object.keys( allTargets ).forEach(
        function ( name ) {
            if ( allTargets[ name ].length > 1 ) {
                edp.log.info( '%s', allTargets[name].map(
                    function ( item ) {
                        return item;
                    }
                ));
                edp.log.error( '→ Target name `%s` is already exist', name );
            }
        }
    );
};
