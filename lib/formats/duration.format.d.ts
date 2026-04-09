export type I18nValues = any[] | {
    [key: string]: any;
};
export interface IDurationFormatI18n {
    t: (key: string, values?: I18nValues) => string;
}
export type DURATION_FORMAT_FORMATTER = 'default' | 'short';
export interface IDurationFormatOptions {
    /** 格式化 */
    formatter?: DURATION_FORMAT_FORMATTER;
    /** 语言 */
    locale?: string;
}
/** 时长格式化工具 */
declare const durationFormat: {
    /**
     * 对秒数进行格式化
     *
     * - seconds 秒数
     * - options 格式化选项
     */
    format: (seconds: number, options?: IDurationFormatOptions) => string;
    /** 设置默认的i18n对象 */
    setDefaultI18n: (i18n: IDurationFormatI18n | null) => void;
};
export default durationFormat;
