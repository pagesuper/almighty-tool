export interface IDateUtil {
    /** 将字符串解析为Date类型 */
    parse(s: string | null): Date | null;
    /**
     * 是否是同一年
     */
    isSameYear(value: Date, value2?: Date): boolean;
    /**
     * 是否是同一天
     */
    isSameDate(value: Date, value2?: Date): boolean;
}
