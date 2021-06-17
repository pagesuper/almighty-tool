export declare const DEFAULT_LOCALE: string;
export declare type DATETIME_TYPE = 'long' | 'date' | 'shortDate' | 'shortTime' | 'time';
export declare type DATETIME_LANG = 'en-US' | 'zh-CN';
/** URL正则 */
export declare const URL_REG_EXP: RegExp;
/** 邮箱正则 */
export declare const EMAIL_REG_EXP: RegExp;
/** 国内身份证15位正则 */
export declare const CN_ID_CARD_REG_EXP15: RegExp;
/** 国内身份证18位正则 */
export declare const CN_ID_CARD_REG_EXP18: RegExp;
/** 国内手机号码正则 */
export declare const CN_MOBILE_PHONE_REG_EXP: RegExp;
declare const _default: {
    /** 正则表达式清单 */
    regExps: {
        /** 链接 */
        url: RegExp;
        /** 邮箱 */
        email: RegExp;
        /** 身份证15位 */
        cnIdCard15: RegExp;
        /** 身份证18位 */
        cnIdCard18: RegExp;
        /** 国内手机号码正则 */
        cnMobilePhone: RegExp;
    };
    /** 判断是否是手机号码 */
    isMobileNumber(mobileNumber: string, locale?: string): boolean;
    /** 是否是纯数字 */
    isPureNumber(str: string): boolean;
    /**
     * 是否是邮箱格式
     *
     * - 参考：http://emailregex.com/
     */
    isEmail(str: string): boolean;
    /** 是否是中国大陆的身份证 */
    isChinaIDCard(str: string, type?: 15 | 18): boolean;
    /** 是否是链接 */
    isUrl(str: string): boolean;
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
    showDatetime: (value: Date | string, type?: DATETIME_TYPE, lang?: DATETIME_LANG) => string;
};
export default _default;
