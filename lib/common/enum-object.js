"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumObject = void 0;
var tslib_1 = require("tslib");
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
var EnumObject = /** @class */ (function () {
    function EnumObject(options) {
        var _this = this;
        var _a;
        /** 键到值的映射(键为枚举的键, 值为枚举的值) */
        this.valueMap = new Map();
        /** 值到键的映射(键为枚举的值, 值为枚举的键) */
        this.keyMap = new Map();
        this.langs = ['zh-CN', 'en'];
        this.options = null;
        this.translate = null;
        this.source = options.source;
        this.name = options.name;
        this.langs = (_a = options.langs) !== null && _a !== void 0 ? _a : this.langs;
        this.i18n = options.i18n;
        Object.entries(options.source).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            _this.valueMap.set(key, value);
            _this.keyMap.set(value, key);
        });
    }
    EnumObject.prototype.getOptions = function () {
        var _this = this;
        if (this.options) {
            return this.options;
        }
        var options = [];
        Object.entries(this.source).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (isNaN(Number(key))) {
                options.push({
                    key: key,
                    value: value,
                    translate: lodash_1.default.reduce(_this.langs, function (acc, lang) {
                        Reflect.set(acc, lang, _this.i18n.t("enum.types.".concat(_this.name, ".options.").concat(key), { lang: lang }));
                        return acc;
                    }, {}),
                });
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
            Reflect.set(acc, lang, _this.i18n.t("enum.types.".concat(_this.name, ".name"), { lang: lang }));
            return acc;
        }, {});
        return this.translate;
    };
    return EnumObject;
}());
exports.EnumObject = EnumObject;
//# sourceMappingURL=enum-object.js.map