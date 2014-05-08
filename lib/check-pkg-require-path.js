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
        edp.log.error( '¡ú No such file %s', pkgConfig );
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

    var candidates = util.getCandidates(
        args,
        [
            '**/*.js',
            '!output/**',
            '!dep/**',
            '!test/**',
            '!node_modules/**'
        ]
    );

    if ( candidates.length ) {
        var realCandidates = [];
        candidates.forEach(
            function (item) {
                if ( util.isIgnored( item, '.doctorignore' ) ) {
                    return;
                }
                realCandidates.push( item );
            }
        );
        util.checkRequirePath( realCandidates );
    }
};






















/* vim: set ts=4 sw=4 sts=4 tw=100: */
