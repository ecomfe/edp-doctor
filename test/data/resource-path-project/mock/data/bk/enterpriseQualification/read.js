exports.response = function(path, params) {
    return {
        "success": "true",
        "message": {},
        "result": {
            "failedReason" : "",
            "enterpriseType": "HK_EP", //主体类型
            "regNo": "1212212222", //资质文件编号或登记号
            "enterpriseName": "宝洁（中国）有限公司",
            "dateEnd": "2017-03-30",
            "qualiFileName": "xxx资质文件", //待定
            "previewUrl": "http://xxx.xxx/xx.png" //资质文件图片预览地址
        }
    };
};