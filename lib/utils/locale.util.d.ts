interface IReturnValue {
    keyword?: string;
    language: string;
    variant?: string;
    country?: string;
    script?: string;
}
export default function parse(locale?: string): IReturnValue | undefined;
export declare function getLanguage(locale: string): string | undefined;
export declare function getCountry(locale: string): string | undefined;
export declare function getScript(locale: string): string | undefined;
export declare function getVariant(locale: string): string | undefined;
export declare function getKeyword(locale: string): string | undefined;
export declare function normalize(locale: string, delimeter?: string): string | undefined;
export declare function normalizeAcceptLanguage(acceptLanguage: string): string[];
export declare function prepareSupported(supported: string[] | string): {};
export declare function getBest(supported: string[] | string, locale: string | null | undefined, defaultLocale?: string | null, getAnyCountry?: boolean): string | null | undefined;
export {};
