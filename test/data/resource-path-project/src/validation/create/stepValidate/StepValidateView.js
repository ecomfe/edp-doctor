/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    // require template
    require( 'tpl!./stepValidate.tpl.html' );

    //var UIView = require( 'ef/UIView' );
    var FormView = require( 'ecma/mvc/FormView' );
    var io = require('ecma/io/serverIO');
    var locator = require('er/locator');
    
    /**
     * [Please Input View Description]
     * 
     * @constructor
     */
    function ValidationCreateStepValidateView() {
        FormView.apply( this, arguments );
    }
    
    ValidationCreateStepValidateView.prototype = {
        template: 'TPL_validation_create_stepValidate',

        uiProperties: {
        },

        uiEvents: {
            baiduAccount: {
                blur: function () {
                    var model = this.model;
                    var tb = this.get('baiduAccount');
                    var lbl = this.get('accountInfo');
                    var account = tb.getRawValue();
                    if ( account && account !== '') {
                        //发请求检验帐号
                        io.post('/data/bk/baiduAccount/validate', {'baiduAccount' : account})
                        .then(function(data) {
                            lbl.setText(data.reason  || '');
                            if (data.available === false) {
                                model.set('isAccountFail', true);
                            } else {
                                model.set('isAccountFail', false);
                            }
                        },
                            function() {});
                    }
                }
            },

            prevButton: {
                click: function () {
                    var query = this.getQuery();
                    if (!this.model.get('edit')) {
                        query = query + '&edit=1';
                    }
                    if (query) {
                        locator.redirect('/validation/create/stepIndustry~' + query);
                    }
                    
                }
            }
        },

        getQuery: function () {
            var query = this.model.get('url').getSearch();
            return query;
        }
    };

    ValidationCreateStepValidateView.prototype.enterDocument = function () {
        FormView.prototype.enterDocument.apply(this, arguments);

        //如果词条状态为未创建，则置灰输入控件和跳转到付款页面的链接
        var wordStatus = this.model.get('defaultFormData').wordStatus;
        if (wordStatus === 'NOT_CREATED' || wordStatus === 'UNAVAILABLE') {
            //获取输入控件
            var form = this.get('form');
            var inputControls = form.getInputControls();
            for (var i = 0; i < inputControls.length; i++) {
                inputControls[i].setReadOnly(true);
            }
            var submitBtn = this.get('submit');
            submitBtn.setDisabled(true);
        }
    };

    require( 'er/util' ).inherits( ValidationCreateStepValidateView, FormView );
    return ValidationCreateStepValidateView;
} );
