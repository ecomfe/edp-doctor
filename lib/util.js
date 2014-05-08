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

/**
 * 获取待检测的文件集合
 *
 * @param  {Array} args     命令运行参数
 * @param  {Array} patterns 匹配的正则规则集合
 *
 * @return {Array.<string>}
 */
exports.getCandidates = function( args, patterns ) {
    var candidates = [];

    if ( !args.length ) {
        candidates = edp.glob.sync( patterns );
    }
    else {
        for( var i = 0; i < args.length; i ++ ) {
            var target = args[ i ];
            if ( !fs.existsSync( target ) ) {
                edp.log.warn( 'No such file or directory %s', target );
                continue;
            }

            var stat = fs.statSync( target );
            if ( stat.isDirectory() ) {
                target = target.replace( /[\/|\\]+$/, '' );
                candidates.push.apply(
                    candidates, edp.glob.sync( target + '/' + patterns[ 0 ] ) );
            }
            else if ( stat.isFile() ) {
                candidates.push( target );
            }
        }
    }

    return candidates;
};

var _IGNORE_CACHE = {};

/**
 * 判断一下是否应该忽略这个文件.
 * @param {string} file 需要检查的文件路径.
 * @param {string=} name ignore文件的名称.
 * @return {boolean}
 */
exports.isIgnored = function( file, name ) {
    var ignorePatterns = null;

    name = name || '.doctorignore';
    file = edp.path.resolve( file );

    var key = name + '@'  + edp.path.dirname( file );
    if ( _IGNORE_CACHE[ key ] ) {
        ignorePatterns = _IGNORE_CACHE[ key ];
    }
    else {
        var options = {
            name: name,
            factory: function( item ){
                var config = {};
                exports.getIgnorePatterns( item ).forEach(function( line ){
                    config[ line ] = true;
                });
                return config;
            }
        };
        var ignorePatterns = edp.util.getConfig(
            edp.path.dirname( file ),
            options
        );

        _IGNORE_CACHE[ key ] = ignorePatterns;
    }

    var bizOrPkgRoot = process.cwd();
    try {
        bizOrPkgRoot = edp.path.getRootDirectory();
    }
    catch( ex ) {
    }

    var dirname = edp.path.relative( bizOrPkgRoot, file );
    var isMatch = edp.glob.match( dirname, Object.keys( ignorePatterns ) );

    return isMatch;
};


/**
 * @return {Array.<string>}
 */
exports.getIgnorePatterns = function( file ) {
    if ( !fs.existsSync( file ) ) {
        return [];
    }

    var patterns = fs.readFileSync( file, 'utf-8' ).split( /\r?\n/g );
    return patterns.filter(function( item ){
        return item.trim().length > 0 && item[ 0 ] !== '#';
    });
};













/* vim: set ts=4 sw=4 sts=4 tw=100: */
