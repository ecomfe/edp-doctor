/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    // Action配置
    // 如果期望添加action时工具自动配置，请保持actionsConfig名称不变
    var actionsConfig = [
        {
            type: 'validation/check/Check',
            path: '/validation/check'
        },
        {
            type: 'validation/create/stepValidate/StepValidate',
            path: '/validation/create/stepValidate'
        },
        {
            type: 'validation/create/stepFormContainer/StepFormContainer',
            path: '/validation/create/stepIndustry'
        },
        {
            type: 'validation/list/List',
            path: '/validation/list'
        },
        {
            type: 'validation/create/stepEnterprise/StepEnterprise',
            path: '/validation/create/stepEnterprise'
        },
        // 子action使用
        {
            type: 'validation/create/stepEnterprise/StepEnterprise',
            path: '/validation/create/stepEnterpriseForm'
        },
        {
            type: 'validation/create/stepIndustry/StepIndustry',
            path: '/validation/create/stepIndustryForm'
        }
    ];

    var controller = require( 'er/controller' );
    for ( var i = 0, len = actionsConfig.length; i < len; i++ ) {
        controller.registerAction( actionsConfig[ i ] );
    }

    // 这里可以添加一些模块配置
    // 如请求地址，表格fields等
    // 国际化相关语言定义，请使用lang，不建议在config中定义
    var config = {
        uploadUrl: '/data/bk/qualification/upload'
    };
    
    return config;
} );
