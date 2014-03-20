/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    var Model = require( 'ecma/mvc/FormModel' );
    var datasource = require( 'er/datasource' );
    var sysInfo = require('ecma/system/constants');
    var moment = require('moment/moment');
    var date = require('esui/lib/date');
    var dialog = require('esui/Dialog');

    /**
     * [Please Input Model Description]
     * 
     * @constructor
     */
    function ValidationCreateStepIndustryModel() {
        Model.apply( this, arguments );
    }

    ValidationCreateStepIndustryModel.prototype = {
        datasource: {
            industryType: function() {
                return sysInfo.get('industry_type');
            }
        },

        getExtraData: function () {
            var model = this;
            var paramDate = model.get('dateEnd') || model.get('defaultFormData').dateEnd;
            return {
                'dateEnd' : paramDate
            } ;
        },

        filterData: function (data) {
            if (data.filedata) {
                data.previewUrl = data.filedata.url || data.filedata.previewUrl;
                delete data.filedata;
            }
            return data;
        },

        validateSubmitData: function (data) {
            if (!data.previewUrl) {
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
    require( 'er/util' ).inherits( ValidationCreateStepIndustryModel, Model );
    return ValidationCreateStepIndustryModel;
} );
