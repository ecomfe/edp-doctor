/**
 * @file 检查引用路径是否正确
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */
var edp = require( 'edp-core' );

module.exports = function( args, opts ) {
    console.log('');
    edp.log.info( 'Checking require path...' );

    if ( opts[ 'package' ] ) {
        require( './check-pkg-require-path' )( args, opts );
    }
    else {
        require( './check-biz-require-path' )( args, opts );
    }
};
