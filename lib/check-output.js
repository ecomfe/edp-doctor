/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/check-output.js ~ 2014/02/12 21:27:18
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 检查项目build完毕之后output的内容是否正确
 * 1. css引用的img是否正确
 * 2. html引用的css是否正确（TODO）
 **/
var edp = require( 'edp-core' );

var fs = require( 'fs' );
var path = require( 'path' );

/**
 * @param {string} file css文件的路径.
 */
function checkResouce( file ) {
    var data = edp.fs.readFileSync( file );
    var pattern = /\burl\s*\((["']?)([^\)]+)\1\)/g;
    var match = null;

    var invalidResource = [];
    while ( match = pattern.exec( data ) ) {
        var url = match[2];
        if ( edp.path.isLocalPath( url ) ) {
            var resourceUrl = path.normalize( path.join(path.dirname(file), url) );
            if ( !fs.existsSync( resourceUrl) ) {
                invalidResource.push( path.relative(process.cwd(), resourceUrl) );
            }
        }
    };

    if (invalidResource.length) {
        edp.log.info("%s", path.relative(process.cwd(), file));
        invalidResource.forEach(function( resourceUrl ){
            edp.log.error( "→ %s", resourceUrl);
        });
    }
}

module.exports = function(args, opts) {
    edp.log.info('Checking output directory...');

    if ( !fs.existsSync( 'output' ) ) {
        return;
    }

    function scanDir( dir ) {
        fs.readdirSync( dir )
            .sort(
                function( file ) {
                    var fullPath = path.resolve( dir, file );
                    if ( fs.statSync( fullPath ).isDirectory() ) {
                        return 1;
                    }

                    return -1;
                }
            )
            .forEach(
                function ( file ) {
                    var fullPath = path.resolve( dir, file );
                    var stat = fs.statSync( fullPath );
                    var extName = path.extname( file );
                    var name = path.basename( file, extName );

                    if ( stat.isFile() && /^\.css$/i.test( extName ) ) {
                        checkResouce( fullPath );
                    }
                    else if ( stat.isDirectory() && name != 'node_modules' ) {
                        scanDir( fullPath );
                    }
                }
            );
    }

    scanDir( 'output' );
}





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
