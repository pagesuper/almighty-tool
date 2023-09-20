export type RANGE_UNIT = 'year' | 'years' | 'y' | 'month' | 'months' | 'M' | 'week' | 'weeks' | 'w' | 'day' | 'days' | 'd' | 'hour' | 'hours' | 'h' | 'minute' | 'minutes' | 'm' | 'second' | 'seconds' | 's' | 'millisecond' | 'milliseconds' | 'ms';
/**
 * 日期相关的方法封装
 */
declare const dateUtil: {
    /** 是否为闰年 */
    isLeapYear(date: Date): boolean;
    isLeap(year: number): boolean;
    /** 是否是一个月的最后一天 */
    isLastDayOfMonth(date: Date): boolean;
    /** 获取日期的最后一天 */
    getLastDayOfMonth(date: Date): number;
    /**
     * 时间相减
     *
     * @param date 原始时间
     * @param amount 数量
     * @param unit 单位
     * @param fixMonthDay 是否修复月份里的日期
     */
    subtract(date: Date, amount: number, unit?: RANGE_UNIT, fixMonthDay?: boolean): Date;
    /** 加时间 */
    add(date: Date, amount: number, unit: RANGE_UNIT): Date;
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
    parse(value: Date | string | null): Date | null;
    /**
     * 是否是同一年
     */
    isSameYear(value: Date, value2?: Date): boolean;
    /**
     * 是否是同一天
     */
    isSameDate(value: Date, value2?: Date): boolean;
};
export default dateUtil;
