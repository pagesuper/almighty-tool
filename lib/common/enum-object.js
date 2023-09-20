"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumObject = void 0;
var tslib_1 = require("tslib");
var general_1 = (0, tslib_1.__importDefault)(require("./general"));
var DEFAULT_I18N_KEY = 'tuitui-lib/common/enum-object#i18n';
var i18n = {
    t: function (key, _values) {
        return "".concat(key);
    },
};
var EnumObject = /** @class */ (function () {
    function EnumObject(options) {
        var _this = this;
        /** 源 */
        this.__source = {};
        /** 反向源 */
        this.__reverseSource = {};
        if (options.i18n) {
            this.__i18n = options.i18n;
        }
        this.sourceName = options.sourceName;
        this.source = options.source;
        Object.entries(options.source).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            /** 如果是纯数字，则判断对应key的值是否一致 */
            if (!/^[0-9]*$/.test(key) || "".concat(Reflect.get(options.source, value)) !== key) {
                Reflect.set(_this.__source, key, value);
                Reflect.set(_this.__reverseSource, value, key);
            }
        });
    }
    /** 选择的项目 */
    EnumObject.prototype.getSelectOptions = function () {
        var _this = this;
        var options = [];
        Object.entries(this.__source).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            options.push({
                label: _this.getText(key),
                key: key,
                value: value,
            });
        });
        return options;
    };
    /** 根据key获取对应的翻译 */
    EnumObject.prototype.getText = function (key) {
        return this.i18n.t("enum.".concat(this.sourceName, ".").concat(key));
    };
    /** 根据value获取对应的翻译 */
    EnumObject.prototype.getValueText = function (value) {
        return this.i18n.t("enum.".concat(this.sourceName, ".").concat(this.getKey(value)));
    };
    /** 根据key获取对应的值 */
    EnumObject.prototype.getValue = function (key) {
        return Reflect.get(this.__source, key);
    };
    /** 根据value获取对应的key */
    EnumObject.prototype.getKey = function (value) {
        return Reflect.get(this.__reverseSource, "".concat(value));
    };
    EnumObject.prototype.toJSON = function () {
        return Object.assign({}, this, {});
    };
    Object.defineProperty(EnumObject.prototype, "i18n", {
        get: function () {
            return this.__i18n || general_1.default.getDefault(DEFAULT_I18N_KEY) || i18n;
        },
        enumerable: false,
        configurable: true
    });
    /** 设置默认的i18n对象 */
    EnumObject.prototype.setI18n = function (i18n) {
        this.__i18n = i18n;
    };
    /** 设置默认的i18n对象 */
    EnumObject.setDefaultI18n = function (i18n) {
        general_1.default.setDefault(DEFAULT_I18N_KEY, i18n);
    };
    return EnumObject;
}());
exports.EnumObject = EnumObject;
//# sourceMappingURL=enum-object.js.map