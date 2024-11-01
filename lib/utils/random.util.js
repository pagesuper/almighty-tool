"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RANDOM_CHARS = exports.DEFINED_RANDOM_CHARS = void 0;
var tslib_1 = require("tslib");
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
exports.DEFINED_RANDOM_CHARS = {
    /** 小写字母 */
    lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    /** 大写字母 */
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    /** 数值 */
    number: '0123456789'.split(''),
    /** 符号 */
    symbol: '~!@#$%^&*()_+'.split(''),
};
function getCharsByRanges(ranges) {
    var _a;
    if (ranges === void 0) { ranges = ['lower', 'number']; }
    if (typeof ranges === 'string') {
        return (_a = exports.DEFINED_RANDOM_CHARS[ranges]) !== null && _a !== void 0 ? _a : [];
    }
    else if (typeof ranges === 'object' && ranges.length) {
        return lodash_1.default.uniq(lodash_1.default.reduce(ranges, function (result, rangeKey) {
            var _a;
            var chars = (_a = exports.DEFINED_RANDOM_CHARS[rangeKey]) !== null && _a !== void 0 ? _a : [];
            result.push.apply(result, chars);
            return result;
        }, []));
    }
    return [];
}
exports.RANDOM_CHARS = {
    /** 全字符 */
    full: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    /** 小写 + 数字 */
    downcase: '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
    /** 小写字母 */
    lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    /** 大写字母 */
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    /** 简单没有0 */
    simple: '13456789abcdefghijklmnopqrstuvwxy'.split(''),
    /** 数值 */
    number: '0123456789'.split(''),
    /** 符号 */
    symbol: '~!@#$%^&*()_+'.split(''),
};
function getCharacters(options) {
    if (options === void 0) { options = {}; }
    if (options.characters) {
        return options.characters;
    }
    if (options.ranges) {
        return getCharsByRanges(options.ranges);
    }
    if (options.group) {
        return exports.RANDOM_CHARS[options.group];
    }
    return getCharsByRanges(['number', 'lower']);
}
var randomUtil = {
    /** 生成随机的字符串 */
    generateRandomString: function (options) {
        var _a;
        if (options === void 0) { options = {}; }
        var length = (_a = options.length) !== null && _a !== void 0 ? _a : 32;
        var values = [];
        var characters = getCharacters(options);
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
};
exports.default = randomUtil;
//# sourceMappingURL=random.util.js.map