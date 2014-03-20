exports.response = function (path, params) {
    return {
        "success": "true",
        "message": {},
        "result": {
            "enterpriseInfo" : {
                "id": 1,
                "enterpriseType" : "HK_EP",//主体类型
                "regNo" : "1212212222", //资质文件编号或登记号
                "enterpriseName" : "宝洁（中国）有限公司",
                "dateEnd" : "2017-03-30",
                "previewUrl" : "http://xxx.xxx/xx.png" //资质文件图片预览地址
            },
            "industryInfo" : [{
                "id": 1,
                "industryType" : "HK_EP",//主体类型
                "regNo" : "1212212222", //资质文件编号或登记号
                "industryName" : "宝洁（中国）有限公司",
                "dateEnd" : "2017-03-30",
                "previewUrl" : "http://xxx.xxx/xx.png" //资质文件图片预览地址
            },{
                "id": 2,
                "industryType" : "HK_EP",//主体类型
                "regNo" : "1212212222", //资质文件编号或登记号
                "industryName" : "宝洁（中国）有限公司",
                "dateEnd" : "2017-03-30",
                "previewUrl" : "http://xxx.xxx/xx.png" //资质文件图片预览地址
            }]       
        }
    };
}
