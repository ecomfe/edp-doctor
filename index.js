/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * index.js ~ 2014/02/12 21:25:18
 * @author leeight(liyubei@baidu.com)
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

    // 检查项目中是否存在相同的文件
    // TODO
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
