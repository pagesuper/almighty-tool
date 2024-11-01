export declare const DEFINED_RANDOM_CHARS: {
    /** 小写字母 */
    lower: string[];
    /** 大写字母 */
    upper: string[];
    /** 数值 */
    number: string[];
    /** 符号 */
    symbol: string[];
};
export declare type RANDOM_CHARS_RANGE_KEY = 'lower' | 'upper' | 'number' | 'symbol';
export declare const RANDOM_CHARS: {
    /** 全字符 */
    full: string[];
    /** 小写 + 数字 */
    downcase: string[];
    /** 小写字母 */
    lower: string[];
    /** 大写字母 */
    upper: string[];
    /** 简单没有0 */
    simple: string[];
    /** 数值 */
    number: string[];
    /** 符号 */
    symbol: string[];
};
export declare type RANDOM_CHARS_GROUP_KEY = 'full' | 'downcase' | 'lower' | 'upper' | 'simple' | 'symbol' | 'number' | 'symbol';
export interface IGenerateRandomStringParams {
    /** 默认32 */
    length?: number;
    /** 可用的字符串 */
    characters?: string[];
    /** 分组 */
    group?: RANDOM_CHARS_GROUP_KEY;
    /** 范围 */
    ranges?: RANDOM_CHARS_RANGE_KEY | RANDOM_CHARS_RANGE_KEY[];
    /** time类型 */
    timeType?: 'date' | 'number' | 'char' | 'none';
}
declare const randomUtil: {
    /** 生成随机的字符串 */
    generateRandomString(options?: IGenerateRandomStringParams): string;
    /** 获取时间的字符串 */
    getUtcTimeString(dateTime?: Date | null): string;
};
export default randomUtil;
