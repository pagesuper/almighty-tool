"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultLocale = setDefaultLocale;
exports.getDefaultLocale = getDefaultLocale;
exports.default = parse;
exports.getLanguage = getLanguage;
exports.getCountry = getCountry;
exports.getScript = getScript;
exports.getVariant = getVariant;
exports.getKeyword = getKeyword;
exports.normalize = normalize;
exports.normalizeAcceptLanguage = normalizeAcceptLanguage;
exports.prepareSupported = prepareSupported;
exports.getBest = getBest;
var tslib_1 = require("tslib");
// flow
var lodash_es_1 = require("lodash-es");
// import debug from 'debug';
var general_1 = tslib_1.__importDefault(require("../common/general"));
// const log = debug('locale-id');
var log = console.log;
var DEFAULT_LOCALE_MEMORY_KEY = 'almighty-tool/locale.util#default-locale';
var DEFAULT_LOCALE = (_a = process.env.DEFAULT_LOCALE) !== null && _a !== void 0 ? _a : 'zh-cn';
function setDefaultLocale(key) {
    return general_1.default.setDefault(DEFAULT_LOCALE_MEMORY_KEY, key);
}
function getDefaultLocale() {
    var _a;
    return (_a = general_1.default.getDefault(DEFAULT_LOCALE_MEMORY_KEY)) !== null && _a !== void 0 ? _a : DEFAULT_LOCALE;
}
// http://userguide.icu-project.org/locale
function parse(locale) {
    if (!locale) {
        return undefined;
    }
    // extract keyword
    var stringLocale = String(locale);
    var keywordPos = stringLocale.indexOf('@');
    var keyword = keywordPos !== -1 ? stringLocale.substr(keywordPos + 1) : undefined;
    var localeWithoutKeyword = keywordPos !== -1 ? stringLocale.substr(0, keywordPos) : stringLocale;
    // en-us => en_us
    var parts = String(localeWithoutKeyword).replace(/-/g, '_').split('_');
    if (!parts.length || parts.length > 4) {
        return undefined;
    }
    var language = parts.shift();
    if (!language) {
        return undefined;
    }
    var retVar = {
        keyword: keyword,
        language: language.toLowerCase(),
    };
    if (!parts.length) {
        return retVar;
    }
    if (parts.length === 3) {
        var variant = parts.pop();
        if (variant) {
            retVar.variant = variant.toUpperCase();
        }
    }
    var country = parts.pop();
    if (country && country.length > 3) {
        retVar.keyword = country;
        country = parts.pop();
    }
    if (country) {
        retVar.country = country.toUpperCase();
    }
    if (!parts.length) {
        return retVar;
    }
    var script = parts.pop();
    if (script) {
        retVar.script = (0, lodash_es_1.capitalize)(script.toLowerCase());
    }
    return retVar;
}
function getLanguage(locale) {
    var obj = parse(locale);
    return obj && obj.language;
}
function getCountry(locale) {
    var obj = parse(locale);
    return obj && obj.country;
}
function getScript(locale) {
    var obj = parse(locale);
    return obj && obj.script;
}
function getVariant(locale) {
    var obj = parse(locale);
    return obj && obj.variant;
}
function getKeyword(locale) {
    var obj = parse(locale);
    return obj && obj.keyword;
}
function normalize(locale, delimeter) {
    if (delimeter === void 0) { delimeter = '_'; }
    var obj = parse(locale);
    if (!obj) {
        return obj;
    }
    var result = obj.language;
    if (obj.script) {
        result += "".concat(delimeter).concat(obj.script);
    }
    if (obj.country) {
        result += "".concat(delimeter).concat(obj.country);
    }
    return result;
}
var splitAcceptLanguageRegEx = /([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/gi;
var acceptLanguageItemRegEx = /^([a-z]{1,8}(-[a-z]{1,8})?)/i;
function normalizeAcceptLanguage(acceptLanguage) {
    var returnItems = [];
    if (!acceptLanguage) {
        return returnItems;
    }
    var items = acceptLanguage.match(splitAcceptLanguageRegEx) || [];
    (0, lodash_es_1.forEach)(items, function (acceptLanguageItem) {
        var _a;
        var matches = acceptLanguageItem.match(acceptLanguageItemRegEx) || [];
        var locale = normalize((_a = matches[0]) !== null && _a !== void 0 ? _a : '');
        if (locale) {
            returnItems.push(locale);
        }
    });
    return returnItems;
}
function prepareSupported(supported) {
    var lgs = {};
    (0, lodash_es_1.forEach)(supported, function (supportedLocale) {
        var parsed = parse(supportedLocale);
        if (parsed) {
            var language = parsed.language, country = parsed.country;
            if (!language) {
                throw new Error("Locale ".concat(supportedLocale, " is not parsable"));
            }
            if (!Reflect.get(lgs, language)) {
                Reflect.set(lgs, language, {
                    countries: {},
                    firstCountry: undefined,
                    main: undefined,
                });
            }
            var lg = Reflect.get(lgs, language);
            if (lg) {
                if (country) {
                    lg.countries[country] = supportedLocale;
                    if (!lg.firstCountry) {
                        lg.firstCountry = supportedLocale;
                    }
                }
                else {
                    lg.main = supportedLocale;
                }
            }
        }
    });
    return lgs;
}
function getBest(supported, locale, defaultLocale, getAnyCountry) {
    var lgs = (0, lodash_es_1.isArray)(supported) ? prepareSupported(supported) : supported;
    // return defaultLocale if current locale is undefined
    if (!locale && defaultLocale) {
        return getBest(supported, defaultLocale, undefined, getAnyCountry);
    }
    if (!locale) {
        log("Locale ".concat(locale, " is not supported"));
        return undefined;
    }
    var parsed = parse(locale);
    if (!parsed) {
        return undefined;
    }
    var language = parsed.language, country = parsed.country;
    if (!language) {
        return defaultLocale;
    }
    // selected locale is not supported
    if (!Reflect.get(lgs, language)) {
        log("Locale ".concat(locale, " is not supported"));
        if (locale === defaultLocale) {
            return undefined;
        }
        return getBest(supported, defaultLocale, null, getAnyCountry);
    }
    var _a = Reflect.get(lgs, language), countries = _a.countries, _b = _a.main, main = _b === void 0 ? defaultLocale : _b, firstCountry = _a.firstCountry;
    if (!countries || !country) {
        if (getAnyCountry && firstCountry) {
            return firstCountry;
        }
        return main;
    }
    if (getAnyCountry && firstCountry) {
        return countries[country] ? countries[country] : firstCountry;
    }
    return countries[country] ? countries[country] : main;
}
//# sourceMappingURL=locale.util.js.map