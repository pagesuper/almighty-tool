import { IGeneralResult, IGeneralOptions, IGeneralError, IGeneralOptionsWithT } from '../interfaces/common/general';
declare type RANDOM_CHARS_GROUP_KEY = 'full' | 'downcase' | 'lower' | 'simple' | 'number';
interface IGenerateRandomStringParams {
    /** 默认32 */
    length?: number;
    /** 可用的字符串 */
    characters?: string[];
    /** 分组 */
    group?: RANDOM_CHARS_GROUP_KEY;
    /** 时间的长度 */
    timeLength?: number;
}
export declare class GeneralError implements IGeneralError {
    constructor(error?: IGeneralError);
    /** 路径 */
    path: string;
    /** 错误信息 */
    message: string;
    /** 错误逻辑 */
    info: string;
}
export declare class GeneralResult implements IGeneralResult {
    constructor(options?: IGeneralOptions);
    /** 状态 */
    errMsg?: string;
    /** 请求失败的结果 */
    errInfo?: string;
    /** 请求的参数 */
    options: IGeneralOptions;
    /** 错误 */
    errors: GeneralError[];
    /** 增加错误 */
    pushError(error: IGeneralError): void;
}
declare const _default: {
    /** 获取md5 */
    md5(value: string): string;
    /** 生成安全的随机字符串 */
    generateSecureRandom(bytes?: number): string;
    /** 获取时间的字符串 */
    getUtcTimeString(dateTime?: Date | null): string;
    /** 生成随机的字符串 */
    generateRandomString(options?: IGenerateRandomStringParams): string;
    /** 生成击穿缓存参数 */
    generateIjt(): string;
    /** 缓存抓取 */
    cacheFetch<T extends IGeneralResult>(options?: IGeneralOptionsWithT<T>): Promise<T | null>;
    /** 版本比较 */
    compareVersion(v01: string, v02: string): 0 | 1 | -1;
};
export default _default;
