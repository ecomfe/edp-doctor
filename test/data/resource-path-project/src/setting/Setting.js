/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    var FormAction = require( 'ecma/mvc/FormAction' );

    /**
     * [Please Input Action Description]
     * 
     * @constructor
     */
    function SettingAction() {
        FormAction.apply( this, arguments );
    }

    SettingAction.prototype.modelType = require( './SettingModel' );
    SettingAction.prototype.viewType = require( './SettingView' );

    require( 'er/util' ).inherits( SettingAction, FormAction );
    return SettingAction;
} );
