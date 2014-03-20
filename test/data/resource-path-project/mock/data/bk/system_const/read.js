exports.response = function (path, params) {
    return {
        "success" : "true",
        "message" : {},
        "result" : {
            "word_status": [//结合审核状态和时间得到的最终状态
                {"l" : "未完成","v" : "DRAFT"},
                {"l" : "审核中","v" : "IN_AUDITING"},
                {"l" : "审核拒绝","v" : "AUDIT_DENIED"},
                {"l" : "审核通过","v" : "AUDIT_PASSED"},
                {"l" : "正在投放","v" : "LAUNCHING"},
                {"l" : "投放结束","v" : "LAUNCH_EXPIRED"},
                {"l" : "投放暂停","v" : "LAUNCH_PAUSE"},
            ],
            "word_use_status" : [
                {"l" : "可用","v" : "AVAILABLE"},
                {"l" : "不可用","v" : "UNAVAILABLE"},
                {"L" : "未创建", "v" : "NOT_CREATED"}
            ],
            "enterprise_type": [{
                "l": "大陆企业单位类客户",
                "v": "MAINLAND"
            }, {
                "l": "香港企业类客户",
                "v": "HK_EP"
            }, {
                "l": "澳门企业类客户",
                "v": "MAC_EP"
            }, {
                "l": "台湾企业类客户",
                "v": "TW_EP"
            }, {
                "l": "国外企业类客户",
                "v": "FOREIGN_EP"
            }],
            "industry_type": [{
                "l": "大陆企业单位类客户",
                "v": "MAINLAND"
            }, {
                "l": "香港企业类客户",
                "v": "HK_EP"
            }, {
                "l": "澳门企业类客户",
                "v": "MAC_EP"
            }, {
                "l": "台湾企业类客户",
                "v": "TW_EP"
            }, {
                "l": "国外企业类客户",
                "v": "FOREIGN_EP"
            }]
        }
    };
};
// delay
exports.timeout = 0;