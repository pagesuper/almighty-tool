import * as INetwork from '../interfaces/common/network';
import { AxiosStatic } from 'axios';
import { IInterceptOptions } from '../interfaces/common/network';
type CATCHER = (error: any) => void;
declare const network: {
    /** 设置默认的请求器 */
    setDefaultRequester(requester: AxiosStatic): void;
    /** 设置默认的请求头 */
    setDefaultHeaders: (headers: Record<string, string>) => void;
    /** 移除默认的请求头 */
    removeDefaultHeaders: (headerKeys: string[]) => void;
    addDefaultCatch: (options: Record<string, CATCHER>) => void;
    removeDefaultCatch: (keys: string[]) => void;
    /** 设置拦截功能 */
    setIntercept: (interceptOptions: IInterceptOptions) => void;
    /** 获取拦截功能 */
    getIntercept: () => IInterceptOptions;
    /** 格式化请求参数 */
    normalizeRequestOptions<T extends INetwork.IRequestResult>(options: INetwork.IRequestOptions<T>): INetwork.IAxiosRequestOptions;
    /**
     * 发起请求
     */
    request<T_1 extends INetwork.IRequestResult>(options: INetwork.IRequestOptions<T_1>): Promise<T_1>;
    /**
     * 发起GraphQL请求
     */
    requestGraphQL<T_2 extends INetwork.IRequestResult>(options: INetwork.IRequestGraphQLOptions<T_2>): Promise<T_2>;
};
export default network;
