export type CSS_STYLE_TYPE = string | number | boolean | null;

export interface ICssStyle {
  [propName: string]: CSS_STYLE_TYPE;
}

export type LOADMORE_STATUS = 'loading' | 'more' | 'noMore' | 'empty' | 'fail';

export interface ILoadPaginateOptions {
  /**
   * 当前页数
   */
  page: number | 1;

  /**
   * 每页返回条数
   */
  pageSize?: number | 20;
}

export interface ILoadSliceOptions {
  /**
   * 偏移方式
   *
   * None: 不移动
   * Next: 向下翻页
   * Back: 向上翻页
   */
  move: 'None' | 'Next' | 'Back';

  /**
   * 开始值
   */
  start: string;

  /**
   * 每页条数
   */
  size: number;
}

export type IPageParamsValueType = string | string[] | null | IPageParams | IPageParams[] | undefined;

export interface IPageParams extends Record<string, IPageParamsValueType> {
  [propName: string]: IPageParamsValueType;
}

/** 基本错误 */
export interface IGeneralError {
  /** 字段 */
  path: string;
  /** 消息: 可作为i18n的消息 */
  message: string;
  /** 逻辑: 可用来做业务逻辑判断 */
  info: string;
}

/** 基本响应结果 */
export interface IGeneralResult {
  /** 对应的请求的name参数 */
  name?: string;
  /** 对应的请求的mark参数 */
  mark?: string;
  /** 状态 */
  errMsg?: string;
  /** 请求失败的结果 */
  errInfo?: string;
  /** 请求的参数 */
  options?: IGeneralOptions;
  /** 错误 */
  errors: IGeneralError[];
}

export interface IGeneralSetStorageOptions {
  /** 是否覆盖过期时间？: 默认按照true来处理 */
  expiresInOverwrite?: boolean;
  /** 过期时间 */
  expiresIn?: number;
}

export interface IGeneralStorageInfo {
  expired: boolean;
  expiredAt: number;
  expiredIn: number;
  value: any;
}

/** 通用缓存器 */
export interface IGeneralCacher {
  /** 移除存储 */
  removeStorage(usage: string): any;
  /** 获取存储信息 */
  getStorageInfo(usage: string): IGeneralStorageInfo;
  /** 获取存储 */
  getStorage(usage: string): any;
  /** 设置存储 */
  setStorage(usage: string, value: any, options?: IGeneralSetStorageOptions): void;
}

export interface IGeneralOptionsWithT<T> extends IGeneralOptions {
  /** 被缓存后调用该方法 */
  cached?: (res: T) => void;
  /** 抓取方法 */
  fetchFn?: () => Promise<T>;
}

/** 基本请求参数 */
export interface IGeneralOptions {
  /** 是否开启缓存: 默认为false */
  cacheable?: boolean;
  /** 缓存器 */
  cacher?: IGeneralCacher;
  /** 缓存key */
  cacheKey?: string;
  /** 缓存的选项 */
  cacheOptions?: IGeneralSetStorageOptions;
  /** 缓存命中则放弃真实请求 */
  cachedCancel?: boolean;
  /** 请求的命名: 会回传给对应的result */
  name?: string;
  /** 是否打印错误异常 */
  printError?: boolean;
  /** 是否打印日志 */
  printLog?: boolean;
  /** 请求的标识: 会回传给对应的result */
  mark?: string;
  /** 用户传来的请求 */
  options?: IGeneralOptions;
  /** 校验方法 */
  validate?(options: IGeneralOptions): GeneralResult;
  /** 发送请求前 */
  beforeRequest?(): void;
  /** 发送请求后 */
  afterRequest?(): void;
  /** 前置过滤 */
  beforeFilter?(options?: IGeneralOptions): boolean;
  /** 语言 */
  locale?: string;
  /** 是否跳过校验 */
  skipValidate?: boolean;
  /** 是否穿透缓存 */
  ijt?: boolean;
  /** 超时时间 */
  timeout?: number;
  /** 资源url */
  url?: string;
  /** 基础URL */
  baseUrl?: string;
  /** 请求的参数: 是作为请求主体被发送的数据 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  /** 请求的参数: 是即将与请求一起发送的 URL 参数 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
  /** params参数的数据格式 */
  paramsArrayFormat?: 'brackets' | 'indices' | 'repeat';
  /** 固定的请求参数 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fixedParams?: Record<string, any>;
  /** 忽略的请求参数 */
  omitParamKeys?: string[];
  /** 设置请求的 header，header 中不能设置 Referer。 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header?: Record<string, any>;
  /** 如果设为json，会尝试对返回的数据做一次 JSON.parse */
  dataType?: 'json' | 'form-data' | 'form-urlencoded' | null;
  /** 设置响应的数据类型。合法值：text、arraybuffer */
  responseType?: string;
  /** 跨域请求时是否携带凭证 */
  withCredentials?: boolean;
  /** 定义在 node.js 中 follow 的最大重定向数目；默认: 5 */
  maxRedirects?: number;
}

export type RANDOM_CHARS_GROUP_KEY = 'full' | 'downcase' | 'lower' | 'simple' | 'number';

export interface IGenerateRandomStringParams {
  /** 默认32 */
  length?: number;
  /** 可用的字符串 */
  characters?: string[];
  /** 分组 */
  group?: RANDOM_CHARS_GROUP_KEY;
  /** time类型 */
  timeType?: 'date' | 'number' | 'char' | 'none';
}

export class GeneralError implements IGeneralError {
  public constructor(error?: IGeneralError) {
    Object.assign(this, error);
  }

  /** 路径 */
  path!: string;
  /** 错误信息 */
  message!: string;
  /** 错误逻辑 */
  info!: string;
}

export class GeneralResult implements IGeneralResult {
  public constructor(options?: IGeneralOptions) {
    if (options) {
      this.options = options;
    }
  }

  /** 状态 */
  errMsg?: string;
  /** 请求失败的结果 */
  errInfo?: string;
  /** 请求的参数 */
  options: IGeneralOptions = {};
  /** 错误 */
  errors: GeneralError[] = [];

  /** 增加错误 */
  pushError(error: IGeneralError): void {
    this.errors.push(new GeneralError(error));
  }
}
