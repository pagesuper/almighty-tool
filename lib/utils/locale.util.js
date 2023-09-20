"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBest = exports.prepareSupported = exports.normalizeAcceptLanguage = exports.normalize = exports.getKeyword = exports.getVariant = exports.getScript = exports.getCountry = exports.getLanguage = void 0;
var tslib_1 = require("tslib");
// flow
var capitalize_1 = tslib_1.__importDefault(require("lodash/capitalize"));
var forEach_1 = tslib_1.__importDefault(require("lodash/forEach"));
var isArray_1 = tslib_1.__importDefault(require("lodash/isArray"));
var debug_1 = tslib_1.__importDefault(require("debug"));
var log = (0, debug_1.default)('locale-id');
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
        retVar.script = (0, capitalize_1.default)(script.toLowerCase());
    }
    return retVar;
}
exports.default = parse;
function getLanguage(locale) {
    var obj = parse(locale);
    return obj && obj.language;
}
exports.getLanguage = getLanguage;
function getCountry(locale) {
    var obj = parse(locale);
    return obj && obj.country;
}
exports.getCountry = getCountry;
function getScript(locale) {
    var obj = parse(locale);
    return obj && obj.script;
}
exports.getScript = getScript;
function getVariant(locale) {
    var obj = parse(locale);
    return obj && obj.variant;
}
exports.getVariant = getVariant;
function getKeyword(locale) {
    var obj = parse(locale);
    return obj && obj.keyword;
}
exports.getKeyword = getKeyword;
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
exports.normalize = normalize;
var splitAcceptLanguageRegEx = /([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/gi;
var acceptLanguageItemRegEx = /^([a-z]{1,8}(-[a-z]{1,8})?)/i;
function normalizeAcceptLanguage(acceptLanguage) {
    var returnItems = [];
    if (!acceptLanguage) {
        return returnItems;
    }
    var items = acceptLanguage.match(splitAcceptLanguageRegEx) || [];
    (0, forEach_1.default)(items, function (acceptLanguageItem) {
        var _a;
        var matches = acceptLanguageItem.match(acceptLanguageItemRegEx) || [];
        var locale = normalize((_a = matches[0]) !== null && _a !== void 0 ? _a : '');
        if (locale) {
            returnItems.push(locale);
        }
    });
    return returnItems;
}
exports.normalizeAcceptLanguage = normalizeAcceptLanguage;
function prepareSupported(supported) {
    var lgs = {};
    (0, forEach_1.default)(supported, function (supportedLocale) {
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
exports.prepareSupported = prepareSupported;
function getBest(supported, locale, defaultLocale, getAnyCountry) {
    var lgs = (0, isArray_1.default)(supported) ? prepareSupported(supported) : supported;
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
exports.getBest = getBest;
//# sourceMappingURL=locale.util.js.map