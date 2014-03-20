/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    // require template
    require( 'tpl!./setting.tpl.html' );

    var FormView = require( 'ecma/mvc/FormView' );
    
    /**
     * [Please Input View Description]
     * 
     * @constructor
     */
    function SettingView() {
        FormView.apply( this, arguments );
    }

    SettingView.prototype.template = 'TPL_setting';

    require( 'er/util' ).inherits( SettingView, FormView );
    return SettingView;
} );
