/**
 * @file 检查文件头是否有BOM
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */

var edp = require( 'edp-core' );
var fs = require( 'fs' );

module.exports = exports = function( args, opts ) {
    edp.log.info( 'Checking BOM...' );

    var util = require( './util' );

    var candidates = util.getCandidates(
        args,
        [ 'src/**/*.{js,css,less,html,htm,vm,phtml,tpl}' ]
    );

    if ( candidates.length ) {
        var invalidResource = [];
        invalidResource = candidates.filter(
            function ( item ) {
                var data = fs.readFileSync( item );
                return data[0] === 0xEF
                        && data[1] === 0xBB
                        && data[2] === 0xBF;
            }
        );

        var dump = function( hasBomPath ) {
            edp.log.info( '%s', hasBomPath );
            edp.log.warn( '→ %s', hasBomPath );
        };

        if ( invalidResource.length ) {
            invalidResource.forEach( dump );
            edp.rl.prompt(
                'Remove BOM ? [Y/N] ',
                function ( answer ) {
                    if ( answer.toLowerCase() === 'y' ) {
                        invalidResource.forEach(
                            function ( item ) {
                                var data = fs.readFileSync( item );
                                data = data.slice( 3 );
                                fs.writeFileSync(
                                    item,
                                    data
                                );
                            }
                        );
                    }
                }
            );
        }
    }
};