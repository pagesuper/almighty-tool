"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CN_MOBILE_PHONE_REG_EXP = exports.CN_ID_CARD_REG_EXP18 = exports.CN_ID_CARD_REG_EXP15 = exports.EMAIL_REG_EXP = exports.URL_REG_EXP = exports.DEFAULT_LOCALE = void 0;
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
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
    isMobileNumber: function (mobileNumber, locale) {
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
    /** 转为中横线命名 */
    toHyphenName: function (value) {
        if (value) {
            return value.trim().replace(/([A-Z])/g, "-$1").toLowerCase();
        }
        return '';
    },
    /** 转为中横线命名 */
    toHumpName: function (value) {
        if (value) {
            return value.replace(/\-(\w)/g, function (_all, letter) {
                return letter.toUpperCase();
            });
        }
        return '';
    },
    /** 将css style对象转为字符串 */
    cssStyleObjectToString: function (style) {
        var _this = this;
        var styles = [];
        lodash_1.default.keys(style).forEach(function (key) {
            styles.push([_this.toHyphenName(key), style[key]].join(': '));
        });
        return styles.join('; ');
    },
};
//# sourceMappingURL=format-util.js.map