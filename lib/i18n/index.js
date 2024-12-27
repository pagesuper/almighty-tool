"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nConfig = exports.I18n = exports.defaultLang = void 0;
var tslib_1 = require("tslib");
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
var index_1 = (0, tslib_1.__importDefault)(require("./en-US/index"));
var index_2 = (0, tslib_1.__importDefault)(require("./zh-CN/index"));
var mustache_1 = (0, tslib_1.__importDefault)(require("mustache"));
var messages = {
    'en-US': index_1.default,
    'zh-CN': index_2.default,
};
exports.defaultLang = 'zh-CN';
var I18n = /** @class */ (function () {
    function I18n(options) {
        var _a, _b, _c, _d, _e;
        this.lang = (_b = (_a = options.lang) !== null && _a !== void 0 ? _a : options.locale) !== null && _b !== void 0 ? _b : exports.defaultLang;
        this.fallbackLang = (_d = (_c = options.fallbackLang) !== null && _c !== void 0 ? _c : options.fallbackLocale) !== null && _d !== void 0 ? _d : exports.defaultLang;
        this.messages = (_e = options.messages) !== null && _e !== void 0 ? _e : messages;
    }
    I18n.prototype.setLang = function (lang) {
        this.lang = lang;
    };
    I18n.prototype.setFallbackLang = function (lang) {
        this.fallbackLang = lang;
    };
    I18n.prototype.t = function (key, options) {
        var _a, _b, _c, _d, _e, _f;
        var lang = (_b = (_a = options === null || options === void 0 ? void 0 : options.lang) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.locale) !== null && _b !== void 0 ? _b : this.lang;
        var fallbackLang = (_d = (_c = options === null || options === void 0 ? void 0 : options.fallbackLang) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.fallbackLocale) !== null && _d !== void 0 ? _d : this.fallbackLang;
        var path = key.split('.');
        var template = (_e = lodash_1.default.get(this.messages, (0, tslib_1.__spreadArray)([lang], path, true))) !== null && _e !== void 0 ? _e : lodash_1.default.get(this.messages, (0, tslib_1.__spreadArray)([fallbackLang], path, true));
        if (template && typeof template === 'string') {
            return mustache_1.default.render(template, (_f = options === null || options === void 0 ? void 0 : options.args) !== null && _f !== void 0 ? _f : {}, {}, { tags: ['{', '}'] });
        }
        return key;
    };
    return I18n;
}());
exports.I18n = I18n;
exports.i18nConfig = {
    i18n: new I18n({
        lang: exports.defaultLang,
        fallbackLang: exports.defaultLang,
        messages: messages,
    }),
};
exports.default = messages;
//# sourceMappingURL=index.js.map