exports.response = function(path, params) {
    return {
        "success": "true",
        "message": {},
        "result": {
            "failedReason" : "行业不符",
            qualificationInfo : [
                {
                    id : 1,
                    industryType : 'MEDICAL_RESEARCH', //行业类型
                    regNo : '129993344', //资质文件编号或登记号
                    industryName : '宝洁（中国）有限公司', //资质主体名称
                    dateEnd : '2017-03-30', //有效期至
                    previewUrl : "http://baidu.com"
                },
                {
                    id : 2,
                    industryType : 'MEDICAL_SALE', //行业类型
                    regNo : '129993344', //资质文件编号或登记号
                    industryName : '宝洁（中国）有限公司', //资质主体名称
                    dateEnd : '2017-03-30', //有效期至
                    previewUrl : "http://baidu.com"
                }
            ]
        }
    };
};