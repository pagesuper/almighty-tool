import 'dayjs/locale/en';
import '../dayjs/locales/zh-cn';
export type I18nValues = any[] | {
    [key: string]: any;
};
export interface IDateFormatI18n {
    t: (key: string, values?: I18nValues) => string;
}
export type DATE_FORMAT_FORMATTER = 'default' | 'full' | 'long' | 'short' | 'date' | 'time' | 'shortTime' | 'step' | 'shortStep' | 'fromNow' | 'toNow';
export interface IDateFormatOptions {
    /** 格式模板 */
    template?: string;
    /** 格式化 */
    formatter?: DATE_FORMAT_FORMATTER;
}
/** 日期格式化工具 */
declare const dateFormat: {
    /**
     * 对日期对象进行格式化
     *
     * - date 日期对象或者日期字符串
     * - options 格式化选项
     */
    format: (date: Date | string | null, options?: IDateFormatOptions) => string;
    /** 获取格式化模板 */
    getFormatTemplate(formatter?: DATE_FORMAT_FORMATTER): string;
    /** 设置默认的i18n对象 */
    setDefaultI18n: (i18n: IDateFormatI18n | null) => void;
};
export default dateFormat;
