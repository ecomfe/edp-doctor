/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/util.js ~ 2014/03/29 16:12:13
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var fs = require( 'fs' );
var path = require( 'path' );
var edp = require( 'edp-core' );

/**
 * @param {Array.<string>} fileset 文件的集合.
 */
exports.checkRequirePath = function( fileset ) {
    var invalidResource = {};
    function addInvalidResource( resource, file ) {
        if ( !invalidResource[ file ] ) {
            invalidResource[ file ] = [];
        }
        invalidResource[ file ].push( resource );
    }

    var modules = fileset.map(function( item ){
        var ast = edp.esl.getAst( fs.readFileSync( item, 'utf-8' ) );
        var moduleInfo = edp.esl.analyseModule( ast );

        if ( !moduleInfo || !moduleInfo.actualDependencies) {
            return null;
        }

        moduleInfo.file = item;

        return moduleInfo;
    }).filter(function( item ){ return !!item; });

    var moduleConfigFile = path.resolve( process.cwd(), 'module.conf' );

    modules.forEach(function( mod ){
        mod.actualDependencies.forEach(function( depId ){
            if ( depId === 'require' || depId === 'exports' || depId === 'module' ) {
                return;
            }

            var rv = edp.esl.toUrl(
                depId,
                mod.id,
                mod.file,
                moduleConfigFile
            );

            if ( rv.resource ) {
                var resourceUrl = rv.resource.replace( /\.js$/, '' );
                if ( !fs.existsSync( resourceUrl ) ) {
                    addInvalidResource( resourceUrl, mod.file );
                }
            }

            if ( rv.file && !fs.existsSync( rv.file ) ) {
                addInvalidResource( rv.file, mod.file );
            }
        });
    });

    function dump( resourceUrl ) {
        edp.log.error( '→ %s', resourceUrl);
    }

    if ( Object.keys( invalidResource ).length ) {
        for ( var file in invalidResource ) {
            edp.log.info( '%s', path.relative( process.cwd(), file ) );
            invalidResource[ file ].forEach( dump );
        }
    }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
