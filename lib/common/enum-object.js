"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumObject = void 0;
var tslib_1 = require("tslib");
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
var i18n_1 = require("./i18n");
var EnumObject = /** @class */ (function () {
    function EnumObject(options) {
        var _this = this;
        var _a, _b;
        /** 键到值的映射(键为枚举的键, 值为枚举的值) */
        this.valueMap = new Map();
        /** 值到键的映射(键为枚举的值, 值为枚举的键) */
        this.keyMap = new Map();
        this.langs = ['zh-CN', 'en'];
        this.translateOptionsMap = null;
        this.options = null;
        this.translate = null;
        this.source = options.source;
        this.name = options.name;
        this.langs = (_a = options.langs) !== null && _a !== void 0 ? _a : this.langs;
        this.i18n = (_b = options.i18n) !== null && _b !== void 0 ? _b : i18n_1.i18nConfig.i18n;
        Object.entries(options.source).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            _this.valueMap.set(key, value);
            _this.keyMap.set(value, key);
        });
    }
    EnumObject.prototype.getI18n = function () {
        var _a;
        return (_a = (typeof this.i18n === 'function' ? this.i18n() : this.i18n)) !== null && _a !== void 0 ? _a : i18n_1.i18nConfig.i18n;
    };
    /**
     * 获取指定语言的选项
     * @param lang - 语言
     * @returns 指定语言的选项
     */
    EnumObject.prototype.getDialectOptions = function (lang) {
        return this.getOptions().map(function (option) {
            return {
                key: option.key,
                value: option.value,
                dialect: option.translate[lang],
            };
        });
    };
    EnumObject.prototype.getTranslateOptionsMap = function () {
        var _this = this;
        if (this.translateOptionsMap) {
            return this.translateOptionsMap;
        }
        var map = new Map();
        Object.entries(this.source).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (isNaN(Number(key))) {
                map.set(key, {
                    key: key,
                    value: value,
                    translate: lodash_1.default.reduce(_this.langs, function (acc, lang) {
                        Reflect.set(acc, lang, _this.getI18n().t("enum.types.".concat(_this.name, ".options.").concat(key), { lang: lang }));
                        return acc;
                    }, {}),
                });
            }
        });
        this.translateOptionsMap = map;
        return this.translateOptionsMap;
    };
    EnumObject.prototype.getTranslateOptionWithKey = function (key) {
        var _a;
        return (_a = this.getTranslateOptionsMap().get(key)) !== null && _a !== void 0 ? _a : null;
    };
    EnumObject.prototype.getTranslateOptionWithValue = function (value) {
        var _a;
        var key = this.keyMap.get(value);
        if (key) {
            return (_a = this.getTranslateOptionWithKey(key)) !== null && _a !== void 0 ? _a : null;
        }
        return null;
    };
    /**
     * 获取指定语言的名称
     * @param lang - 语言
     * @returns 指定语言的名称
     */
    EnumObject.prototype.getDialectName = function (lang) {
        return this.getTranslate()[lang];
    };
    EnumObject.prototype.getOptions = function () {
        if (this.options) {
            return this.options;
        }
        var options = [];
        var translateOptionsMap = this.getTranslateOptionsMap();
        Object.entries(this.source).forEach(function (_a) {
            var key = _a[0];
            if (isNaN(Number(key))) {
                options.push(translateOptionsMap.get(key));
            }
        });
        this.options = options;
        return this.options;
    };
    EnumObject.prototype.getTranslate = function () {
        var _this = this;
        if (this.translate) {
            return this.translate;
        }
        this.translate = lodash_1.default.reduce(this.langs, function (acc, lang) {
            Reflect.set(acc, lang, _this.getI18n().t("enum.types.".concat(_this.name, ".name"), { lang: lang }));
            return acc;
        }, {});
        return this.translate;
    };
    return EnumObject;
}());
exports.EnumObject = EnumObject;
//# sourceMappingURL=enum-object.js.map