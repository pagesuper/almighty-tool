export interface ISplitFloatOptions {
    /** 忽略尾部的0: 默认为true */
    ignoreTailZeros?: boolean;
    /** 最大的小数部分位数: 默认为2 */
    maxTailsCount?: number;
}
export interface ISplitFloatResult {
    /** 整数部分 */
    integer: string;
    /** 小数部分 */
    float: string;
    /** 小数点 */
    point: string;
}
declare const numberUtil: {
    /** 格式化1个浮点数 */
    formatFloat(value: number | string, options?: ISplitFloatOptions): string;
    /** 分割一个浮点数 */
    splitFloat(value: number | string, options?: ISplitFloatOptions): ISplitFloatResult;
};
export default numberUtil;
