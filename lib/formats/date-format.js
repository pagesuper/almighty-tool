"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dayjs_1 = tslib_1.__importDefault(require("dayjs"));
require("dayjs/locale/en");
require("../dayjs/locales/zh-cn");
var relativeTime_1 = tslib_1.__importDefault(require("dayjs/plugin/relativeTime"));
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var zh_cn_1 = tslib_1.__importDefault(require("../locales/zh-cn"));
var general_1 = tslib_1.__importDefault(require("../common/general"));
var DEFAULT_I18N_KEY = 'tuitui-lib/formats/date-format#i18n';
var i18n = {
    t: function (key, _values) {
        return lodash_1.default.get(zh_cn_1.default, key);
    },
};
/** 日期格式化工具 */
var dateFormat = {
    /**
     * 对日期对象进行格式化
     *
     * - date 日期对象或者日期字符串
     * - options 格式化选项
     */
    format: function (date, options) {
        var _a;
        if (options === void 0) { options = {}; }
        if (date) {
            var _i18n = general_1.default.getDefault(DEFAULT_I18N_KEY) || i18n;
            var locale = _i18n.t('TuituiLib.DateFormat.locale').toString();
            var template = (_a = options.template) !== null && _a !== void 0 ? _a : dateFormat.getFormatTemplate(options.formatter);
            var day = (0, dayjs_1.default)(date);
            var now = (0, dayjs_1.default)();
            switch (options.formatter) {
                case 'step':
                case 'shortStep':
                    if (now.startOf('day').diff(day) <= 0 && now.add(1, 'day').startOf('day').diff(day) > 0) {
                        /** 今天 */
                        return day
                            .locale(locale)
                            .format(_i18n.t("TuituiLib.DateFormat.".concat(options.formatter, ".today")).toString());
                    }
                    else if (now.add(1, 'day').startOf('day').diff(day) <= 0 &&
                        now.add(2, 'day').startOf('day').diff(day) > 0) {
                        /** 明天 */
                        return day
                            .locale(locale)
                            .format(_i18n.t("TuituiLib.DateFormat.".concat(options.formatter, ".tomorrow")).toString());
                    }
                    else if (now.subtract(1, 'day').startOf('day').diff(day) <= 0 &&
                        now.startOf('day').diff(day) > 0) {
                        /** 昨天 */
                        return day
                            .locale(locale)
                            .format(_i18n.t("TuituiLib.DateFormat.".concat(options.formatter, ".yesterday")).toString());
                    }
                    else if (now.startOf('year').diff(day) <= 0 &&
                        now.add(1, 'year').startOf('year').diff(day) > 0) {
                        /** 今年 */
                        return day
                            .locale(locale)
                            .format(_i18n.t("TuituiLib.DateFormat.".concat(options.formatter, ".thisYear")).toString());
                    }
                    return day
                        .locale(locale)
                        .format(_i18n.t("TuituiLib.DateFormat.".concat(options.formatter, ".longAgo")).toString());
                case 'fromNow':
                    dayjs_1.default.extend(relativeTime_1.default);
                    return day.locale(locale).fromNow();
                case 'toNow':
                    dayjs_1.default.extend(relativeTime_1.default);
                    return day.locale(locale).toNow();
                default:
                    return day.locale(locale).format(template);
            }
        }
        return '';
    },
    /** 获取格式化模板 */
    getFormatTemplate: function (formatter) {
        if (formatter === void 0) { formatter = 'default'; }
        var _i18n = general_1.default.getDefault(DEFAULT_I18N_KEY) || i18n;
        return _i18n.t("TuituiLib.DateFormat.formats.".concat(formatter));
    },
    /** 设置默认的i18n对象 */
    setDefaultI18n: function (i18n) {
        general_1.default.setDefault(DEFAULT_I18N_KEY, i18n);
    },
};
exports.default = dateFormat;
//# sourceMappingURL=date-format.js.map