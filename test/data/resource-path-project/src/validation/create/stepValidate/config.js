/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    // 这里可以添加一些模块配置
    // 如请求地址，表格fields等
    // 国际化相关语言定义，请使用lang，不建议在config中定义
    var config = {
        api: require('ecma/util').genRequesters({
            settingDefaultUrl: '/data/bk/validationInfo/read',
            settingSubmitUrl: '/data/bk/validationInfo/submit',
            contactInfoUrl: '/data/bk/contactInfo/read'
        })
    };
    
    
    return config;
} );
