/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    //var Model = require( 'er/Model' );
    var Model = require( 'ecma/mvc/FormModel' );
    var datasource = require( 'er/datasource' );
    var config = require('./config');

    /**
     * [Please Input Model Description]
     * 
     * @constructor
     */
    function ValidationCreateStepValidateModel(args) {
        if (args.id) {
            this.defaultArgs = {id : args.id};
            this.formRequester = config.api.settingDefaultUrl;
        }   else {
            this.formRequester = config.api.contactInfoUrl;
        }
        
        this.submitRequester = config.api.settingSubmitUrl;
        Model.apply( this, arguments );
    }

    ValidationCreateStepValidateModel.prototype = {
        datasource: {
            contactInfo: function (model) {
                if (model.get('id')) {
                    return datasource.constant(config.api.contactInfoUrl);
                }
                else {
                    return datasource.constant({});
                }
            }
        },

        getExtraData: function () {
            return {
                id : this.get('id')
            };
        },

        validateSubmitData: function() {
            if (this.get('isAccountFail')) {
                return {};
            } else {
                return true;
            }
        }
    };
    

    // return模块
    require( 'er/util' ).inherits( ValidationCreateStepValidateModel, Model );
    return ValidationCreateStepValidateModel;
} );
