/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    var Model = require( 'ecma/mvc/BaseModel' );
    var datasource = require( 'er/datasource' );
    var config = require( './config' );
    var u = require('underscore');

    /**
     * [Please Input Model Description]
     * 
     * @constructor
     */
    function ValidationCreateStepFormContainerModel(args) {
        this.defaultArgs = {'id' : args.id};
        // 添加新空表单用的url, 不能带id
        this.increasingUrl = config.industryUrl;

        // 行业和主体子action的url
        this.industryUrl = config.industryUrl + '~id=' + args.id;
        this.enterpriseUrl = config.enterpriseUrl;

        // 仅供行业资质使用
        this.deleteRequester = config.api.deleteUrl;                //删除资质接口
        this.defaultDataRequester = config.api.defaultDataUrl;      //编辑行业资质读取接口
        this.submitRequester = config.api.submitUrl;                //提交编辑行业资质接口

        if (args.edit) {
            this.industryUrl += '&edit=1';
        }
        if (args.update) {
            this.defaultDataRequester = config.api.defaultUpdateDataUrl;    //更新资质读取接口
            this.submitRequester = config.api.updateSubmitUrl;              //提交更新资质接口
            this.industryUrl += '&update=1';
            this.enterpriseUrl += '~update=1';
        }
        Model.apply( this, arguments );
    }

    ValidationCreateStepFormContainerModel.prototype.datasource = {
        defaultData : function(model) {
            return model.defaultDataRequester(model.defaultArgs).then(function(data) {
                model.set('failedReason', data.failedReason, {slient: true});
                return data;
            });
        }
    };

    // return模块
    require( 'er/util' ).inherits( ValidationCreateStepFormContainerModel, Model );
    return ValidationCreateStepFormContainerModel;
} );