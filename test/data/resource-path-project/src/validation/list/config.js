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
            listUrl: '/data/bk/word/list',
            contactInfoUrl: '/data/bk/contactInfo/read',
            deleteWordUrl : '/data/bk/word/delete',
            overviewUrl : '/data/bk/account/overview'
        }),
        statusMap: {
            'DRAFT': '未提交',
            'IN_AUDITING': '审批中',
            'AUDIT_DENIED': '审批拒绝',
            'AUDIT_PASSED': '审批通过',
            'LAUNCHING': '投放中',
            'LAUNCH_END': '投放结束',
            'LAUNCH_PAUSE': '投放暂停'
        },
        colorStatusMap: {
            'DRAFT': 'grey',
            'IN_AUDITING': 'yellow',
            'AUDIT_DENIED': 'red',
            'AUDIT_PASSED': 'green',
            'LAUNCHING': 'green',
            'LAUNCH_END': 'red',
            'LAUNCH_PAUSE': 'red'
        }
    };
    
    
    return config;
} );
