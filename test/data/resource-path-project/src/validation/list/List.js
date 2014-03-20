/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    var Action = require( 'ecma/mvc/BaseAction' );

    /**
     * [Please Input Action Description]
     * 
     * @constructor
     */
    function ValidationListList() {
        Action.apply( this, arguments );
    }

    
    ValidationListList.prototype = {
        modelType: require( './ListModel' ),
        viewType: require( './ListView' )
    };
    

    require( 'er/util' ).inherits( ValidationListList, Action );
    return ValidationListList;
} );
