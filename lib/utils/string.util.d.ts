/**
 * 字符串截断配置选项
 */
export declare type StringTruncateOptions = {
    /** 截断后字符串的最大长度 */
    length: number;
    /** 截断位置：'end'(默认)|'start'|'middle' */
    position?: 'end' | 'start' | 'middle';
    /** 当position='middle'时，末尾保留的字符数 */
    endChars?: number;
    /** 省略符号，默认为'...' */
    omission?: string;
    /** 是否保留完整单词（不切断单词） */
    preserveWord?: boolean;
};
declare const stringUtil: {
    /**
     * 高性能字符串截断函数
     * @param str - 原始字符串
     * @param options - 截断配置
     * @returns 截断后的字符串
     *
     * 性能优化点：
     * 1. 快速路径：直接返回满足条件的字符串
     * 2. 避免不必要的计算：提前计算关键变量
     * 3. 最小化字符串操作：使用slice替代substring
     * 4. 优化单词保留逻辑：使用indexOf替代split
     */
    truncate: (str: string, options: StringTruncateOptions) => string;
    /**
     * 简单截断处理（不保留单词）
     */
    simpleTruncate: (str: string, options: Pick<StringTruncateOptions, "position" | "omission"> & {
        maxLength: number;
        endChars: number;
    }) => string;
    /**
     * 保留单词的截断处理
     */
    preserveWordTruncate: (str: string, options: Pick<StringTruncateOptions, "position" | "omission"> & {
        maxLength: number;
    }) => string;
};
export default stringUtil;
