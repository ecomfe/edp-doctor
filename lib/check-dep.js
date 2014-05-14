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
 * dep目录下除了`packages.manifest`文件以外，其他的应该都是文件夹
 *
 * 当某个子目录有一个不符合规范时，就不需要检测该子目录下的其他文件了
 *
 * @param {string} item dep下的子目录/子文件
 */
function checkDep( item ) {
    if ( item === 'packages.manifest') {
        return;
    }

    item = edp.path.join( 'dep', item );

    var invalidResource = [];

    var stat = fs.statSync( item );
    if ( !stat.isDirectory() ) {
        invalidResource.push( {
            type: 1    // 不是文件夹
        } );
    }
    else {
        fs.readdirSync( item ).filter(
            function ( x ) {
                // 过滤`item`目录下的文件，只选择目录
                return fs.statSync(
                    edp.path.join( item, x )
                ).isDirectory();
            }
        ).some(
            function( x ) {
                var relativePath = edp.path.join( item, x );

                // 当item下有一个子目录不符合semver规范
                // 或者该子目录下没有package.json时，该子目录就不符合了，
                // 就不需要再继续检测当前item了，继续检测下一个item
                if ( !semver.valid( x ) ) {
                    invalidResource.push( {
                        type: 3,    // 不符合semver的规定
                        path: relativePath
                    } );
                    return true;
                }
                if (
                    !fs.existsSync(
                        edp.path.join( relativePath, 'package.json' )
                    )
                ) {
                    invalidResource.push( {
                        type: 2,    // package.json不存在
                        path: edp.path.join( relativePath, 'package.json' )
                    } );
                    return true;
                }
            }
        );
    }

    if ( invalidResource.length ) {
        edp.log.info( '%s', item );

        invalidResource.forEach(
            function ( invalidRes ) {
                if ( invalidRes.type == 1 ) {
                    edp.log.warn( ''
                        + 'Only packages.manifest is allowed '
                        + 'in the dep directory.'
                    );
                }
                else if ( invalidRes.type == 2 ) {
                    edp.log.warn( '→ No such file %s', invalidRes.path );
                }
                else if ( invalidRes.type == 3 ) {
                    edp.log.warn( '%s is invalid semver', invalidRes.path );
                }
            }
        );
    }

}

module.exports = exports = function( args, opts ) {
    edp.log.info( 'Checking dep directory...' );

    fs.readdirSync( 'dep' ).forEach( checkDep );
};