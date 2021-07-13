"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralResult = exports.GeneralError = void 0;
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var MD5 = require('md5.js');
var crypto = require('crypto');
var RANDOM_CHARS = {
    full: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRST'.split(''),
    downcase: '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
    lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    simple: '13456789abcdefghijklmnopqrstuvwxy'.split(''),
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
    /** 获取md5 */
    md5: function (value) {
        return new MD5().update(value).digest('hex');
    },
    /** 生成安全的随机字符串 */
    generateSecureRandom: function (bytes) {
        if (bytes === void 0) { bytes = 16; }
        return crypto.randomBytes(bytes).toString('hex');
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
        var count = characters.length;
        var timeLength = options.timeLength || 0;
        var randomLength = length - timeLength;
        if (timeLength > 0) {
            var time = new Date();
            values.push(this.getUtcTimeString(time).slice(0, timeLength - 1));
        }
        for (var index = 0; index < randomLength; index++) {
            values.push(characters[Math.floor(Math.random() * count)]);
        }
        return values.join('');
    },
    /** 生成击穿缓存参数 */
    generateIjt: function () {
        return "" + new Date().valueOf();
    },
    /** 缓存抓取 */
    cacheFetch: function (options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cacheKey, cacheInfo, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "tuitui-lib.general.cache." + options.cacheKey;
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
};
//# sourceMappingURL=general.js.map