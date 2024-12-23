export declare const DEFAULT_LOCALE: string;
export declare type DATETIME_TYPE = 'long' | 'date' | 'shortDate' | 'shortTime' | 'time';
export declare type DATETIME_LANG = 'en-US' | 'zh-CN';
/** 常用的正则表达式 */
export declare const regExps: Record<string, RegExp>;
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
