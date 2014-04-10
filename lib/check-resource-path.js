/**
 * @file 检查资源引用路径
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */

var edp = require( 'edp-core' );
var fs = require( 'fs' );


/**
 * 匹配css中图片的正则
 */
var REG_CSS_IMG = /\burl\s*\((["']?)([^\)]+)\1\)/g;

/**
 * 匹配html中图片的正则
 */
var REG_HTML_IMG = /<img[^>]+src\s*=\s*(['\"])([^'\"]+)\1[^>]*>/g;

/**
 * 检查引用的资源是否正确
 * @param {string} file 文件的路径.
 */
function checkResouce( file ) {
    var invalidResource = [];

    var pattern = /\.(css|less)$/.test( file ) ? REG_CSS_IMG : REG_HTML_IMG;
    var data = fs.readFileSync( file, 'utf-8' );

    var match = null;
    while ( !!( match = pattern.exec( data ) ) ) {
        var url = match[ 2 ];
        if ( !edp.path.isLocalPath( url ) || /(\{[\s\S]*\}|@\w+)/.test( url ) ) {
            continue;
        }

        var resourceUrl = edp.path.normalize(
            edp.path.join( edp.path.dirname( file ), url )
        );
        resourceUrl = resourceUrl.replace( /[#\?].*$/g, '' );
        if ( !fs.existsSync( resourceUrl ) ) {
            invalidResource.push( url );
        }
    }

    function dump( resourceUrl) {
        edp.log.error( '→ %s', resourceUrl );
    }

    if (invalidResource.length) {
        edp.log.info('%s', edp.path.relative( process.cwd(), file ) );
        invalidResource.forEach( dump );
    }
}

module.exports = function(args, opts) {
   edp.log.info( 'Checking resource path...' );

    // 检测src目录以及项目根目录下的css文件和html/tpl文件
    var srcDir = edp.path.join( process.cwd(), 'src' );
    if ( !fs.existsSync( srcDir ) ) {
        edp.log.error( '→ No such dir %s', srcDir );
        return;
    }

    edp.glob.sync([
        '**/*.{css,less,html,htm,vm,phtml,tpl}',
        '!**/output/**',
        '!**/test/**',
        '!**/node_modules/**'
    ]).forEach( checkResouce );
};
