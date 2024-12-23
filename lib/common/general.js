"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-var-requires */
var random_util_1 = (0, tslib_1.__importDefault)(require("../utils/random.util"));
var DEFAULT_KEY = '__ALMIGHTY_TOOL_DEFAULT__';
exports.default = {
    /** 获取全局 */
    getGlobal: function () {
        if (typeof window !== 'undefined') {
            return window;
        }
        return global;
    },
    /** 设置默认值 */
    setDefault: function (key, value) {
        var g = this.getGlobal();
        var PRE_DEFAULT = Reflect.get(g, DEFAULT_KEY);
        var DEFAULT = PRE_DEFAULT || {};
        if (!PRE_DEFAULT) {
            Reflect.set(g, DEFAULT_KEY, DEFAULT);
        }
        Reflect.set(DEFAULT, key, value);
    },
    /** 获取默认值 */
    getDefault: function (key) {
        var _a;
        var g = this.getGlobal();
        var PRE_DEFAULT = Reflect.get(g, DEFAULT_KEY);
        var DEFAULT = PRE_DEFAULT || {};
        if (!PRE_DEFAULT) {
            Reflect.set(g, DEFAULT_KEY, DEFAULT);
        }
        return (_a = Reflect.get(DEFAULT, key)) !== null && _a !== void 0 ? _a : null;
    },
    /** 获取有效值 */
    getValidValue: function (inputValue, minValue, maxValue) {
        if (inputValue < minValue) {
            return minValue;
        }
        if (inputValue > maxValue) {
            return maxValue;
        }
        return inputValue;
    },
    /** 获取时间的字符串 */
    getUtcTimeString: function (dateTime) {
        if (dateTime === void 0) { dateTime = null; }
        return random_util_1.default.getUtcTimeString(dateTime);
    },
    /** 生成随机的字符串 */
    generateRandomString: function (options) {
        if (options === void 0) { options = {}; }
        return random_util_1.default.generateRandomString(options);
    },
    /** 生成击穿缓存参数 */
    generateIjt: function () {
        return "".concat(new Date().valueOf());
    },
};
//# sourceMappingURL=general.js.map