/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    var FormModel = require( 'ecma/mvc/FormModel' );
    var config = require( './config' );

    /**
     * [Please Input Model Description]
     * 
     * @constructor
     */
    function SettingModel() {
        FormModel.apply( this, arguments );

        this.formRequester = config.api.settingDefaultUrl;
        this.submitRequester = config.api.settingSubmitUrl;
    }

    // return模块
    require( 'er/util' ).inherits( SettingModel, FormModel );
    return SettingModel;
} );
