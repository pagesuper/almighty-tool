/**
 * 字符串截断配置选项
 */
export type StringTruncateOptions = {
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
/**
 * 字节长度计算选项
 */
export type ByteLengthOptions = {
    /**
     * 计算模式：
     * - 'display': 中文=1, 英文/半角=0.5 (2个英文=1个中文，适合显示宽度计算)
     * - 'utf8': 实际UTF-8字节数 (中文=3, 英文=1)
     * - 'gbk': 实际GBK字节数 (中文=2, 英文=1)
     */
    mode?: 'display' | 'utf8' | 'gbk';
};
declare const stringUtil: {
    /**
     * 计算字符串的字节长度
     * @param str - 原始字符串
     * @param options - 计算选项
     * @returns 字节长度
     *
     * @example
     * // 显示模式（默认）：中文=1, 英文=0.5
     * stringUtil.byteLength('你好ab') // 3 (2 + 0.5 + 0.5)
     * stringUtil.byteLength('你好ab', { mode: 'display' }) // 3
     *
     * // UTF-8模式：中文=3, 英文=1
     * stringUtil.byteLength('你好ab', { mode: 'utf8' }) // 8 (3*2 + 1*2)
     *
     * // GBK模式：中文=2, 英文=1
     * stringUtil.byteLength('你好ab', { mode: 'gbk' }) // 6 (2*2 + 1*2)
     */
    byteLength: (str: string | undefined | null, options?: ByteLengthOptions) => number;
    /**
     * 显示宽度计算：中文=1, 英文/半角=0.5
     * 适用于UI显示场景，2个英文字符宽度约等于1个中文字符
     */
    displayByteLength: (str: string) => number;
    /**
     * UTF-8字节长度计算
     * 中文=3字节, 英文=1字节
     */
    utf8ByteLength: (str: string) => number;
    /**
     * GBK字节长度计算
     * 中文=2字节, 英文=1字节
     * 注：纯前端环境无法精确计算GBK字节，此为近似实现
     */
    gbkByteLength: (str: string) => number;
    /**
     * 判断字符是否为全角字符
     * 包括：中文、日文、韩文、全角标点、全角字母数字等
     */
    isFullWidth: (codePoint: number) => boolean;
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
    truncate: (str: string | undefined | null, options: StringTruncateOptions) => string;
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
export { stringUtil };
