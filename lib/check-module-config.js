/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/check-module-config.js ~ 2014/02/28 13:53:45
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 检查module.conf的内容
 **/
var edp = require( 'edp-core' );

var fs = require( 'fs' );

/**
 * 1. 检查paths的配置是否正确
 * 2. 检查packages的配置是否正确
 */
function checkModuleConfig( moduleConfig ) {
    var baseUrl = moduleConfig.baseUrl;

    var paths = moduleConfig.paths;
    if ( paths ) {
        for ( var key in paths ) {
            var value = paths[ key ];
            if ( !edp.path.isLocalPath( value ) ) {
                continue;
            }

            if ( !fs.existsSync( value ) && !fs.existsSync( value + '.js' ) ) {
                if ( value.indexOf( baseUrl ) !== 0 ) {
                    edp.log.warn( "→ In the paths section, `%s' should begin with `%s'",
                        value, baseUrl );
                }
                else {
                    edp.log.warn( "→ No such file or directory `%s'", value );
                }
            }
        }
    }

    var packages = moduleConfig.packages;
    if ( packages && packages.length ) {
        for ( var i = 0; i < packages.length; i ++ ) {
            var pkg = packages[ i ];
            if ( !fs.existsSync( pkg.location ) ) {
                edp.log.warn("→ No such directory %s", pkg.location );
            }
        }
    }
}

module.exports = function(args, opts) {
    edp.log.info('Checking module.conf...');

    if ( !fs.existsSync( 'module.conf' ) ) {
        return;
    }

    var moduleConfig = null;
    try {
        moduleConfig = JSON.parse( fs.readFileSync( 'module.conf', 'utf-8' ) );
        checkModuleConfig( moduleConfig );
    } catch ( ex ) {
        edp.log.error('JSON.parse failed, maybe it\'s invalid json format.');
    }
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
