/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    /*var controller = require( 'er/controller' );
    for ( var i = 0, len = actionsConfig.length; i < len; i++ ) {
        controller.registerAction( actionsConfig[ i ] );
    }*/

    // 这里可以添加一些模块配置
    // 如请求地址，表格fields等
    // 国际化相关语言定义，请使用lang，不建议在config中定义
    var config = {
        api: require('ecma/util').genRequesters({
            settingDefaultUrl: '/data/bk/enterpriseQualification/read',
            settingSubmitUrl: '/data/bk/enterpriseQualification/submit'
        })
    };
    
    
    return config;
} );
