/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define(function(require) {
    var config = {
        uploadUrl: '/data/bk/qualification/upload',
        typeMap: {
            "MEDICAL_SALE": "《互联网药品交易服务资格证书》",
            "MEDICAL_RESEARCH": "《药品生产许可证》",
            "MEDICINE_INFO": "《互联网药品交易服务资格证书》或《互联网药品信息服务资格证书》",
            "MEDICINE_PRODUCE": "《药品生产许可证》",
            "COSMETICS": "化妆品生产企业卫生许可证或工业产品许可证",
            "HEALTH_PRODUCT": "保健品批准证书或注册批件",
            "VETERINARY_MEDICINE": "兽药生产许可或经营许可",
            "DISINFECTION": "省级以上卫生行政部门颁发的消毒产品批准文号证明文件或省级以上行政部门颁发的消毒产品生产企业卫生许可证",
            "COMMEN_MEDICAL": "医疗机构执业许可证",
            "BIRTH_CONTRL": "计划生育技术服务机构执业许可证",
            "REHABILITATION": "医疗机构执业许可证（项目登记中必须包含戒毒服务）",
            "BEAUTYDRESSING": "医疗机构执业许可证",
            "MEDICAL_INSTRUMENT": "一类医疗器械（指通过常规管理足以保证其安全性、有效性的医疗器械）需出具省级药品监督局的备案或市级以上药监局的器械生产注册证书、产品注册号或批准号；其他医疗器械用户须出具省级以上药品监督管理部门颁发的医疗器械经营许可证和（或）医疗器械生产许可证。",
            "ARTIFICAL_LIMB": "假肢和矫形器（辅助器具）生产装配企业资格认定书",
            "STOCK": "经营股票承销业务资格证书",
            "FUND": "基金代销业务资格证或基金管理资格证书",
            "FUTURES": "期货经营许可证",
            "BOND": "证券投资咨询业务资格证书或经营证券业务许可证",
            "UNLOCK": "特种行业许可证（许可证经营范围注明为开锁）或开锁服务许可证或开锁服务卡或公安局备案证明",
            "AIR_TICKET": "资格认可证书（客运或客货运）",
            "LAW_ENTERPRISE": "律师事务所执业许可证",
            "LAW_PERSONAL": "律师执业证",
            "LAW_JUSTICE": "省级以上司法行政部门颁发的司法鉴定许可证",
            "ONLINE_PLATFORM": "ICP备案证明文件",
            "BANK": "《金融机构许可证》",
            "CHEMICALS": "危险化学品安全生产许可证或危险化学品经营许可证；",
            "FOREX": "经营外汇业务许可证",
            "NOTARY_OFFICE": "公证机构执业证",
            "ENTERTAINMENT": "娱乐经营许可证",
            "THIRD_PARTY_PAYMENT": "《支付业务许可证》",
            "TMALL": "网站首页截图",
            "AIRLINE": "公共航空运输企业经营许可证",
            "ENV_ASSESSMENT": "建设项目环境影响评价资质证书",
            "OTHERS": "本行业资质",
            "HK_MEDICAL": "（香港）诊疗所注册证书",
            "HK_MEDICAL_SALE": "进口药品注册证;药品经营类牌照",
            "HK_MEDICINE_PRODUCE": "进口药品注册证;药剂制品制造商牌照",
            "HK_COSMETICS": "（香港）厌恶性行业牌照",
            "HK_CH_MEDICINE": "香港政府颁发的中成药相关证明文件",
            "HK_DISINFECTION": "（香港）除害剂许可证或除害剂牌照",
            "HK_BEAUTYDRESSING": "（香港）第Ⅱ/Ⅲ/Ⅳ级医疗仪器表列证书",
            "HK_MEDICAL_INSTRUMENT": "（香港）第Ⅱ/Ⅲ/Ⅳ级医疗仪器表列证书",
            "HK_BOND_FUTURES": "（香港）代表牌照或认可机构注册或法团牌照",
            "HK_AIR_TICKET": "委托代理业务授权书",
            "HK_ONLINE_SHOPPING": "网站截图",
            "HK_LAW_SERVICE": "律师执业或律师事务所执业许可证"
        }
    };

    return config;
});