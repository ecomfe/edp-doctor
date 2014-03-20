/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    //var Action = require( 'er/Action' );
    var Action = require('ecma/mvc/FormAction');
    var locator = require('er/locator');

    /**
     * [Please Input Action Description]
     * 
     * @constructor
     */
    function ValidationCreateStepValidate() {
        Action.apply( this, arguments );
    }

    
    ValidationCreateStepValidate.prototype = {
        modelType: require( './StepValidateModel' ),
        viewType: require( './StepValidateView' ),

        redirectAfterSubmit: function() {
            locator.redirect('#/validation/check~id=' + this.model.get('id'));
        },

        redirectAfterCancel: function() {
            locator.redirect('#/validation/list');
        }
    };
    
    require( 'er/util' ).inherits( ValidationCreateStepValidate, Action );
    return ValidationCreateStepValidate;
} );
