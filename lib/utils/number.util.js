"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var numberUtil = {
    /** 格式化1个浮点数 */
    formatFloat: function (value, options) {
        if (options === void 0) { options = {}; }
        var splitResult = this.splitFloat(value, options);
        return [splitResult.integer, splitResult.point, splitResult.float]
            .filter(function (part) {
            return part.length > 0;
        })
            .join('');
    },
    /** 分割一个浮点数 */
    splitFloat: function (value, options) {
        var _a;
        if (options === void 0) { options = {}; }
        // 默认为true
        var ignoreTailZeros = options.ignoreTailZeros !== false;
        var maxTailsCount = (_a = options.maxTailsCount) !== null && _a !== void 0 ? _a : 2;
        var s = (value || '0').toString().trim().split('.');
        var floatPart = (ignoreTailZeros ? s[1] || '' : lodash_1.default.padEnd(s[1] || '', maxTailsCount, '0')).slice(0, maxTailsCount);
        return {
            integer: s[0] || '0',
            float: floatPart,
            point: floatPart.length ? '.' : '',
        };
    },
};
exports.default = numberUtil;
//# sourceMappingURL=number.util.js.map