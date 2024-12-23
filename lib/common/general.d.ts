import { IGenerateRandomStringParams } from '../utils/random.util';
declare const _default: {
    /** 获取全局 */
    getGlobal(): Object;
    /** 设置默认值 */
    setDefault<T>(key: string, value: T): void;
    /** 获取默认值 */
    getDefault<T_1>(key: string): T_1;
    /** 获取有效值 */
    getValidValue(inputValue: number, minValue: number, maxValue: number): number;
    /** 获取时间的字符串 */
    getUtcTimeString(dateTime?: Date | null): string;
    /** 生成随机的字符串 */
    generateRandomString(options?: IGenerateRandomStringParams): string;
    /** 生成击穿缓存参数 */
    generateIjt(): string;
};
export default _default;
