/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    var Action = require( 'ecma/mvc/FormAction' );
    var Deferred = require( 'er/Deferred' );

    /**
     * [Please Input Action Description]
     * 
     * @constructor
     */
    function ValidationCreateStepIndustry() {
        Action.apply( this, arguments );
    }

    ValidationCreateStepIndustry.prototype = {
        modelType: require( './StepIndustryModel' ),
        viewType: require( './StepIndustryView' ),

        initBehavior: function () {
            var me = this;
            Action.prototype.initBehavior.apply(this, arguments);

            this.view.on('delete', function () {
                me.fire('delete');
            });
        }
    };

    require( 'er/util' ).inherits( ValidationCreateStepIndustry, Action );
    return ValidationCreateStepIndustry;
} );