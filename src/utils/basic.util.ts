/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import base64Js from 'base64-js';
import { isPlainObject } from 'is-what';
import _ from 'lodash';
import qs from 'qs';

export interface AnyObject {
  [key: string]: any;
}

export interface ISetClipboardDataOptions {
  /**
   * 需要设置的内容
   */
  data: string;
  /**
   * 成功返回的回调函数
   */
  success?: (result: any) => void;
  /**
   * 失败的回调函数
   */
  fail?: (result: any) => void;
  /**
   * 结束的回调函数（调用成功、失败都会执行）
   */
  complete?: (result: any) => void;
}

const basicUtil = {
  /** 将css样式对象转为字符串 */
  cssObjectToString(style: Record<string, string | boolean>): string {
    const styles: string[] = [];

    _.each(style, (value: string | boolean, key: string) => {
      if (value !== null && value !== false) {
        styles.push(`${key}: ${value}`);
      }
    });

    return styles.join('; ');
  },

  /** 文本复制: 暂支持h5端网页版 */
  setClipboardData(options: ISetClipboardDataOptions): void {
    const data = (options || {}).data || '';
    let isOk = false;

    if (typeof document !== 'undefined' && typeof document.createElement !== 'undefined') {
      const textarea = document.createElement('textarea');

      try {
        textarea.value = data;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('Copy');
        document.body.removeChild(textarea);

        if (options && typeof options.success === 'function') {
          options.success({
            data,
            errMsg: 'setClipboardData:ok',
          });

          isOk = true;
        }
      } catch (error) {
        if (options && typeof options.fail === 'function') {
          options.fail({
            data,
            errMsg: 'setClipboardData:fail',
          });
        }
      } finally {
        if (options && typeof options.complete === 'function') {
          if (isOk) {
            options.complete({
              data,
              errMsg: 'setClipboardData:ok',
            });
          } else {
            options.complete({
              data,
              errMsg: 'setClipboardData:fail',
            });
          }
        }
      }
    } else {
      if (typeof options !== 'undefined' && typeof options.fail === 'function') {
        options.fail({
          data,
          errMsg: 'setClipboardData:fail',
        });
      }

      if (typeof options !== 'undefined' && typeof options.complete === 'function') {
        options.complete({
          data,
          errMsg: 'setClipboardData:fail',
        });
      }
    }
  },

  /** 根据baseUrl and queryString构造URL */
  buildUrl(url: string, query: string | object = {}): string {
    const queryString = typeof query === 'string' ? query : qs.stringify(query);

    if (queryString) {
      if (url.includes('?')) {
        if (url.endsWith('&')) {
          return `${url}${queryString}`;
        } else {
          return `${url}&${queryString}`;
        }
      } else {
        return `${url}?${queryString}`;
      }
    }

    return url;
  },

  base64Encode(value: string): string {
    return base64Js.fromByteArray(new TextEncoder().encode(value));
  },

  base64Decode(value: string): string {
    const decodedBytes = base64Js.toByteArray(value);
    return new TextDecoder().decode(decodedBytes);
  },

  /** 将一个对象转为查询参数 */
  encodeQuery(query: object): string {
    return encodeURIComponent(basicUtil.base64Encode(JSON.stringify(query)));
  },

  /** 将编码后的查询参数解开 */
  decodeQuery(str: string): object {
    return JSON.parse(basicUtil.base64Decode(decodeURIComponent(str)));
  },

  /** 睡眠等待毫秒 */
  sleep(timeout: number) {
    return new Promise<void>((resolve: Function) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  },

  /** 异步forEach */
  async forEachAsync(arr: AnyObject[], callback: (obj: AnyObject, index: number, objs: AnyObject[]) => Promise<void>) {
    const length = arr.length;
    const objectArr = Object(arr);
    let k = 0;

    while (k < length) {
      if (k in objectArr) {
        await callback(objectArr[k], k, objectArr);
      }

      k++;
    }
  },

  /**
   *
   * 给一个对象数组进行去重
   *
   * @param objs
   * @param key
   */
  objectsUniqueByKey(objs: AnyObject[], key: string) {
    const newObjs: AnyObject[] = [];
    const cacheObjs = {};

    objs.forEach((obj: AnyObject) => {
      const value = Reflect.get(obj, key);

      if (typeof Reflect.get(cacheObjs, value) === 'undefined') {
        newObjs.push(obj);
        Reflect.set(cacheObjs, value, obj);
      }
    });

    return newObjs;
  },

  /**
   *
   * 给一个对象数组按照key来索引
   *
   * @param objs
   * @param key
   */
  objectsIndexByKey(objs: AnyObject[], key: string) {
    const newObjs = {};

    objs.forEach((obj: AnyObject) => {
      Reflect.set(newObjs, Reflect.get(obj, key), obj);
    });

    return newObjs;
  },

  /**
   *
   * 给一个对象数组fn进行索引，返回对象
   *
   * @param objs
   * @param fn
   */
  objectsIndexByFn(objs: AnyObject[], fn: (obj: AnyObject) => string) {
    const newObjs: AnyObject = {};

    objs.forEach((obj: AnyObject) => {
      Reflect.set(newObjs, fn(obj), obj);
    });

    return newObjs;
  },

  /**
   *
   * 给一个对象数组按照key来分组
   *
   * @param objs
   * @param key
   */
  objectsGroupByKey(objs: AnyObject[], key: string) {
    const newObjs = {};

    objs.forEach((obj: AnyObject) => {
      const value = obj[key];
      let pairObjs = Reflect.get(newObjs, value);

      if (typeof pairObjs === 'undefined') {
        pairObjs = [];
        Reflect.set(newObjs, value, pairObjs);
      }

      pairObjs.push(obj);
    });

    return newObjs;
  },

  /**
   *
   * 给一个对象数组按照fn来分组
   *
   * @param objs
   * @param fn
   */
  objectsGroupByFn(objs: AnyObject[], fn: (obj: AnyObject) => string) {
    const newObjs = {};

    objs.forEach((obj: any) => {
      const value = fn(obj);
      let pairObjs = Reflect.get(newObjs, value);

      if (typeof pairObjs === 'undefined') {
        pairObjs = [];
        Reflect.set(newObjs, value, pairObjs);
      }

      pairObjs.push(obj);
    });

    return newObjs;
  },

  /** 将对象按照特定的key进行排序 */
  sortKeys(
    obj: AnyObject,
    options: {
      deep?: boolean;
      compare?: (a: string, b: string) => number;
    } = {},
  ) {
    if (!isPlainObject(obj) && !Array.isArray(obj)) {
      throw new TypeError('Expected a plain object or array');
    }

    const { deep, compare } = options;
    const seenInput: AnyObject[] = [];
    const seenOutput: AnyObject[] = [];

    const deepSortArray = (array: AnyObject[]) => {
      const seenIndex = seenInput.indexOf(array);
      if (seenIndex !== -1) {
        return seenOutput[seenIndex];
      }

      const result: AnyObject[] = [];

      seenInput.push(array);
      seenOutput.push(result);

      array.forEach((item) => {
        if (Array.isArray(item)) {
          array.push(deepSortArray(item));
        }

        if (isPlainObject(item)) {
          array.push(_sortKeys(item));
        }

        array.push(item);
      });

      return result;
    };

    const _sortKeys = (object: AnyObject) => {
      const seenIndex = seenInput.indexOf(object);

      if (seenIndex !== -1) {
        return seenOutput[seenIndex];
      }

      const result = {};
      const keys = Object.keys(object).sort(compare);

      seenInput.push(object);
      seenOutput.push(result);

      for (const key of keys) {
        const value = object[key];
        let newValue;

        if (deep && Array.isArray(value)) {
          newValue = deepSortArray(value);
        } else {
          newValue = deep && isPlainObject(value) ? _sortKeys(value) : value;
        }

        Object.defineProperty(result, key, {
          ...Object.getOwnPropertyDescriptor(object, key),
          value: newValue,
        });
      }

      return result;
    };

    if (Array.isArray(obj)) {
      return deep ? deepSortArray(obj) : obj.slice();
    }

    return _sortKeys(obj);
  },
};

export default basicUtil;
