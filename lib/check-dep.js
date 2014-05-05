/**
 * @file 检查dep目录下面的东东是否是合法的package
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */
var edp = require( 'edp-core' );
var fs = require( 'fs' );

var semver = require( 'semver' );

/**
 * 检查dep目录下的东西是否是合法的
 * 1. 检查是否存在 package.json
 * 2. 检查目录名是否符合semver的要求
 *
 * @param {string} file 文件的路径.
 */
function checkDepDir( dir ) {

    var invalidResource = [];

    var pkgConfigPath = edp.path.join( dir, 'package.json' );
    if ( !fs.existsSync( pkgConfigPath ) ) {
        invalidResource.push( {
            path: dir,
            pkgPath: pkgConfigPath
        } );
    }

    var versionInfo = dir.slice( dir.lastIndexOf( '/' ) + 1 );

    if ( !semver.valid( versionInfo ) ) {
        invalidResource.push( {
            path: dir
        } );
    }

    function dump( item ) {
        if ( item.pkgPath ) {
            edp.log.warn( '→ No such file %s', item.pkgPath );
        }
        else {
            edp.log.warn(
                '→ The dep dir %s don\'t comply with semver spec',
                item.path
            );
        }
    }

    if ( invalidResource.length ) {
        edp.log.info( '%s', edp.path.relative( process.cwd(), dir ) );
        invalidResource.forEach( dump );
    }

}

module.exports = exports = function( args, opts ) {
    edp.log.info( 'Checking dep directory...' );

    var util = require( './util' );

    var candidates = util.getCandidates(
        args,
        [ 'dep/*/*' ]
    );

    if ( candidates.length ) {
        var realCandidates = [];
        candidates.forEach(
            function ( item ) {
                if ( util.isIgnored( item ) ) {
                    return;
                }
                checkDepDir( item );
            }
        );
    }
};