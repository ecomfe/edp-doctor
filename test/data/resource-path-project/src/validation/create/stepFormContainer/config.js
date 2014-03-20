/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    // 这里可以添加一些模块配置
    // 如请求地址，表格fields等
    // 国际化相关语言定义，请使用lang，不建议在config中定义
    var config = {
        industryUrl: '/validation/create/stepIndustryForm',
        enterpriseUrl: '/validation/create/stepEnterpriseForm',
        api: require('ecma/util').genRequesters({
            submitUrl: '/data/bk/industryQualification/submit',
            deleteUrl: '/data/bk/industryQualification/delete',
            defaultDataUrl: '/data/bk/industryQualification/read',

            defaultUpdateDataUrl: '/data/bk/qualification/readUpdateInfo',
            updateSubmitUrl: '/data/bk/qualification/submitUpdateInfo'
        })
    };

    return config;
} );
