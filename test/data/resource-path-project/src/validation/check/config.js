/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    var config = {
        api: require('ecma/util').genRequesters({
            settingDefaultUrl: '/data/bk/validationInfo/check'
        })
    };

    return config;
} );
