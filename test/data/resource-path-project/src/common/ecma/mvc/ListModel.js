/**
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file Model基类
 * @author Justineo(justice360@gmail.com)
 * @date $DATE$
 */

define(
    function (require) {
        var u = require('underscore');
        var util = require('er/util');
        var BaseModel = require('./BaseModel');
        var io = require('../io/serverIO');
        var ecmaUtil = require('ecma/util');

        /**
         * 业务`Model`基类
         *
         * @param {Object=} context 初始化时的数据
         *
         * @constructor
         * @extends ef/BaseModel
         */
        function ListModel(context) {
            BaseModel.call(this, context);
        }

        util.inherits(ListModel, BaseModel);

        ListModel.prototype.list;

        /**
         * 配置默认查询参数
         * 
         * 如果某个参数与这里的值相同，则不会加到URL中
         * 
         * 创建`Model`时，如果某个参数不存在，则会自动补上这里的值
         *
         * @type {Object}
         * @protected
         */
        ListModel.prototype.defaultArgs = {};

        /**
         * 默认查询参数
         *
         * 参考{@link ListModel#defaultArgs}属性的说明
         *
         * @return {Object}
         * @protected
         */
        ListModel.prototype.getDefaultArgs = function () {
            return u.defaults(this.defaultArgs || {}, { pageNo: 1 });
        };

        /**
        * 默认数据源
        */
        ListModel.prototype.defaultDatasource = {
            listPage: [
                {
                    retrieve: function (model) {
                        return model.listRequester(model.getQuery())
                            .then(function(data) {
                                var page = data;
                                page.tableData = page.result;
                                delete page.result;
                                return page;
                            });
                    },
                    dump: true
                }
            ],

            // 展示时间区间
            time: function (model) {
                var startTime = model.get('startTime');
                var endTime = model.get('endTime');

                var time = ecmaUtil.getTimeRange(startTime, endTime);
                return time;
            },

            // 分页URL模板，就是当前URL中把`page`字段替换掉
            urlTemplate: function (model) {
                var url = model.get('url');
                var path = url.getPath();
                // 由于`withQuery`会做URL编码，因此不能直接`query.page = '${page}'`，
                // 会被编码成`%24%7Bpage%7D`，此处只能直接操作字符串
                var query = url.getQuery();
                delete query.pageNo;
                var template = '#' + require('er/URL').withQuery(path, query);
                var delimiter = u.isEmpty(query) ? '~' : '&';
                template += delimiter + 'pageNo=${page}';
                return template;
            }
        };

        ListModel.prototype.getQuery = function () {
            var url = this.get('url');
            var query = url.getQuery();

            var defaultRange = ecmaUtil.getTimeRange({
                outputFormat: 'YYYYMMDDHHmmss'
            });

            query = u.chain(query)
                .defaults(this.getDefaultArgs())
                .defaults({
                    startTime: defaultRange.begin,
                    endTime: defaultRange.end
                })
                .extend(this.getExtraQuery())
                .value();

            return this.filterQuery(query);
        };

        ListModel.prototype.getExtraQuery = function () {
            return {};
        };

        ListModel.prototype.filterQuery = function(query) {
            return query;
        };

        return ListModel;
    }
);