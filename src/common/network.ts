/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import qs from 'qs';
import * as INetwork from '../interfaces/common/network';
// http://axios-js.com/docs/
import axios, { AxiosResponse, AxiosStatic } from 'axios';
import deepmerge from 'deepmerge';
import _ from 'lodash';
import { IInterceptOptions } from '../interfaces/common/network';
import basicUtil from '../utils/basic-util';
import general from './general';

type CATCHER = (error: any) => void;

const merge = require('deepmerge');
const DEFAULT_TIMEOUT = 60 * 1000;
const DEFAULT_MAX_REDIRECTS = 5;
const DEFAULT_REQUESTER_KEY = 'tuitui-lib/common/network#DefaultRequester';
const DEFAULT_HEADERS_KEY = 'tuitui-lib/common/network#DefaultHeaders';
const DEFAULT_INTERCEPT_KEY = 'tuitui-lib/common/network#DefaultIntercept';
const DEFAULT_CATCHES_KEY = 'tuitui-lib/common/network#DefaultCatchesKey';

const doReject = function <T extends INetwork.IRequestResult>(
  options: INetwork.IRequestOptions<T>,
  result: INetwork.IRequestResult,
  reject: any,
) {
  if (options.name) {
    result.name = options.name;
  }

  if (typeof options.fail === 'function') {
    options.fail(result as T);
  }

  if (typeof options.complete === 'function') {
    options.complete(result as T);
  }

  reject(result);
};

const doRequest = function <T extends INetwork.IRequestResult>(
  newOptions: INetwork.IAxiosRequestOptions,
  options: INetwork.IRequestOptions<T>,
  resolve: any,
  reject: any,
) {
  if (typeof options.beforeFilter === 'function') {
    if (options.beforeFilter(options.options || options)) {
      return doRequestWithCache(newOptions, options, resolve, reject);
    }
  } else {
    return doRequestWithCache(newOptions, options, resolve, reject);
  }
};

const getCacheKey = function (cacheKey: string): string {
  return `network.cache.${cacheKey}`;
};

const doRequestWithCache = function <T extends INetwork.IRequestResult>(
  newOptions: INetwork.IAxiosRequestOptions,
  options: INetwork.IRequestOptions<T>,
  resolve: any,
  reject: any,
) {
  let cached = false;
  /** 默认为false */
  const cachedCancel = options.cachedCancel === true;

  if (options.cacheable === true && options.cacher && options.cacheKey) {
    const cacheKey = getCacheKey(options.cacheKey);
    const cacheInfo = options.cacher.getStorageInfo(cacheKey);

    // 没有过期
    if (!cacheInfo.expired && cacheInfo.value !== null) {
      cached = true;

      if (cachedCancel && cached) {
        doResolve(cacheInfo.value, options, resolve);
      } else {
        doNormalize(cacheInfo.value, options);
      }

      if (typeof options.cached === 'function') {
        options.cached(cacheInfo.value as T);
      }
    }
  }

  if (!cachedCancel || !cached) {
    justDoRequest(newOptions, options, resolve, reject);
  }
};

const doNormalize = async function <T extends INetwork.IRequestResult>(
  result: INetwork.IRequestResult,
  options: INetwork.IRequestOptions<T>,
) {
  if (typeof options.normalize === 'function') {
    result.ndata = result.ndata || {};
    options.normalize(result as T);
  } else if (typeof options.asyncNormalize === 'function') {
    result.ndata = result.ndata || {};
    await options.asyncNormalize(result as T);
  } else {
    result.ndata = result.data;
  }
};

const doResolve = async function <T extends INetwork.IRequestResult>(
  result: INetwork.IRequestResult,
  options: INetwork.IRequestOptions<T>,
  resolve: any,
) {
  if (!network.getIntercept().normalize(result, options)) {
    await doNormalize(result, options);
  }

  resolve(result as T);

  if (options.cacheable === true && options.cacher && options.cacheKey) {
    const cacheOptions = options.cacheOptions || { expiresIn: -1 };
    const cacheKey = getCacheKey(options.cacheKey);
    options.cacher.setStorage(cacheKey, result, cacheOptions);
  }

  if (typeof options.success === 'function') {
    options.success(result as T);
  }

  if (typeof options.complete === 'function') {
    options.complete(result as T);
  }
};

const justDoRequest = function <T extends INetwork.IRequestResult>(
  newOptions: INetwork.IAxiosRequestOptions,
  options: INetwork.IRequestOptions<T>,
  resolve: any,
  reject: any,
) {
  const startAt = new Date().valueOf();

  if (typeof options.beforeRequest === 'function') {
    options.beforeRequest();
  }

  ((general.getDefault(DEFAULT_REQUESTER_KEY) || axios) as AxiosStatic)
    .request(newOptions)
    .then(async (res: AxiosResponse<T>) => {
      if (typeof options.afterRequest === 'function') {
        options.afterRequest();
      }

      /**
       * 成功的请求处理
       */
      const result: INetwork.IRequestResult = {
        name: options.name,
        mark: options.mark,
        errors: [],
        options,
        errMsg: 'request:ok',
        statusCode: res.status,
        header: res.headers,
        data: res.data,
        // cookies: res.cookies,
      };

      await doResolve(result, options, resolve);

      if (options.printLog !== false) {
        const messages = [];
        const duration = new Date().valueOf() - startAt;

        messages.push(`==> network ok, [${duration}ms] (${options.method}) ${options.url}`);
        // messages.push(`\n - options is: `, JSON.stringify(options));
        // messages.push(`\n - result is: `, JSON.stringify(result));
        messages.push(`\n - options is: `, options);
        messages.push(`\n - result is: `, result);

        console.log(...messages);
      }
    })
    .catch((error) => {
      _.entries((general.getDefault(DEFAULT_CATCHES_KEY) || {}) as Record<string, CATCHER>).forEach(([_key, cacher]) => {
        try {
          cacher(error);
          // eslint-disable-next-line no-empty
        } catch (_err) {}
      });

      if (typeof options.afterRequest === 'function') {
        options.afterRequest();
      }

      if (options.printError !== false) {
        const messages = [];
        const duration = new Date().valueOf() - startAt;

        messages.push(`==> network fail, [${duration}ms] ${options.method} ${options.url}`);
        messages.push(`\n - options is: `, options);

        if (error.response) {
          messages.push('\n - response is: ', error.response);
        }

        if (error.stack) {
          messages.push('\n - stack is: ', error.stack);
        }

        console.error(...messages);
      }

      /**
       * 失败的请求处理
       */
      if (error.response) {
        /**
         * 有响应的失败处理
         */
        const result: INetwork.IRequestResult = {
          errors: [
            {
              path: 'base.network',
              message: error.toString(),
              info: 'request:fail',
            },
          ],
          options,
          errMsg: 'request:fail',
          errInfo: error.toString(),
          statusCode: error.response.status,
          header: error.response.headers,
          data: error.response.data,
          cookies: error.response.cookies,
        };

        doReject(options, result, reject);
      } else {
        /** 无响应的失败处理 */
        const result: INetwork.IRequestResult = {
          errors: [
            {
              path: 'base.network',
              message: error.toString(),
              info: 'request:fail',
            },
          ],
          options,
          errMsg: 'request:fail',
          errInfo: error.toString(),
        };

        doReject(options, result, reject);
      }
    });
};

const network = {
  /** 设置默认的请求器 */
  setDefaultRequester(requester: AxiosStatic): void {
    general.setDefault(DEFAULT_REQUESTER_KEY, requester);
  },

  /** 设置默认的请求头 */
  setDefaultHeaders: (headers: Record<string, string>): void => {
    general.setDefault(DEFAULT_HEADERS_KEY, _.merge(general.getDefault(DEFAULT_HEADERS_KEY) ?? {}, headers));
  },

  /** 移除默认的请求头 */
  removeDefaultHeaders: (headerKeys: string[]): void => {
    general.setDefault(DEFAULT_HEADERS_KEY, _.omit(general.getDefault(DEFAULT_HEADERS_KEY) ?? {}, headerKeys));
  },

  addDefaultCatch: (options: Record<string, CATCHER>): void => {
    general.setDefault<CATCHER>(DEFAULT_CATCHES_KEY, _.merge(general.getDefault<CATCHER>(DEFAULT_CATCHES_KEY) ?? {}, options));
  },

  removeDefaultCatch: (keys: string[]): void => {
    general.setDefault(DEFAULT_CATCHES_KEY, _.omit(general.getDefault(DEFAULT_CATCHES_KEY) ?? {}, keys));
  },

  /** 设置拦截功能 */
  setIntercept: (interceptOptions: IInterceptOptions): void => {
    general.setDefault(DEFAULT_INTERCEPT_KEY, interceptOptions);
  },

  /** 获取拦截功能 */
  getIntercept: (): IInterceptOptions => {
    return (
      general.getDefault(DEFAULT_INTERCEPT_KEY) || {
        normalize: (_result: any, _options: any) => {
          return false;
        },
      }
    );
  },

  /** 格式化请求参数 */
  normalizeRequestOptions<T extends INetwork.IRequestResult>(
    options: INetwork.IRequestOptions<T>,
  ): INetwork.IAxiosRequestOptions {
    const maxRedirects = basicUtil.ifUndefinedThen(Reflect.get(options, 'maxRedirects'), DEFAULT_MAX_REDIRECTS);

    const defaultLocale = typeof navigator !== 'undefined' && navigator.language ? navigator.language : undefined;
    const locale = basicUtil.ifUndefinedThen(Reflect.get(options, 'locale'), defaultLocale);
    const method = basicUtil.ifUndefinedThen(Reflect.get(options, 'method'), 'GET');
    const timeout = basicUtil.ifUndefinedThen(Reflect.get(options, 'timeout'), DEFAULT_TIMEOUT);
    const dataType = basicUtil.ifUndefinedThen(Reflect.get(options, 'dataType'), null);
    const headers: Record<string, string> = basicUtil.ifUndefinedThen(Reflect.get(options, 'header'), {});
    const data = basicUtil.ifUndefinedThen(Reflect.get(options, 'data'), null);
    let newData;

    if (options && options.options) {
      Reflect.set(options, 'options', _.cloneDeep(options.options));
    }

    const params = _.omit(merge(options.fixedParams || {}, options.params || {}), options.omitParamKeys || []);

    switch (dataType) {
      case 'form-urlencoded':
        newData = qs.stringify(data);
        Reflect.set(headers, 'Content-Type', 'application/x-www-form-urlencoded');

        break;

      default:
        newData = data;
        break;
    }

    if (options.ijt !== false) {
      Reflect.set(params, '_ijt', general.generateIjt());
    }

    if (typeof options.before === 'function') {
      options.before();
    }

    let url = `${options.baseUrl || ''}${options.url || ''}`;

    if (basicUtil.isPresent(params)) {
      const queryString = qs.stringify(params, {
        arrayFormat: options.paramsArrayFormat || 'brackets',
      });

      url = basicUtil.buildUrl(url, queryString);
    }

    return {
      ..._.pick(options, [
        'dataType',
        'responseType',
        'transformRequest',
        'transformResponse',
        'timeout',
        'timeoutErrorMessage',
        'withCredentials',
        'auth',
        'xsrfCookieName',
        'xsrfHeaderName',
        'onUploadProgress',
        'onDownloadProgress',
        'maxContentLength',
        'validateStatus',
        'socketPath',
        'httpAgent',
        'httpsAgent',
        'proxy',
        'cancelToken',
      ]),
      locale,
      url,
      method,
      headers: deepmerge(general.getDefault(DEFAULT_HEADERS_KEY) ?? {}, headers),
      data: newData,
      timeout,
      maxRedirects,
    };
  },

  /**
   * 发起请求
   */
  request<T extends INetwork.IRequestResult>(options: INetwork.IRequestOptions<T>): Promise<T> {
    const newOptions = network.normalizeRequestOptions(options);

    return new Promise((resolve, reject) => {
      if (options.skipValidate !== true && typeof options.validate === 'function') {
        const result = options.validate(options.options || options);

        if (result.errors.length === 0) {
          doRequest(newOptions, options, resolve, reject);
        } else {
          doReject(options, result, reject);
        }
      } else {
        doRequest(newOptions, options, resolve, reject);
      }
    });
  },

  /**
   * 发起GraphQL请求
   */
  requestGraphQL<T extends INetwork.IRequestResult>(options: INetwork.IRequestGraphQLOptions<T>): Promise<T> {
    const data = {
      operationName: basicUtil.ifUndefinedThen(options.operationName, null),
      query: options.query,
      variables: options.variables,
    };

    return this.request({ ...options, data });
  },
};

export default network;
