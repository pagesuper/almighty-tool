"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CN_MOBILE_PHONE_REG_EXP = exports.CN_ID_CARD_REG_EXP18 = exports.CN_ID_CARD_REG_EXP15 = exports.EMAIL_REG_EXP = exports.URL_REG_EXP = exports.DEFAULT_LOCALE = void 0;
var tslib_1 = require("tslib");
var date_util_1 = tslib_1.__importDefault(require("./date-util"));
exports.DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'zh-CN';
/** URL正则 */
exports.URL_REG_EXP = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
/** 邮箱正则 */
exports.EMAIL_REG_EXP = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
/** 国内身份证15位正则 */
exports.CN_ID_CARD_REG_EXP15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
/** 国内身份证18位正则 */
exports.CN_ID_CARD_REG_EXP18 = /[1-9]\d{5}(((1[89]|20)\d{2}(((0[13578]|1[0-2])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((((1[89]|20)(0[48]|[2468][048]|[13579][26]))|((19|20)00))0229))\d{3}(\d|X|x)/;
/** 国内手机号码正则 */
exports.CN_MOBILE_PHONE_REG_EXP = /^1[3456789]\d{9}$/;
exports.default = {
    /** 正则表达式清单 */
    regExps: {
        /** 链接 */
        url: exports.URL_REG_EXP,
        /** 邮箱 */
        email: exports.EMAIL_REG_EXP,
        /** 身份证15位 */
        cnIdCard15: exports.CN_ID_CARD_REG_EXP15,
        /** 身份证18位 */
        cnIdCard18: exports.CN_ID_CARD_REG_EXP18,
        /** 国内手机号码正则 */
        cnMobilePhone: exports.CN_MOBILE_PHONE_REG_EXP,
    },
    /** 判断是否是手机号码 */
    isMobilePhone: function (mobileNumber, locale) {
        if (locale === void 0) { locale = exports.DEFAULT_LOCALE; }
        if (locale === 'zh-CN') {
            return exports.CN_MOBILE_PHONE_REG_EXP.test(mobileNumber);
        }
        else {
            /** 其他的暂不支持 */
            return false;
        }
    },
    /** 是否是纯数字 */
    isPureNumber: function (str) {
        return /^\d{1,}$/.test(str);
    },
    /**
     * 是否是邮箱格式
     *
     * - 参考：http://emailregex.com/
     */
    isEmail: function (str) {
        return exports.EMAIL_REG_EXP.test(str);
    },
    /** 是否是中国大陆的身份证 */
    isChinaIDCard: function (str, type) {
        if (type === void 0) { type = 18; }
        if (type === 15 && str.length === 15) {
            return exports.CN_ID_CARD_REG_EXP15.test(str);
        }
        if (type === 18 && str.length === 18) {
            return exports.CN_ID_CARD_REG_EXP18.test(str);
        }
        return false;
    },
    /** 是否是链接 */
    isUrl: function (str) {
        return exports.URL_REG_EXP.test(str);
    },
    /**
     * 格式换时间
     *
     * 中文: lang = 'zh-CN' (默认)
     *
     * @type
     *
     * - long(默认) -> 2020年12月14日 12:23:33
     * - date -> 2020年12月14日
     * - shortDate -> 12月14日
     * - shortTime -> 12:23
     * - time -> 12:23:33
     *
     * 英文: lang = 'en-US'
     *
     * - long(默认) -> 2020-12-14 12:23:33
     * - date -> 2020-12-14
     * - shortDate -> 12-14
     * - shortTime -> 12:23
     * - time -> 12:23:33
     */
    showDatetime: function (value, type, lang) {
        if (type === void 0) { type = 'long'; }
        if (lang === void 0) { lang = 'zh-CN'; }
        function pad(number) {
            if (number < 10) {
                return "0" + number;
            }
            else {
                return "" + number;
            }
        }
        if (value) {
            var value2 = date_util_1.default.parse(value);
            if (value2) {
                var year = value2.getFullYear();
                var month = value2.getMonth() + 1;
                var date = value2.getDate();
                var hour = value2.getHours();
                var minute = value2.getMinutes();
                var second = value2.getSeconds();
                switch (lang) {
                    case 'en-US':
                        switch (type) {
                            case 'date':
                                return year + "-" + pad(month) + "-" + pad(date);
                            case 'shortDate':
                                return pad(month) + "-" + pad(date);
                            case 'shortTime':
                                return pad(hour) + ":" + pad(minute);
                            case 'time':
                                return pad(hour) + ":" + pad(minute) + ":" + pad(second);
                            default:
                                return year + "-" + pad(month) + "-" + pad(date) + " " + pad(hour) + ":" + pad(minute) + ":" + pad(second);
                        }
                    default:
                        switch (type) {
                            case 'date':
                                return year + "\u5E74" + pad(month) + "\u6708" + pad(date) + "\u65E5";
                            case 'shortDate':
                                return pad(month) + "\u6708" + pad(date) + "\u65E5";
                            case 'shortTime':
                                return pad(hour) + ":" + pad(minute);
                            case 'time':
                                return pad(hour) + ":" + pad(minute) + ":" + pad(second);
                            default:
                                return year + "\u5E74" + pad(month) + "\u6708" + pad(date) + "\u65E5 " + pad(hour) + ":" + pad(minute) + ":" + pad(second);
                        }
                }
            }
        }
        return "" + value;
    },
};
//# sourceMappingURL=format-util.js.map