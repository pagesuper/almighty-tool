import * as INetwork from '../interfaces/common/network';
declare const network: {
    /** 格式化请求参数 */
    normalizeRequestOptions<T extends INetwork.IRequestResult>(options: INetwork.IRequestOptions<T>): INetwork.IAxiosRequestOptions;
    /**
     * 发起请求
     */
    request<T_1 extends INetwork.IRequestResult>(options: INetwork.IRequestOptions<T_1>): Promise<T_1>;
};
export default network;
