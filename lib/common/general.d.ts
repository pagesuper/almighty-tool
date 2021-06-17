import { IGeneralResult, IGeneralOptions, IGeneralError, IGeneralOptionsWithT } from '../interfaces/common/general';
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
    /** 生成击穿缓存参数 */
    generateIjt(): string;
    /** 缓存抓取 */
    cacheFetch<T extends IGeneralResult>(options?: IGeneralOptionsWithT<T>): Promise<T | null>;
};
export default _default;
