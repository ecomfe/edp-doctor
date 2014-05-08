/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/check-pkg-require-path.js ~ 2014/03/29 17:26:44
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var fs = require( 'fs' );
var edp = require( 'edp-core' );

module.exports = exports = function( args, opts ) {
    var pkgConfig = edp.path.join( process.cwd(), 'package.json' );
    if ( !fs.existsSync( pkgConfig ) ) {
        edp.log.error( '→ No such file %s', pkgConfig );
        return;
    }

    var config = {};

    try {
        config = JSON.parse(
            fs.readFileSync( pkgConfig, 'utf8' )
        );
    }
    catch (ex) {
        edp.log.error(
            'JSON.parse failed, maybe it\'s invalid json format.'
        );
        return;
    }

    var util = require( './util' );
    var fileset = edp.glob.sync([
        '**/*.js',
        '!output/**',
        '!dep/**',
        '!test/**',
        '!node_modules/**'
    ]);
    util.checkRequirePath( fileset );
};






















/* vim: set ts=4 sw=4 sts=4 tw=100: */
