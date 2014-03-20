/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    var Model = require( 'ecma/mvc/FormModel' );
    //var Model = require('ef/UIModel');
    //var Model = require('ecma/mvc/BaseModel');
    var datasource = require( 'er/datasource' );
    var config = require('./config');
    var sysInfo = require('ecma/system/constants');
    var util = require('ecma/util');
    var u = require('underscore');
    

    /**
     * [Please Input Model Description]
     * 
     * @constructor
     */
    function ValidationCheckCheckModel(args) {
        this.defaultArgs = {'id' : args.id};
        this.formRequester = config.api.settingDefaultUrl;
        Model.apply( this, arguments );
    }

    ValidationCheckCheckModel.prototype = {
        datasource: {
            typeTexts: function(model) {
                var etList = sysInfo.get('enterprise_type');
                var data = model.get('defaultFormData');
                // return model.formRequester(model.defaultArgs).then(function(data) {
                //     var et = data.enterpriseInfo.enterpriseType;
                //     var etMap = util.toMap(etList, 'v');
                //     var etText = etMap[et].l;
                    
                //     return etMap[et].l;
                // });
            },
            industryType: function() {
                return sysInfo.get('industry_type');
            }
        },
        prepare: function () {
            var model = this;
            var data = this.get('defaultFormData');
            var etList = sysInfo.get('enterprise_type');
            var industryList = sysInfo.get('industry_type');

            var et = data.enterpriseInfo.enterpriseType;
            var etMap = util.toMap(etList, 'v');
            var etText = etMap[et].l;
            data.enterpriseInfo.enterpriseType = etText;

            var industryMap = util.toMap(industryList, 'v');
            var industryInfo = data.industryInfo;
            
            for (var i = 0; i < industryInfo.length; i++) {
                var industryType = industryInfo[i].industryType;
                data.industryInfo[i].industryType = industryMap[industryType].l;
            }

            model.set('defaultFormData', data);
        }
    };
    
    

    // return模块
    require( 'er/util' ).inherits( ValidationCheckCheckModel, Model );
    return ValidationCheckCheckModel;
} );
