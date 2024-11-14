export declare type I18nValues = any[] | {
    [key: string]: any;
};
export interface IEnumObjectI18n {
    t: (key: string, values?: I18nValues) => string;
}
/** 选项 */
export interface ISelectOption {
    /** 显示文字 */
    label: string;
    /** 关联的Key */
    key: string;
    /** 关联的值 */
    value: string | number;
}
export interface IEnumObjectOptions {
    i18n?: IEnumObjectI18n;
    source: Object;
    sourceName: string;
}
export declare class EnumObject<T> {
    /** 国际化工具 */
    private __i18n;
    /** 源 */
    private __source;
    /** 反向源 */
    private __reverseSource;
    /** 源名称 */
    sourceName: string;
    /** 源 */
    source: T;
    /** 选择的项目 */
    getSelectOptions(): ISelectOption[];
    /** 根据key获取对应的翻译 */
    getText(key: string): string;
    /** 根据value获取对应的翻译 */
    getValueText(value: string | number): string;
    /** 根据key获取对应的值 */
    getValue(key: string): string | number | undefined;
    /** 根据value获取对应的key */
    getKey(value: string | number): string | undefined;
    toJSON(): object;
    get i18n(): IEnumObjectI18n;
    constructor(options: IEnumObjectOptions);
    /** 设置默认的i18n对象 */
    setI18n(i18n: IEnumObjectI18n | null): void;
    /** 设置默认的i18n对象 */
    static setDefaultI18n(i18n: IEnumObjectI18n | null): void;
}
