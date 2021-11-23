/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { IGeneralResult, IGeneralOptionsWithT } from './general';
import { AxiosStatic, Method } from 'axios';

export interface IResponseData {}

export interface IRequestResult extends IGeneralResult {
  /** 开发者服务器返回的数据 */
  data?: IResponseData;
  /** 解析过的data */
  ndata?: IResponseData;
  /** 开发者服务器返回的 HTTP 状态码 */
  statusCode?: number;
  /** cookies数组 */
  cookies?: string[];
  /** 开发者服务器返回的 HTTP Response Header */
  header?: any;
}

/** #FIXME: 逐步废弃：应使用`IRequestResult` */
export interface IRequestCallbackResult extends IRequestResult {}

export interface IAxiosRequestOptions {
  /** 名称 */
  name?: string;
  /** 语言 */
  locale: string;
  /** 链接 */
  url: string;
  /** 请求方法 */
  method: Method;
  /** 请求头 */
  headers: Record<string, any>;
  /** 数据 */
  data: any;
  /** 超时时间 */
  timeout: number;
  /** 最大跳转次数 */
  maxRedirects: number;
}

export interface IAxiosResponse<T extends IRequestResult> {
  /** 状态码 */
  status: number;
  /** 状态文本 */
  statusText: string;
  /** 头 */
  headers: Record<string, string>;
  /** 配置 */
  config: IRequestOptions<T>;
  /** 响应数据 */
  data: IResponseData;
  /** cookies */
  cookies?: string[];
}

export interface IAxiosError<T extends IRequestResult> {
  /** 消息 */
  message: string;
  /** 响应 */
  response: IAxiosResponse<T>;
  /** 请求的配置 */
  config: IRequestOptions<T>;
}

export interface IRequestTask {
  /** 中断请求任务 */
  abort(): void;
}

/** network的请求参数 */
export interface IRequestOptions<T extends IRequestResult> extends IGeneralOptionsWithT<T> {
  /** 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT */
  method?: Method;

  /** 请求器 */
  requester?: AxiosStatic;

  /**
   * 请求前需调用的参数
   */
  before?: () => void;

  /**
   * 前置将数据进行格式化
   */
  superNormalize?: (res: T) => void;

  /**
   * 前置将数据进行格式化
   */
  asyncSuperNormalize?: (res: T) => Promise<void>;

  /**
   * 将数据进行格式化
   */
  normalize?: (res: T) => void;

  /**
   * 将数据进行格式化
   */
  asyncNormalize?: (res: T) => Promise<void>;

  /**
   * 成功返回的回调函数
   */
  success?: (res: T) => void;

  /**
   * 失败的回调函数
   */
  fail?: (res: T) => void;

  /**
   * 结束的回调函数（调用成功、失败都会执行）
   */
  complete?: (res?: T) => void;
}

export interface IRequestGraphQLOptions<T extends IRequestResult> extends IRequestOptions<T> {
  /** 操作名称 */
  operationName?: string | null;
  /** 查询 */
  query: string;
  /** 变量 */
  variables?: Object;
}
