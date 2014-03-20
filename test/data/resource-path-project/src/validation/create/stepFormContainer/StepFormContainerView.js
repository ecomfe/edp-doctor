/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    // require template
    require( 'tpl!./stepFormContainer.tpl.html' );
    var Controller = require( 'er/controller' );
    var ActionPanel = require( 'ef/ActionPanel' );
    var View = require( 'ecma/mvc/BaseView' );
    var u = require( 'underscore' );
    var dialog = require('esui/Dialog');
    var locator = require('er/locator');
    
    /**
     * [Please Input View Description]
     * 
     * @constructor
     */
    function ValidationCreateStepFormContainerView() {
        View.apply( this, arguments );
        // 现有表单个数
        this.formCount = 0;
        this.formIdIterator = 0;
        this.maxFormCount = 20;
        // 用来记录子action的map
        this.childActions = {};
        this.disable = false;
    }

    ValidationCreateStepFormContainerView.prototype = {
        template: 'TPL_validation_create_stepformcontainer',

        uiEvents: {
        },

        getQuery: function () {
            var query = this.model.get('url').getSearch();
            return query;
        },

        bindEvents: function () {
            var view = this;
            var model = this.model;
            var addButton = view.get('addButton');
            var saveButton = view.get('saveButton');
            var submitButton = view.get('submitButton');
            var skipButton = view.get('skipButton');
            var prevButton = view.get('prevButton');
            if (addButton) {
                addButton.on('click', function () {
                    if (!view.disable) {
                        view.addOneForm({
                            url: model.increasingUrl,
                            hasDeleteEvent: true
                        });
                    }
                });
            }

            if (saveButton) {
                saveButton.on('click', function () {
                    if (!view.disable) {
                        view.fire('save');
                    }
                });
            }

            if (submitButton) {
                submitButton.on('click', function () {
                    if (!view.disable) {
                        view.fire('submit');
                    }
                });
            }

            if (skipButton) {
                skipButton.on('click', function () {
                    if (!view.disable) {
                        var id = model.get('id');
                        locator.redirect('/validation/create/stepValidate~id=' + id);
                    }
                });
            }

            if (prevButton) {
                prevButton.on('click', function () {
                    var query = view.getQuery();
                    if (!view.model.get('edit')) {
                        query = query + '&edit=1';
                    }
                    if (query) {
                        locator.redirect('/validation/create/stepEnterprise~' + query);
                    }
                });
            }
            
            if (!model.get('update')) {
                View.prototype.bindEvents.apply(this, arguments);
            }
        },

        /**
         * 循环添加表单
         *
         * @param data {Object} 
         */
        addForms: function (data, url) {
            var view = this;
            u.each(data, function (formData, index) {
                view.addOneForm({
                    url: url,
                    options: {
                        defaultFormData: formData
                    },
                    hasDeleteEvent: true
                });
            });
        },

        /**
         * 添加一个表单的普通入口
         *
         * @param config {Object} 
         *      {
         *          url: '子action地址', 
         *          options: {
         *              defautlFormData: {
         *                  //塞入model.datasource的数据
         *              }
         *          }
         *      }
         */
        addOneForm: function (config) {
            // 限制表单个数
            if (this.formCount + 1 > this.maxFormCount) {
                dialog.alert({
                    'title' : '系统提示',
                    'content' : '最多只能创建' + this.maxFormCount + '个资质！'
                });
                return;
            }

            // 分配一个id创建一个新的actionpanel，把子actionpanel塞到表单容器里边
            var view = this;
            var options = config.options;
            var formContainer = document.getElementById('formContainer');
            var id = 'form' + this.formIdIterator++;
            this.formCount++;
            // 根据配置指定id，主题资质会传一个区别于行业资质的id进来
            if (config.id) {
                id = config.id;
            }
            else if (options && options.defaultFormData) {
                id = options.defaultFormData.id;
            }
            var panel = new ActionPanel({
                id: id
            });
            panel.appendTo(formContainer);
            // 收集起来呗，这里放到下边的回调里边做也可以，其实这里只有actionPanel
            // action在下边的回调之后才加到panel里边
            view.childActions[id] = panel;

            // 在新创建出来的actionpanel里边渲染子action
            Controller.renderChildAction(config.url, 'ctrl-default-' + id, options)
                .then(function (action) {
                    // 绑一下删除的事件
                    if (config.hasDeleteEvent) {
                        action.on('delete', function () {
                            view.fire('delete', {id: id});
                        });
                    }
                });
        },

        deleteForm: function (e) {
            // id在新建时是/form[0-9]+/的格式，因为新建的删除不需要通知后端，那时也没有行业资质id
            // id在编辑的时候是行业资质的id，因为删除请求是一个promise
            // 后端只会传被删除的行业资质id回来，所以要去每个子action的view的form里边找数据太
            // 麻烦了，在创建子action的时候就选择了两种key的方式
            if (e.id in this.childActions) {
                this.childActions[e.id].dispose();
                this.childActions[e.id].destroy();
                delete this.childActions[e.id];
                this.formCount--;
            }
            this.enableSubmit();
        },

        // 我觉得这个接口好像留多了。。。后端现在只返回global的error。。。
        notifuError: function (error) {
            // 伪代码：
            // 看一下是哪些id的panel出错了，在childAction中找到panel
            // 调用对应的FormView的notifyErrors去展示
        },

        disableSubmit: function () {
            this.disable = true;
        },

        enableSubmit: function () {
            this.disable = false;
        }
    };

    require( 'er/util' ).inherits( ValidationCreateStepFormContainerView, View );
    return ValidationCreateStepFormContainerView;
} );