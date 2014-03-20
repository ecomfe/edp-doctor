/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    var Model = require( 'ecma/mvc/BaseModel' );
    var datasource = require( 'er/datasource' );
    var config = require('./config');

    /**
     * [Please Input Model Description]
     * 
     * @constructor
     */
    function ValidationListListModel() {
        Model.apply( this, arguments );
        this.contactInfoRequester = config.api.contactInfoUrl;
        this.deleteWordRequester = config.api.deleteWordUrl;
    }

    ValidationListListModel.prototype.datasource = {
        tableData: function () {
            return config.api.listUrl().then(function (data){
                return data;
            });
        },
        summary: function(model) {
            return config.api.overviewUrl().then(function (data){
                return data;
            });
        },
        contactInfo: function(model) {
            return model.contactInfoRequester().then(function(res) {
                return res;
            });
        }
    };

    // return模块
    require( 'er/util' ).inherits( ValidationListListModel, Model );
    return ValidationListListModel;
} );
