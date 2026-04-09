"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var get_1 = tslib_1.__importDefault(require("lodash-es/get"));
var index_1 = tslib_1.__importDefault(require("../i18n/en-US/index"));
var index_2 = tslib_1.__importDefault(require("../i18n/zh-CN/index"));
var general_1 = tslib_1.__importDefault(require("../common/general"));
var DEFAULT_I18N_KEY = 'almighty-tool/formats/duration-format#i18n';
var i18n = {
    t: function (key, _values, locale) {
        switch (locale === null || locale === void 0 ? void 0 : locale.toLowerCase()) {
            case 'en':
                return (0, get_1.default)(index_1.default, key);
            case 'zh-cn':
            default:
                return (0, get_1.default)(index_2.default, key);
        }
    },
};
/** 时长格式化工具 */
var durationFormat = {
    /**
     * 对秒数进行格式化
     *
     * - seconds 秒数
     * - options 格式化选项
     */
    format: function (seconds, options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        if (seconds < 0) {
            return '';
        }
        try {
            var _i18n = general_1.default.getDefault(DEFAULT_I18N_KEY) || i18n;
            var locale = ((_a = options.locale) !== null && _a !== void 0 ? _a : _i18n.t('AlmightyTool.DurationFormat.locale').toString()).toLowerCase();
            var formatter = (_b = options.formatter) !== null && _b !== void 0 ? _b : 'default';
            var i18nPrefix = "AlmightyTool.DurationFormat.".concat(formatter);
            var years = Math.floor(seconds / (365 * 24 * 60 * 60));
            var days = Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60));
            var hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
            var minutes = Math.floor((seconds % (60 * 60)) / 60);
            var remainingSeconds = Math.floor(seconds % 60);
            var parts = [];
            if (years > 0) {
                parts.push("".concat(years).concat(_i18n.t("".concat(i18nPrefix, ".year"), undefined, locale)));
            }
            if (days > 0 || (years > 0 && days === 0)) {
                parts.push("".concat(days).concat(_i18n.t("".concat(i18nPrefix, ".day"), undefined, locale)));
            }
            if (hours > 0 || (parts.length > 0 && hours === 0)) {
                parts.push("".concat(hours).concat(_i18n.t("".concat(i18nPrefix, ".hour"), undefined, locale)));
            }
            if (minutes > 0 || (parts.length > 0 && minutes === 0)) {
                parts.push("".concat(minutes).concat(_i18n.t("".concat(i18nPrefix, ".minute"), undefined, locale)));
            }
            parts.push("".concat(remainingSeconds).concat(_i18n.t("".concat(i18nPrefix, ".second"), undefined, locale)));
            return parts.join('');
        }
        catch (error) {
            return '';
        }
    },
    /** 设置默认的i18n对象 */
    setDefaultI18n: function (i18n) {
        general_1.default.setDefault(DEFAULT_I18N_KEY, i18n);
    },
};
exports.default = durationFormat;
//# sourceMappingURL=duration.format.js.map