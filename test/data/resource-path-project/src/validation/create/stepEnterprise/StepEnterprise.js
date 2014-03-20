/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    var Action = require('ecma/mvc/FormAction');
    var locator = require ('er/locator');
    var moment = require('moment/moment');

    /**
     * [Please Input Action Description]
     * 
     * @constructor
     */
    function ValidationCreateStepEnterpriseStepEnterprise() {
        Action.apply( this, arguments );
    }

    
    ValidationCreateStepEnterpriseStepEnterprise.prototype = {
        modelType: require( './StepEnterpriseModel' ),
        viewType: require( './StepEnterpriseView' ),

        redirectAfterCancel: function () {
            locator.redirect('#/validation/list');
        }
    };


    ValidationCreateStepEnterpriseStepEnterprise.prototype.redirectAfterSubmit = function (result) {  
        var wordId = result.id;

        if (this.model.get('edit')) {
            locator.redirect('/validation/create/stepIndustry~id=' + wordId + '&edit=1');
        } else {
            locator.redirect('/validation/create/stepIndustry~id=' + wordId);

        }
    };
    

    require( 'er/util' ).inherits( ValidationCreateStepEnterpriseStepEnterprise, Action );
    return ValidationCreateStepEnterpriseStepEnterprise;
} );
