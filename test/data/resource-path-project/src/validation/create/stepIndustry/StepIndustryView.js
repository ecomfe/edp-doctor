/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    // require template
    require( 'tpl!./stepIndustry.tpl.html' );
    var Controller = require( 'er/controller' );
    var FormView = require( 'ecma/mvc/FormView' );
    var config = require( './config' );
    var date = require('esui/lib/date');
    var moment = require('moment');
    var dialog = require('esui/Dialog');

    /**
     * [Please Input View Description]
     * 
     * @constructor
     */
    function ValidationCreateStepIndustryView() {
        FormView.apply( this, arguments );
    }
    
    ValidationCreateStepIndustryView.prototype = {
        template: 'TPL_validation_create_stepindustry',

        uiProperties: {
            uploader: {
                text: '选择文件',
                action: config.uploadUrl,
                name: 'filedata',
                accept: 'image/*'
            }
        },

        uiEvents: {
            uploader: {
                fail: function() {
                    dialog.alert({
                        'title' : '提示',
                        'content' : '上传失败'
                    });
                }
            },

            dateEnd : {
                change: function () {
                    var calendar = this.get('dateEnd');
                    var date = calendar.rawValue;
                    this.checkDateEnd(calendar);
                    this.model.set('dateEnd', moment(date).format('YYYY-MM-DD'), {silent:true});

                }
            },

            industryType: {
                change: function () {
                    var label = this.get('tipsLabel');
                    var typeMap = config.typeMap;
                    var type = this.get('industryType').getValue();
                    label.setText(typeMap[type]);
                }
            },

            deleteButton: {
                click: function () {
                    var view = this;
                    dialog.confirm({
                        'title': '温馨提示',
                        'content': '确定要删除本条资质？',
                        'skin': 'confirm',
                        'onok': function () {
                            view.fire('delete');
                        }
                    });
                }
            }
        },

        checkDateEnd: function (calendar) {
            var unsafeEnd = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
            if (calendar.rawValue.getTime() <= unsafeEnd.getTime()) {
                dialog.alert({
                    'title' : '温馨提示',
                    'content' : '失效日期距今不足一个月，请确认尽快更新有效期',
                    'skin' : 'alert'
                });
            }
        },

        enterDocument: function () {
            FormView.prototype.enterDocument.apply(this, arguments);

            var calendar = this.get('dateEnd');
            var uploader = this.get('uploader');
            var today = new Date();

            //时间控件的开始日期
            var begin = new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000);

            //时间控件的结束默认选中日期
            var defaultCreateTime = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000);
            var model = this.model;

            //设置可选区间
            calendar.setRange({
                'begin' : begin,
                'end' : new Date(2046, 10, 4)
            });

            if (!model.get('edit') && !model.get('update')) {
                //新建则填一个月后的时间
                calendar.setRawValue(defaultCreateTime);
                model.set('dateEnd', moment(calendar.getRawValue()).format('YYYY-MM-DD'));
            }
            else {
                calendar.setValue(model.getDefaultData().dateEnd);

                //给行业类型赋默认值
                var etSlt = this.get('industryType');
                etSlt.setValue(model.getDefaultData().industryType);

                //设置已上传文件
                if (model.getDefaultData().previewUrl) {
                    uploader.setRawValue({
                        previewUrl: model.getDefaultData().previewUrl
                    });
                }
            }
        }
    };

    require( 'er/util' ).inherits( ValidationCreateStepIndustryView, FormView );
    return ValidationCreateStepIndustryView;
} );