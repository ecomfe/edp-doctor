/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * index.js ~ 2014/02/12 21:25:18
 * @author leeight(liyubei@baidu.com)
 *         ielgnaw(wuji0223@gmail.com)
 * @version $Revision$
 * @description
 *
 **/
var fs = require('fs');
var edp = require( 'edp-core' );

exports.start = function (args, opts) {
    // 如果output目录存在，检查css引用的img是否正确
    require( './lib/check-output.js' )( args, opts );

    // 检查项目的配置是否正常
    require( './lib/check-project-config.js' )( args, opts );

    // 检查module.conf配置内容是否正常，比如paths，deps之类的
    require( './lib/check-module-config.js' )( args, opts );

    // 检查引用路径是否正确
    require( './lib/check-require-path.js' )( args, opts );

    // 检查项目中是否存在相同的文件
    // TODO

    // 执行自定义的检查
    // var rootDirectory = edp.path.getRootDirectory();
    var rootDirectory = process.cwd();
    if ( rootDirectory ) {
        var file = edp.path.join( rootDirectory, 'edp-doctor.js' );
        if ( fs.existsSync( file ) ) {
            var doctor = require( file );
            if ( typeof doctor.diagnosis === 'function' ) {
                doctor.diagnosis( edp );
            }
        }
    }
}

if ( module === require.main ) {
    exports.start();
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
