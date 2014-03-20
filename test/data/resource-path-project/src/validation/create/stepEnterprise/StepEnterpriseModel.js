/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    var Model = require( 'ecma/mvc/FormModel' );
    var datasource = require( 'er/datasource' );
    var config = require('./config');
    var sysInfo = require('ecma/system/constants');
    var moment = require('moment/moment');
    var date = require('esui/lib/date');
    var dialog = require('esui/Dialog');

    /**
     * [Please Input Model Description]
     * 
     * @constructor
     */
    function ValidationCreateStepEnterpriseStepEnterpriseModel(args) {
        if (args.id) {
            this.defaultArgs = {id: args.id};
            this.formRequester = config.api.settingDefaultUrl;
        }

        this.submitRequester = config.api.settingSubmitUrl;
        
        Model.apply( this, arguments );
    }

    ValidationCreateStepEnterpriseStepEnterpriseModel.prototype = {
        datasource: {
            enterpriseType: function() {
                return sysInfo.get('enterprise_type');
            }
        },

        getExtraData: function () {
            var model = this;
            var paramDate = model.get('dateEnd') || model.get('defaultFormData').dateEnd;

            //编辑的时候加一个id
            if (model.get('edit') || model.get('update')) {
                return {
                    'dateEnd' : paramDate,
                    'previewUrl' : model.get('previewUrl'),
                    'id' : model.get('id')
                } ;
            } else {
                return {
                    'dateEnd' : paramDate,
                    'previewUrl' : model.get('previewUrl')
                } ;
            }
            
        },

        filterData: function (data) {
            if ('filedata' in data) {
                delete data.filedata;
            }
            return data;
        },

        validateSubmitData: function (data) {
            if (!data.previewUrl && !this.get('defaultFormData').previewUrl) {
                dialog.alert({
                    'title' : '系统提示',
                    'content' : '请上传文件'
                });
                return {
                    'uploader': '请上传文件'
                };
            }

            var tenDaysLater = new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000).getTime();
            var dateEnd = new Date(data.dateEnd).getTime();
            if ( dateEnd < tenDaysLater ) {
                dialog.alert({
                    'title': '系统提示',
                    'content': '请更新资质有效期'
                });
                return false;
            }

            return true;
        }

    };

    // return模块
    require( 'er/util' ).inherits( ValidationCreateStepEnterpriseStepEnterpriseModel, Model );
    return ValidationCreateStepEnterpriseStepEnterpriseModel;
} );
