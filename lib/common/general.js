"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralResult = exports.GeneralError = void 0;
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-var-requires */
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var crypto_util_1 = tslib_1.__importDefault(require("../utils/crypto.util"));
var DEFAULT_KEY = '__TUITUI_LIB_DEFAULT__';
var RANDOM_CHARS = {
    /** 全字符 */
    full: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRST'.split(''),
    /** 小写 + 数字 */
    downcase: '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
    /** 小写字母 */
    lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    /** 简单没有0 */
    simple: '13456789abcdefghijklmnopqrstuvwxy'.split(''),
    /** 数值 */
    number: '0123456789'.split(''),
};
var GeneralError = /** @class */ (function () {
    function GeneralError(error) {
        Object.assign(this, error);
    }
    return GeneralError;
}());
exports.GeneralError = GeneralError;
var GeneralResult = /** @class */ (function () {
    function GeneralResult(options) {
        /** 请求的参数 */
        this.options = {};
        /** 错误 */
        this.errors = [];
        if (options) {
            this.options = options;
        }
    }
    /** 增加错误 */
    GeneralResult.prototype.pushError = function (error) {
        this.errors.push(new GeneralError(error));
    };
    return GeneralResult;
}());
exports.GeneralResult = GeneralResult;
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
    /** 获取md5 */
    md5: function (value) {
        return crypto_util_1.default.md5(value.toString());
    },
    /** 生成安全的随机字符串 */
    generateSecureRandom: function (bytes) {
        if (bytes === void 0) { bytes = 16; }
        return crypto_util_1.default.generateRandomBytes(bytes).toString();
    },
    /** 获取时间的字符串 */
    getUtcTimeString: function (dateTime) {
        if (dateTime === void 0) { dateTime = null; }
        var time = dateTime || new Date();
        return [
            time.getUTCFullYear(),
            lodash_1.default.padStart(String(time.getUTCMonth() + 1), 2, '0'),
            lodash_1.default.padStart(String(time.getUTCDate()), 2, '0'),
            lodash_1.default.padStart(String(time.getUTCHours()), 2, '0'),
            lodash_1.default.padStart(String(time.getUTCMinutes()), 2, '0'),
            lodash_1.default.padStart(String(time.getUTCSeconds()), 2, '0'),
            lodash_1.default.padStart(String(time.getUTCMilliseconds()), 3, '0'),
        ].join('');
    },
    /** 生成随机的字符串 */
    generateRandomString: function (options) {
        if (options === void 0) { options = {}; }
        var length = options.length || 32;
        var characters = options.characters || RANDOM_CHARS[options.group || 'downcase'];
        var values = [];
        switch (options.timeType) {
            case 'date':
                values.push(this.getUtcTimeString(new Date()));
                break;
            case 'number':
                values.push(new Date().valueOf().toString(10));
                break;
            case 'char':
                values.push(new Date().valueOf().toString(36));
                break;
            default:
                break;
        }
        var randomLength = values[0] ? length - values[0].length : length;
        for (var index = 0; index < randomLength; index++) {
            var sample = lodash_1.default.sample(characters);
            if (sample) {
                values.push(sample);
            }
        }
        return values.join('');
    },
    /** 生成击穿缓存参数 */
    generateIjt: function () {
        return "".concat(new Date().valueOf());
    },
    /** 缓存抓取 */
    cacheFetch: function (options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cacheKey, cacheInfo, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "tuitui-lib.general.cache.".concat(options.cacheKey);
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