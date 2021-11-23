import * as INetwork from '../interfaces/common/network';
import { AxiosStatic } from 'axios';
declare const network: {
    setDefaultRequester(requester: AxiosStatic): void;
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
