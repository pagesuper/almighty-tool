export declare const DEFAULT_LOCALE: string;
export declare type DATETIME_TYPE = 'long' | 'date' | 'shortDate' | 'shortTime' | 'time';
export declare type DATETIME_LANG = 'en-US' | 'zh-CN';
/** 常用的正则表达式 */
export declare const regExps: {
    /** 网址 */
    url: RegExp;
    /** 空字符串 */
    'blank-string': RegExp;
    /** 邮箱 */
    email: RegExp;
    /** 手机号 */
    'mobile-number-china': RegExp;
    /** 身份证 */
    'id-card-china': RegExp;
    /** 身份证15位 */
    'id-card-15-china': RegExp;
    /** 纯数字 */
    'pure-number': RegExp;
    /** 中文 */
    'words-chinese': RegExp;
    /** ipv4地址 */
    'ipv4-address': RegExp;
    /** ipv6地址 */
    'ipv6-address': RegExp;
    /** mac地址 */
    'mac-address': RegExp;
    /** ip地址 */
    'ip-address': RegExp;
    /** 域名 */
    'domain-name': RegExp;
    /** 日期 */
    'date-format': RegExp;
    /** 时间 */
    'time-format': RegExp;
    /** 日期时间 */
    'date-time-format': RegExp;
};
declare const _default: {
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
    /** 是否包含中文 */
    isContainChinese(str: string): boolean;
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
