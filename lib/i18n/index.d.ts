declare const messages: {
    'en-US': {
        validate: {
            string: {
                'must-be-between-the-range-of-characters': string;
                'must-be-at-least-characters': string;
                'cannot-be-longer-than-characters': string;
                'must-be-exactly-characters': string;
                'pattern-mismatch': string;
            };
            number: {
                'must-be-between-the-range-of-numbers': string;
                'cannot-be-greater-than': string;
                'cannot-be-less-than': string;
                'must-equal': string;
            };
            array: {
                'must-be-between-the-range-of-array-length': string;
                'cannot-be-less-than-array-length': string;
                'cannot-be-greater-than-array-length': string;
                'must-be-exactly-array-length': string;
            };
            'regexp-key': {
                'invalid:id-card-china': string;
                'invalid:id-card-15-china': string;
                'invalid:phone-number': string;
                'invalid:email': string;
                'invalid:url': string;
                'invalid:ipv4-address': string;
                'invalid:ipv6-address': string;
                'invalid:mac-address': string;
                'invalid:ip-address': string;
                'invalid:domain-name': string;
                'invalid:date-format': string;
                'invalid:time-format': string;
                'invalid:date-time-format': string;
                'invalid:words-chinese': string;
                'invalid:pure-number': string;
                'invalid:contain-blank': string;
                'invalid:blank-string': string;
                'invalid-reversed:id-card-china': string;
                'invalid-reversed:id-card-15-china': string;
                'invalid-reversed:phone-number': string;
                'invalid-reversed:email': string;
                'invalid-reversed:url': string;
                'invalid-reversed:ipv4-address': string;
                'invalid-reversed:ipv6-address': string;
                'invalid-reversed:mac-address': string;
                'invalid-reversed:ip-address': string;
                'invalid-reversed:domain-name': string;
                'invalid-reversed:date-format': string;
                'invalid-reversed:time-format': string;
                'invalid-reversed:date-time-format': string;
                'invalid-reversed:words-chinese': string;
                'invalid-reversed:pure-number': string;
                'invalid-reversed:contain-blank': string;
                'invalid-reversed:blank-string': string;
            };
        };
    };
    'zh-CN': {
        validate: {
            string: {
                'must-be-between-the-range-of-characters': string;
                'must-be-at-least-characters': string;
                'cannot-be-longer-than-characters': string;
                'must-be-exactly-characters': string;
                'pattern-mismatch': string;
            };
            number: {
                'must-be-between-the-range-of-numbers': string;
                'cannot-be-greater-than': string;
                'cannot-be-less-than': string;
                'must-equal': string;
            };
            array: {
                'must-be-between-the-range-of-array-length': string;
                'cannot-be-less-than-array-length': string;
                'cannot-be-greater-than-array-length': string;
                'must-be-exactly-array-length': string;
            };
            'regexp-key': {
                'invalid:id-card-china': string;
                'invalid:id-card-15-china': string;
                'invalid:phone-number': string;
                'invalid:email': string;
                'invalid:url': string;
                'invalid:ipv4-address': string;
                'invalid:ipv6-address': string;
                'invalid:mac-address': string;
                'invalid:ip-address': string;
                'invalid:domain-name': string;
                'invalid:date-format': string;
                'invalid:time-format': string;
                'invalid:date-time-format': string;
                'invalid:words-chinese': string;
                'invalid:pure-number': string;
                'invalid:contain-blank': string;
                'invalid:blank-string': string;
                'invalid-reversed:id-card-china': string;
                'invalid-reversed:id-card-15-china': string;
                'invalid-reversed:phone-number': string;
                'invalid-reversed:email': string;
                'invalid-reversed:url': string;
                'invalid-reversed:ipv4-address': string;
                'invalid-reversed:ipv6-address': string;
                'invalid-reversed:mac-address': string;
                'invalid-reversed:ip-address': string;
                'invalid-reversed:domain-name': string;
                'invalid-reversed:date-format': string;
                'invalid-reversed:time-format': string;
                'invalid-reversed:date-time-format': string;
                'invalid-reversed:words-chinese': string;
                'invalid-reversed:pure-number': string;
                'invalid-reversed:contain-blank': string;
                'invalid-reversed:blank-string': string;
            };
        };
    };
};
export declare type TranslateOptions = {
    lang?: string;
    locale?: string;
    fallbackLang?: string;
    fallbackLocale?: string;
    args?: ({
        [k: string]: any;
    } | string)[] | {
        [k: string]: any;
    };
    defaultValue?: string;
    debug?: boolean;
};
export interface I18nConfig {
    i18n: I18n;
    defaultLang: string;
}
export declare const defaultLang = "zh-CN";
export interface I18nOptions {
    lang?: string;
    locale?: string;
    fallbackLang?: string;
    fallbackLocale?: string;
    messages?: Record<string, any>;
}
export declare class I18n {
    private lang;
    private fallbackLang;
    private messages;
    constructor(options: I18nOptions);
    setLang(lang: string): void;
    setFallbackLang(lang: string): void;
    t(key: string, options?: TranslateOptions): string;
}
export declare const i18nConfig: I18nConfig;
export default messages;