/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import * as INetwork from '../interfaces/common/network';
import qs from 'qs';
// http://axios-js.com/docs/
import axios from 'axios';
import basicUtil from '../utils/basic-util';
import General from './general';

const deepmerge = require('deepmerge');
const _ = require('lodash');

const DEFAULT_TIMEOUT = 60 * 1000;
const DEFAULT_MAX_REDIRECTS = 5;

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
  if (options.cacheable === true && options.cacher && options.cacheKey) {
    const cacheKey = getCacheKey(options.cacheKey);
    const cacheInfo = options.cacher.getStorageInfo(cacheKey);

    // 没有过期
    if (!cacheInfo.expired && cacheInfo.value !== null) {
      doNormalize(cacheInfo.value, options);

      if (typeof options.cached === 'function') {
        options.cached(cacheInfo.value as T);
      }
    }
  }

  justDoRequest(newOptions, options, resolve, reject);
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
  await doNormalize(result, options);
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
  axios
    .request(newOptions)
    .then(async (res: INetwork.IAxiosResponse<T>) => {
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
        cookies: res.cookies,
      };

      await doResolve(result, options, resolve);
    })
    .catch((error) => {
      // 默认为true
      if (options.printError !== false) {
        console.error('network.request fail, options is: ', options, 'error is: ', error);

        if (error.response) {
          console.error('network.request fail, error response is: ', error.response);
        }

        if (error.stack) {
          console.error('network.request fail, error stack is: ', error.stack);
        }
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
  /** 格式化请求参数 */
  normalizeRequestOptions<T extends INetwork.IRequestResult>(
    options: INetwork.IRequestOptions<T>,
  ): INetwork.IAxiosRequestOptions {
    const maxRedirects = basicUtil.ifUndefinedThen(
      Reflect.get(options, 'maxRedirects'),
      DEFAULT_MAX_REDIRECTS,
    );

    const locale = basicUtil.ifUndefinedThen(Reflect.get(options, 'locale'), 'zh-CN');
    const method = basicUtil.ifUndefinedThen(Reflect.get(options, 'method'), 'GET');
    const timeout = basicUtil.ifUndefinedThen(Reflect.get(options, 'timeout'), DEFAULT_TIMEOUT);
    const dataType = basicUtil.ifUndefinedThen(Reflect.get(options, 'dataType'), null);
    const headers = basicUtil.ifUndefinedThen(Reflect.get(options, 'header'), {});
    const data = basicUtil.ifUndefinedThen(Reflect.get(options, 'data'), null);
    let newData;

    const params = _.omit(
      deepmerge(options.fixedParams || {}, options.params || {}),
      options.omitParamKeys || [],
    );

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
      Reflect.set(params, '_ijt', General.generateIjt());
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
      headers,
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
};

export default network;
