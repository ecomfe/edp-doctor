/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    // require template
    //require( 'er/tpl!./check.tpl.html' );
    require( 'tpl!./check.tpl.html' );

    var formView = require('ecma/mvc/FormView');
    var dialog = require('esui/Dialog');
    var io = require('ecma/io/serverIO');
    var locator = require('er/locator');
    
    /**
     * [Please Input View Description]
     * 
     * @constructor
     */
    function ValidationCheckCheckView() {
        formView.apply( this, arguments );
    }
    
    ValidationCheckCheckView.prototype = {
        template: 'TPL_validation_check_check',

        uiProperties: {
        },

        uiEvents: {
            pay: {
                click: function () {
                    var model = this.model;
                    var formData = model.get('defaultFormData');

                    //不是通过list的查看过来的
                    if (!model.get('preview')) {
                        if (formData.hasPayed) {
                            //如果之前已经支付过，则提交审批
                            io.post('/data/bk/validationInfo/pay', {
                                id: model.get('id')
                            }).then(function() {
                                dialog.alert({
                                    'title': '系统提示',
                                    'content': '已提交审批，我们将在3个工作日内审批完毕，请耐心等待。',
                                    'onok': function() {
                                        locator.redirect('#/validation/list');
                                    }
                                });
                            },function () {});
                        } else {
                            dialog.confirm({
                                'title': '操作提示',
                                'content': '您将从账户预算中支付' + formData.paymentPrice + '元，损失框架优惠' + formData.bonusLost + '元，您确认现在支付吗？',
                                'onok': function() {
                                    io.post('/data/bk/validationInfo/pay', {
                                        'id': model.get('id')
                                    }).then(function(result) {
                                        if (result.hasEnoughMoney) {
                                            dialog.alert({
                                                'title': '付款信息',
                                                'content': '恭喜您，支付成功。\n' + '我们将在3个工作日内审批完毕，请耐心等待。',
                                                'type' : 'success',
                                                'onok': function() {
                                                    locator.redirect('#/validation/list');
                                                }
                                            });
                                        } else {
                                            //余额不足则提示去充值
                                            dialog.confirm({
                                                'title': '付款信息',
                                                'content': '抱歉，您当前账户余额不足，请尽快充值。',
                                                'okText' : "去充值",
                                                'type' : 'warning',
                                                'onok': function() {
                                                    window.open('http://caiwu.baidu.com/fp-netpay/pay/index');
                                                }
                                            });
                                        }
                                    }, function(data) {});
                                }
                            });
                        }
                    }      
                }
            },

            back : {
                click: function () {
                    locator.redirect('#/validation/list');
                }
            }
        },

        enterDocument: function () {
            formView.prototype.enterDocument.apply(this, arguments);

            if (this.model.get('preview')) {
                this.get('pay').main.style.display = 'none';
            }
        }
    };

    require( 'er/util' ).inherits( ValidationCheckCheckView, formView );
    return ValidationCheckCheckView;
} );
