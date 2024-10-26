"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dayjs_1 = (0, tslib_1.__importDefault)(require("dayjs"));
require("dayjs/locale/en");
require("dayjs/locale/vi");
require("dayjs/locale/zh-cn");
var relativeTime_1 = (0, tslib_1.__importDefault)(require("dayjs/plugin/relativeTime"));
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
var en_1 = (0, tslib_1.__importDefault)(require("../locales/en"));
var vi_1 = (0, tslib_1.__importDefault)(require("../locales/vi"));
var zh_cn_1 = (0, tslib_1.__importDefault)(require("../locales/zh-cn"));
var general_1 = (0, tslib_1.__importDefault)(require("../common/general"));
// type SUPPORT_LOCALES = 'zh-cn' | 'en' | 'vi';
var DEFAULT_I18N_KEY = 'almighty-tool/formats/date-format#i18n';
var i18n = {
    t: function (key, _values, locale) {
        switch (locale) {
            case 'vi':
                return lodash_1.default.get(vi_1.default, key);
            case 'en':
                return lodash_1.default.get(en_1.default, key);
            case 'zh-cn':
            default:
                return lodash_1.default.get(zh_cn_1.default, key);
        }
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
        var _a, _b;
        if (options === void 0) { options = {}; }
        var result = '';
        if (date) {
            try {
                var _i18n = general_1.default.getDefault(DEFAULT_I18N_KEY) || i18n;
                var locale = ((_a = options.locale) !== null && _a !== void 0 ? _a : _i18n.t('AlmightyTool.DateFormat.locale').toString()).toLowerCase();
                var template = (_b = options.template) !== null && _b !== void 0 ? _b : dateFormat.getFormatTemplate(options);
                var day = (0, dayjs_1.default)(date);
                var now = (0, dayjs_1.default)();
                var localeDay = day.locale(locale);
                var i18nPrefix = "AlmightyTool.DateFormat.".concat(options.formatter);
                switch (options.formatter) {
                    case 'step':
                    case 'shortStep':
                        if (now.startOf('day').diff(day) <= 0 && now.add(1, 'day').startOf('day').diff(day) > 0) {
                            /** 今天 */
                            result = localeDay.format(_i18n.t("".concat(i18nPrefix, ".today"), undefined, locale));
                        }
                        else if (now.add(1, 'day').startOf('day').diff(day) <= 0 && now.add(2, 'day').startOf('day').diff(day) > 0) {
                            /** 明天 */
                            result = localeDay.format(_i18n.t("".concat(i18nPrefix, ".tomorrow"), undefined, locale));
                        }
                        else if (now.subtract(1, 'day').startOf('day').diff(day) <= 0 && now.startOf('day').diff(day) > 0) {
                            /** 昨天 */
                            result = localeDay.format(_i18n.t("".concat(i18nPrefix, ".yesterday"), undefined, locale));
                        }
                        else if (now.startOf('year').diff(day) <= 0 && now.add(1, 'year').startOf('year').diff(day) > 0) {
                            /** 今年 */
                            result = localeDay.format(_i18n.t("".concat(i18nPrefix, ".thisYear"), undefined, locale));
                        }
                        else {
                            result = localeDay.format(_i18n.t("".concat(i18nPrefix, ".longAgo"), undefined, locale));
                        }
                        break;
                    case 'fromNow':
                        dayjs_1.default.extend(relativeTime_1.default);
                        result = localeDay.fromNow();
                        break;
                    case 'toNow':
                        dayjs_1.default.extend(relativeTime_1.default);
                        result = localeDay.toNow();
                        break;
                    default:
                        result = localeDay.format(template);
                        break;
                }
            }
            catch (error) { }
        }
        return result;
    },
    /** 获取格式化模板 */
    getFormatTemplate: function (options) {
        var _a;
        if (options === void 0) { options = {}; }
        var formatter = (_a = options.formatter) !== null && _a !== void 0 ? _a : 'default';
        var _i18n = general_1.default.getDefault(DEFAULT_I18N_KEY) || i18n;
        return _i18n.t("AlmightyTool.DateFormat.formats.".concat(formatter));
    },
    /** 设置默认的i18n对象 */
    setDefaultI18n: function (i18n) {
        general_1.default.setDefault(DEFAULT_I18N_KEY, i18n);
    },
};
exports.default = dateFormat;
//# sourceMappingURL=date.format.js.map