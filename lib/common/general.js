"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
    /** 缓存抓取 */
    cacheFetch: function (options) {
        if (options === void 0) { options = {}; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var cacheKey, cacheInfo, result;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "almighty-tool.general.cache.".concat(options.cacheKey);
                        if (options.cacheable && options.cacher) {
                            cacheInfo = options.cacher.getStorageInfo(cacheKey);
                            // 没过期 并且 不为空
                            if (!cacheInfo.expired && cacheInfo.value !== null) {
                                if (typeof options.cached === 'function') {
                                    options.cached(cacheInfo.value);
                                }
                            }
                        }
                        if (!(typeof options.fetchFn === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, options.fetchFn()];
                    case 1:
                        result = (_a.sent());
                        if (result.errMsg && result.errMsg.endsWith(':ok')) {
                            if (options.cacheable && options.cacher) {
                                options.cacher.setStorage(cacheKey, result, options.cacheOptions || {
                                    expiresIn: -1,
                                });
                            }
                        }
                        return [2 /*return*/, result];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    },
    /** 版本比较 */
    compareVersion: function (v01, v02) {
        var v1 = v01.split('.');
        var v2 = v02.split('.');
        var len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            }
            else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    },
};
//# sourceMappingURL=general.js.map