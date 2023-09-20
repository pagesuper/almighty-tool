export declare const DEFAULT_LOCALE: string;
export type DATETIME_TYPE = 'long' | 'date' | 'shortDate' | 'shortTime' | 'time';
export type DATETIME_LANG = 'en-US' | 'zh-CN';
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
    /** 转为中横线命名 */
    toHyphenName(value: string): string;
    /** 转为中横线命名 */
    toHumpName(value: string): string;
    /** 将对象类型的css样式转化为字符串 */
    cssStyleObjectToString(style: Record<string, string>): string;
};
export default _default;
