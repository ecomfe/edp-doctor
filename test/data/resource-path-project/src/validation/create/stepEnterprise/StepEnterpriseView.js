/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    // require template
    //require( 'er/tpl!./stepEnterprise.tpl.html' );
    require( 'tpl!./stepEnterprise.tpl.html' );

    //var UIView = require( 'ef/UIView' );
    var FormView = require( 'ecma/mvc/FormView' );
    var sysInfo = require('ecma/system/constants');
    var select = require('esui/Select');
    var calendar = require('esui/Calendar');
    var config = require('../../config');
    var date = require('esui/lib/date');
    var moment = require('moment');
    var dialog = require('esui/Dialog');
    var locator = require('er/locator');
    
    /**
     * [Please Input View Description]
     * 
     * @constructor
     */
    function ValidationCreateStepEnterpriseStepEnterpriseView() {
        FormView.apply( this, arguments );
    }
    
    ValidationCreateStepEnterpriseStepEnterpriseView.prototype = {
        template: 'TPL_validation_create_stepenterprise_stepenterprise',

        uiProperties: {
            uploader: {
                text: '选择文件',
                action: config.uploadUrl,
                name: 'filedata',
                accept: 'image/*'
            },

            dateEnd: {

            }
        },

        uiEvents: {
            uploader: {
                complete: function(e) {
                    var previewUrl = e.target.fileInfo.url || e.target.fileInfo.previewUrl;
                    this.model.set('previewUrl', previewUrl);

                    // var previewLink = this.get('previewLink');
                    // previewLink.main.href = previewUrl;
                },
                fail: function() {
                    dialog.alert({
                        'title' : '提示',
                        'content' : '上传失败'
                    });
                }
            },

            dateEnd : {
                'change': function () {
                    var calendar = this.get('dateEnd');
                    var date = calendar.rawValue;
                    this.checkDateEnd(calendar);
                    this.model.set('dateEnd', moment(date).format('YYYY-MM-DD'), {silent:true});

                }
            },

            enterpriseType: {
                'change': function () {
                    var label = this.get('qualiLbl');
                    var typeMap = {
                        'MAINLAND' : '企业法人营业执照',
                        'HK_EP' : '香港商业登记证',
                        'MAC_EP' : '澳门商业登记证',
                        'TW_EP' : '台湾营业执照',
                        'FOREIGN_EP' : '国外同等效力主体资质'
                    };
                    var type = this.get('enterpriseType').getValue();
                    label.setText(typeMap[type]);
                }
            },

            linkIndustry: {
                'click': function (e) {
                    this.controllTrackerRedirect(e);
                }
            },

            linkValidate: {
                'click': function(e) {
                    this.controllTrackerRedirect(e);
                }
            },

            linkPreview: {
                'click': function(e) {
                    this.controllTrackerRedirect(e);
                }
            }
        },

        controllTrackerRedirect: function (e) {
            var linkId = e.target.id;
            var linkMap = {
                'linkIndustry' : '/validation/create/stepIndustry',
                'linkValidate' : '/validation/create/stepValidate',
                'linkPreview' : '/validation/check'
            };

            var redirectUrl = linkMap[linkId];

            if (this.getQuery()) {
                var query = this.getQuery();
                locator.redirect(redirectUrl + '~' + query);
            } else {
                dialog.alert({
                    'title': '系统提示',
                    'content': '请先完成企业资质信息填写。'
                });
            }
        },

        getQuery: function () {
            var query = this.model.get('url').getSearch();
            return query;
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
        }
    };

    ValidationCreateStepEnterpriseStepEnterpriseView.prototype.enterDocument = function() {
        FormView.prototype.enterDocument.apply(this, arguments);

        var calendar = this.get('dateEnd');
        var today = new Date();

        //时间控件的开始日期
        var begin = new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000);

        //时间控件的结束默认选中日期
        var defaultCreateTime = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000);
        
        

        var model = this.model;

        if (!model.get('id')) {
            //新建则填一个月后的时间
            calendar.setRawValue(defaultCreateTime);
            model.set('dateEnd', moment(calendar.getRawValue()).format('YYYY-MM-DD'));
        } else {
            //编辑则填充用户之前填写的时间
            calendar.setValue(model.get('defaultFormData').dateEnd);
            //给企业类型赋默认值
            var etSlt = this.get('enterpriseType');
            etSlt.setValue(model.get('defaultFormData').enterpriseType);

            var uploader = this.get('uploader');
            //设置已上传文件
            if (model.getDefaultData().previewUrl) {
                uploader.setRawValue({
                    previewUrl: model.getDefaultData().previewUrl
                });
            }
        }

        //设置可选区间
        calendar.setRange({
            'begin' : begin,
            'end' : new Date(2046, 10, 4)
        });

        
    };

    require( 'er/util' ).inherits( ValidationCreateStepEnterpriseStepEnterpriseView, FormView );
    return ValidationCreateStepEnterpriseStepEnterpriseView;
} );
