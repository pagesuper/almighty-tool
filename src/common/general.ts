/* eslint-disable @typescript-eslint/no-var-requires */
import {
  IGeneralResult,
  IGeneralOptions,
  IGeneralError,
  IGeneralOptionsWithT,
} from '../interfaces/common/general';

const MD5 = require('md5.js');

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

export default {
  /** 获取md5 */
  md5(value: string): string {
    return new MD5().update(value).digest('hex');
  },

  /** 生成击穿缓存参数 */
  generateIjt(): string {
    return `${new Date().valueOf()}`;
  },

  /** 缓存抓取 */
  async cacheFetch<T extends IGeneralResult>(
    options: IGeneralOptionsWithT<T> = {},
  ): Promise<T | null> {
    const cacheKey = `tuitui-lib.general.cache.${options.cacheKey}`;

    if (options.cacheable && options.cacher) {
      const cacheInfo = options.cacher.getStorageInfo(cacheKey);

      // 没过期 并且 不为空
      if (!cacheInfo.expired && cacheInfo.value !== null) {
        if (typeof options.cached === 'function') {
          options.cached(cacheInfo.value as T);
        }
      }
    }

    if (typeof options.fetchFn === 'function') {
      const result = (await options.fetchFn()) as T;

      if (result.errMsg && result.errMsg.endsWith(':ok')) {
        if (options.cacheable && options.cacher) {
          options.cacher.setStorage(
            cacheKey,
            result,
            options.cacheOptions || {
              expiresIn: -1,
            },
          );
        }
      }

      return result;
    }

    return null;
  },
};
