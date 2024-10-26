"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 日期相关的方法封装
 */
var dateUtil = {
    /** 是否为闰年 */
    isLeapYear: function (date) {
        return dateUtil.isLeap(date.getFullYear());
    },
    isLeap: function (year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
    /** 是否是一个月的最后一天 */
    isLastDayOfMonth: function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var isLeapYear = dateUtil.isLeap(year);
        switch (month) {
            case 2:
                return (isLeapYear && day === 29) || (!isLeapYear && day === 28);
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return day === 31;
            default:
                return day === 30;
        }
    },
    /** 获取日期的最后一天 */
    getLastDayOfMonth: function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var isLeapYear = dateUtil.isLeap(year);
        switch (month) {
            case 2:
                return isLeapYear ? 29 : 28;
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            default:
                return 30;
        }
    },
    /**
     * 时间相减
     *
     * @param date 原始时间
     * @param amount 数量
     * @param unit 单位
     * @param fixMonthDay 是否修复月份里的日期
     */
    subtract: function (date, amount, unit, fixMonthDay) {
        if (unit === void 0) { unit = 'seconds'; }
        if (fixMonthDay === void 0) { fixMonthDay = true; }
        var value = date.valueOf();
        var newDate;
        var newYear;
        var newMonth;
        var newDay;
        switch (unit) {
            case 'year':
            case 'years':
            case 'y':
                newDate = new Date(value);
                newYear = date.getFullYear() - amount;
                newMonth = newDate.getMonth() + 1;
                newDay = newDate.getDate();
                // 如果是平年的2月29日，则调整为2月28日
                if (!dateUtil.isLeap(newYear) && newMonth === 2 && newDay === 29) {
                    newDate.setDate(28);
                }
                newDate.setFullYear(newYear);
                return newDate;
            case 'month':
            case 'months':
            case 'M':
                newDate = new Date(value);
                if (fixMonthDay) {
                    var day = newDate.getDate();
                    newDate.setDate(1);
                    newDate.setFullYear(date.getFullYear() - parseInt("".concat(amount / 12)));
                    newDate.setMonth(date.getMonth() - parseInt("".concat(amount % 12)));
                    var lastDay = dateUtil.getLastDayOfMonth(newDate);
                    if (lastDay < day) {
                        newDate.setDate(lastDay);
                    }
                    else {
                        newDate.setDate(day);
                    }
                }
                else {
                    newDate.setFullYear(date.getFullYear() - parseInt("".concat(amount / 12)));
                    newDate.setMonth(date.getMonth() - parseInt("".concat(amount % 12)));
                }
                return newDate;
            case 'week':
            case 'weeks':
            case 'w':
                newDate = new Date(value - amount * 3600 * 24 * 1000 * 7);
                return newDate;
            case 'day':
            case 'days':
            case 'd':
                newDate = new Date(value - amount * 3600 * 24 * 1000);
                return newDate;
            case 'hour':
            case 'hours':
            case 'h':
                newDate = new Date(value - amount * 3600 * 1000);
                return newDate;
            case 'minute':
            case 'minutes':
            case 'm':
                newDate = new Date(value - amount * 60 * 1000);
                return newDate;
            case 'second':
            case 'seconds':
            case 's':
                newDate = new Date(value - amount * 1000);
                return newDate;
            case 'millisecond':
            case 'milliseconds':
            case 'ms':
                newDate = new Date(value - amount);
                return newDate;
            default:
                newDate = new Date(value - amount * 1000);
                return newDate;
        }
    },
    /** 加时间 */
    add: function (date, amount, unit) {
        return dateUtil.subtract(date, -amount, unit);
    },
    /**
     * 将字符串解析为Date类型
     *
     * eg.
     *
     * - '2020-02-28T05:29:10.000Z' ← '2020-02-28 13:29:10'
     * - '2020-02-27T16:00:00.000Z' ← '2020-02-28'
     * - '2020-02-27T16:00:00.000Z' ← '2020/02/28'
     * - '2020-02-27T16:00:00.000Z' ← '2020/2/28'
     * - '2020-02-07T16:00:00.000Z' ← '2020/2/8'
     * - '2020-02-27T16:00:00.000Z' ← '2020年02月28日'
     * - '2020-02-28T05:29:10.000Z' ← '2020年02月28日 13:29:10'
     * - '2020-02-28T05:29:10.000Z' ← '2020年02月28日  13:29:10'
     */
    parse: function (value) {
        if (typeof value === 'object') {
            return value;
        }
        else if (typeof value === 'string' && value) {
            try {
                if (value.includes('T') && value.endsWith('Z')) {
                    return new Date(value);
                }
                else {
                    return new Date(Date.parse(value
                        .replace(/-|年|月/g, '/')
                        .replace(/日$/g, '')
                        .replace(/日\s+/g, ' ')
                        .replace(/\.\d+$/g, '')));
                }
            }
            catch (error) {
                console.warn("dateUtil.parse(".concat(value, ") fail: "), error);
                return null;
            }
        }
        else {
            return null;
        }
    },
    /**
     * 是否是同一年
     */
    isSameYear: function (value, value2) {
        if (value2 === void 0) { value2 = new Date(); }
        return value.getFullYear() === value2.getFullYear();
    },
    /**
     * 是否是同一月
     */
    isSameMonth: function (value, value2) {
        if (value2 === void 0) { value2 = new Date(); }
        return value.getFullYear() === value2.getFullYear() && value.getMonth() === value2.getMonth();
    },
    /**
     * 是否是同一天
     */
    isSameDate: function (value, value2) {
        if (value2 === void 0) { value2 = new Date(); }
        return (value.getFullYear() === value2.getFullYear() &&
            value.getMonth() === value2.getMonth() &&
            value.getDate() === value2.getDate());
    },
};
exports.default = dateUtil;
//# sourceMappingURL=date.util.js.map