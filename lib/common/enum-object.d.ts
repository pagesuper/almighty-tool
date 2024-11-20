export declare type TranslateOptions = {
    lang?: string;
    args?: ({
        [k: string]: any;
    } | string)[] | {
        [k: string]: any;
    };
    defaultValue?: string;
    debug?: boolean;
};
export interface I18n {
    t: (key: string, options?: TranslateOptions) => string;
}
export interface IEnumObjectTranslate {
    [key: string]: string;
}
export interface IEnumObject<T> {
    source: T;
    name: string;
    i18n: I18n;
    langs?: string[];
}
export interface IEnumObjectOptions {
    key: string;
    value: string | number;
    translate: IEnumObjectTranslate;
}
export declare class EnumObject<T extends Record<string, string | number>> {
    constructor(options: IEnumObject<T>);
    i18n: I18n;
    /** 键到值的映射(键为枚举的键, 值为枚举的值) */
    valueMap: Map<string, string | number>;
    /** 值到键的映射(键为枚举的值, 值为枚举的键) */
    keyMap: Map<string | number, string>;
    source: T;
    name: string;
    private langs;
    private options;
    private translate;
    getOptions(): IEnumObjectOptions[];
    getTranslate(): IEnumObjectTranslate;
}
