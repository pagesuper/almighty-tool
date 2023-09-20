export interface IApiResultData<T> {
    success: boolean;
    code: string;
    message: string;
    data?: T;
}
export declare type IBasicApiResultData = IApiResultData<null>;
