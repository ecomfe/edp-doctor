/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/check-biz-require-path.js ~ 2014/03/30 19:56:25
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * 检查biz项目里面的require-path是否正确.
 **/
var fs = require( 'fs' );
var edp = require( 'edp-core' );

module.exports = exports = function( args, opts ) {
    var moduleConfigFile = edp.path.join( process.cwd(), 'module.conf' );
    if ( !fs.existsSync( moduleConfigFile ) ) {
        edp.log.error( '→ No such file %s', moduleConfigFile );
        return;
    }

    var moduleConfig;
    try {
        moduleConfig = JSON.parse(
            fs.readFileSync( moduleConfigFile, 'utf8' )
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
        [ moduleConfig.baseUrl + '/**/*.js' ]
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
