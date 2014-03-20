/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    var Action = require( 'ecma/mvc/FormAction' );

    /**
     * [Please Input Action Description]
     * 
     * @constructor
     */
    function ValidationCheckCheck() {
        Action.apply( this, arguments );
    }

    
    ValidationCheckCheck.prototype = {
        modelType: require( './CheckModel' ),
        viewType: require( './CheckView' ),
    };
    

    require( 'er/util' ).inherits( ValidationCheckCheck, Action );
    return ValidationCheckCheck;
} );
