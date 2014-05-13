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
 * @param {Array.<string>} dirList dep目录下的文件夹
 */
function checkDep( dirList ) {
    var invalidResource = [];

    for ( var i = 0, len = dirList.length; i < len; i++ ) {
        var childDirItem = dirList[ i ];

        // 去掉最后的 /
        childDirItem = childDirItem.substring(
            0,
            childDirItem.length - 1
        );

        var versionInfo = childDirItem.slice(
            childDirItem.lastIndexOf( '/' ) + 1
        );

        if ( !semver.valid( versionInfo ) ) {
            invalidResource.push( {
                path: childDirItem
            } );
            break;
        }

        var pkgConfigPath = edp.path.join( childDirItem, 'package.json' );
        if ( !fs.existsSync( pkgConfigPath ) ) {
            invalidResource.push( {
                path: childDirItem,
                pkgPath: pkgConfigPath
            } );
        }
    }

    function dump( item ) {
        edp.log.info( '%s', edp.path.relative( process.cwd(), item.path ) );
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
        invalidResource.forEach( dump );
    }
}

module.exports = exports = function( args, opts ) {
    edp.log.info( 'Checking dep directory...' );

    var util = require( './util' );

    var candidates = util.getCandidates(
        args,
        [ 'dep/*/' ]  // 只找dep下的文件夹
    );

    if ( candidates.length ) {
        candidates.forEach(
            function ( childDir ) {
                if ( util.isIgnored( childDir ) ) {
                    return;
                }

                // dep目录下的文件夹
                var childDirItems = util.getCandidates(
                    [],
                    [ childDir + '/*/' ]  // 只找文件夹
                )

                checkDep( childDirItems );
            }
        );
    }
};