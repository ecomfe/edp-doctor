/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/check-project-config.js ~ 2014/02/24 10:46:57
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var edp = require( 'edp-core' );

var fs = require( 'fs' );
var path = require( 'path' );

module.exports = function(args, opts) {
    console.log('');
    edp.log.info( 'Checking project configuration...' );

    var edpproj = path.join( process.cwd(), '.edpproj' );

    if ( !fs.existsSync( edpproj ) ) {
        edp.log.error( '→ No such directory %s', edpproj );
    }

    var moduleConfig = path.join( process.cwd(), 'module.conf' );
    if ( !fs.existsSync( moduleConfig ) ) {
        edp.log.error( '→ No such file %s', moduleConfig );
    }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
