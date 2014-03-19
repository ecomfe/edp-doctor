/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/doctor.js ~ 2013/05/11 19:14:35
 * @author leeight(liyubei@baidu.com)
 *         ielgnaw(wuji0223@gmail.com)
 * @version $Revision$
 * @description
 * 检查项目的情况，发现可能存在的问题
 **/

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [ 'project', 'package' ];

/**
 * @const
 * @type {string}
 */
cli.description = '检查项目的配置，发现可能存在的问题';

/**
 * @param {Array.<string>} args 命令行参数.
 * @param {Object.<string, string>} opts 命令的可选参数.
 */
cli.main = function(args, opts) {
    require( '../index' ).start( args, opts );
};

exports.cli = cli;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
