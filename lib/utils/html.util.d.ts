/**
 * HTML转纯文本的配置选项
 */
export interface HtmlToTextOptions {
    /**
     * 换行符处理方式
     * - 'preserve': 保留换行符（默认）
     * - 'single-space': 将所有换行替换为单个空格
     * - 'remove': 完全移除换行符
     */
    newlines?: 'preserve' | 'single-space' | 'remove';
    /**
     * 是否保留内联标签的语义
     * - true: 为strong、em等标签添加标记（如**加粗**、*斜体*）
     * - false: 完全移除所有标签（默认）
     */
    preserveInlineSemantics?: boolean;
    /**
     * 链接处理方式
     * - 'remove': 完全移除链接，只保留文本（默认）
     * - 'preserve-text': 保留链接文本
     * - 'markdown': 转换为Markdown格式 [文本](URL)
     * - 'with-url': 在文本后添加URL (文本 [URL])
     */
    links?: 'remove' | 'preserve-text' | 'markdown' | 'with-url';
    /**
     * 图片处理方式
     * - 'remove': 完全移除图片（默认）
     * - 'preserve-alt': 保留alt文本 [图片: alt文本]
     * - 'markdown': 转换为Markdown格式 ![alt文本]
     * - 'with-src': 保留alt和src [图片: alt文本 (URL)]
     */
    images?: 'remove' | 'preserve-alt' | 'markdown' | 'with-src';
    /**
     * 列表处理方式
     * - 'remove': 移除列表标记，只保留文本（默认）
     * - 'preserve': 保留列表标记（• 用于无序列表，1. 用于有序列表）
     * - 'markdown': 转换为Markdown列表标记（* 用于无序列表，1. 用于有序列表）
     */
    lists?: 'remove' | 'preserve' | 'markdown';
    /**
     * 代码块处理方式
     * - 'remove': 移除代码格式（默认）
     * - 'preserve': 保留代码标记（`代码`）
     * - 'newlines': 将代码块转换为换行
     */
    codeBlocks?: 'remove' | 'preserve' | 'newlines';
    /**
     * 表格处理方式
     * - 'remove': 移除表格格式（默认）
     * - 'newlines': 将表格单元格转换为换行
     * - 'tabs': 用制表符分隔单元格
     */
    tables?: 'remove' | 'newlines' | 'tabs';
    /**
     * 最大连续换行数
     * - 默认值：2
     */
    maxNewlines?: number;
    /**
     * 是否修剪首尾空格
     * - 默认值：true
     */
    trim?: boolean;
    /**
     * 是否保留空白文本节点
     * - true: 保留所有文本节点
     * - false: 移除空文本节点（默认）
     */
    keepWhitespace?: boolean;
}
/**
 * 将HTML转换为纯文本
 * @param html 输入的HTML字符串
 * @param options 配置选项
 * @returns 清洗后的纯文本
 */
export declare function htmlToPlainText(html: string, options?: HtmlToTextOptions): string;
