/**
 * @file 入口模块
 * @author Justineo(justice360@gmail.com)
 */

define(
    function (require) {
        var globalConfig = require('../config');
        var u = require('underscore');

        // 激活扩展
        function activateExtensions() {
            require('ecma/extension/hooks').activate();
            require('ecma/extension/underscore').activate();
            require('ecma/extension/ui').activate();
        }

        function initErConfigs() {
            var erConfig = require('er/config');
            erConfig.indexURL = globalConfig.index || '/';
        }

        activateExtensions();

        function start(session, constants) {
            // 系统常量和session信息配置
            var user = require('ecma/system/user');
            var consts = require('ecma/system/constants');

            user.init(session);
            consts.init(constants);

            require( ['esui', 'esui/Tab', 'esui/Label'], function (ui) {
                // 系统头部和导航esui对象
                var header = ui.init();
                var nav = header[0];
                var label = header[1];

                // 导航的一些依赖信息
                var locator = require('er/locator');
                var navConfig = globalConfig.nav;
                var tabs = [];
                var links = [];
                var activeIndex = location.hash.indexOf('setting') != -1 ? 1 : 0;

                // 导航配置
                u.each(navConfig, function (item, key) {
                    tabs.push({
                        title: key,
                    });
                    links.push(item);
                });
                nav.setProperties({
                    tabs: tabs,
                    activeIndex: activeIndex
                });

                // 导航激活事件
                // 一种是直接点击，通过控件click事件处理active样式，另一种是重定向过来的，要自己active
                nav.on('activate', function (e) {
                    if (e.formLocator) {
                        nav.activate(tabs[e.activeIndex]);
                        return;
                    }
                    else {
                        locator.redirect(links[e.activeIndex]);
                    }
                });
                // 重定向的时候通知导航active对应tab
                locator.on('redirect', function (e) {
                    debugger
                    var activeIndex = 0;
                    if (e.url.indexOf('setting') != -1) {
                        activeIndex = 1;
                    }
                    nav.fire('activate', {
                        activeIndex: activeIndex,
                        formLocator: true
                    });
                });

                // 设置头部的登录信息
                if (user.visitor && user.visitor.userName) {
                    label.setText(user.visitor.userName);
                }
                else {
                    label.setText('admin');
                }

            } );

            // 启动er
            initErConfigs();
            require('er').start();
        }


        /**
         * 初始化系统启动
         *
         * @inner
         */
        function init() {
            debugger
            var io = require('ecma/io/serverIO');
            var Deferred = require('er/Deferred');

            var api = globalConfig.api;
            Deferred.all(
                api.user(),
                api.constants()
            ).then(start);
        }

        return {
            init: init
        };
    }
);
