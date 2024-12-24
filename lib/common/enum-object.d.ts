import { I18n } from './i18n';
export interface IEnumObjectTranslate {
    [key: string]: string;
}
export interface IEnumObject<T> {
    source: T;
    name: string;
    i18n?: I18n | (() => I18n);
    langs?: string[];
}
export interface IEnumObjectOptions {
    key: string;
    value: string | number;
    translate: IEnumObjectTranslate;
}
export declare class EnumObject<T extends Record<string, string | number>> {
    constructor(options: IEnumObject<T>);
    i18n: I18n | (() => I18n);
    /** 键到值的映射(键为枚举的键, 值为枚举的值) */
    valueMap: Map<string, string | number>;
    /** 值到键的映射(键为枚举的值, 值为枚举的键) */
    keyMap: Map<string | number, string>;
    source: T;
    name: string;
    private langs;
    private translateOptionsMap;
    private options;
    private translate;
    getI18n(): I18n;
    /**
     * 获取指定语言的选项
     * @param lang - 语言
     * @returns 指定语言的选项
     */
    getDialectOptions(lang: string): {
        key: string;
        value: string | number;
        dialect: string;
    }[];
    getTranslateOptionsMap(): Map<string, IEnumObjectOptions>;
    getTranslateOptionWithKey(key: string): IEnumObjectOptions | null;
    getTranslateOptionWithValue(value: string | number): IEnumObjectOptions | null;
    /**
     * 获取指定语言的名称
     * @param lang - 语言
     * @returns 指定语言的名称
     */
    getDialectName(lang: string): string;
    getOptions(): IEnumObjectOptions[];
    getTranslate(): IEnumObjectTranslate;
}
