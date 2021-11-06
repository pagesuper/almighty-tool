/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ICssStyle, CSS_STYLE_TYPE } from '../interfaces/common/general';
import _ from 'lodash';

export interface SetClipboardDataOptions {
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

export default {
  styleToString(style: ICssStyle): string {
    const styles: string[] = [];

    _.each(style, (value: CSS_STYLE_TYPE, key: string) => {
      if (value !== null && value !== false) {
        styles.push(`${key}: ${value}`);
      }
    });

    return styles.join('; ');
  },

  /** 文本复制: 暂支持h5端网页版 */
  setClipboardData(options: SetClipboardDataOptions): void {
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
  buildUrl(url: string, queryString: string): string {
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
    } else {
      return url;
    }
  },

  /** 如果未定义则转为null */
  undefinedToNull(value: any): any {
    return typeof value === 'undefined' ? null : value;
  },

  /**
   * 判断对象是否为空
   */
  isBlank(object: any): boolean {
    switch (typeof object) {
      case 'boolean':
        return false;
      case 'function':
        return false;
      case 'number':
        return isNaN(object);
      case 'string':
        return object.trim().length === 0;
      default:
        return _.isEmpty(object);
    }
  },

  /**
   * 判断对象是否不为空
   */
  isPresent(object: any): boolean {
    return !this.isBlank(object);
  },

  /**
   * 判断对象是否为空: 如果为空则取默认值
   */
  ifBlankElse(object: any, defaultValue: any): any {
    return this.isBlank(object) ? object : defaultValue;
  },

  /**
   * 判断对象是否不为空: 如果为空则取默认值
   */
  ifPresentElse(object: any, defaultValue: any): any {
    return this.isPresent(object) ? object : defaultValue;
  },

  /**
   * 如果对象未定义则为默认值
   */
  ifUndefinedThen(object: any, defaultValue: any): any {
    return typeof object !== 'undefined' ? object : defaultValue;
  },

  /** 深拷贝 */
  deepCopy(value: any) {
    return _.cloneDeep(value);
  },

  /**
   *
   * 给一个对象数组进行去重
   *
   * @param objects
   * @param key
   */
  objectsUniqueByKey(objects: any, key: any) {
    const newObjects: any[] = [];
    const cacheObjects = {};

    objects.forEach(function (object: any) {
      const value = object[key];

      if (typeof Reflect.get(cacheObjects, value) === 'undefined') {
        newObjects.push(object);
        Reflect.set(cacheObjects, value, object);
      }
    });

    return newObjects;
  },

  /**
   *
   * 给一个对象数组按照key来索引
   *
   * @param objects
   * @param key
   */
  objectsIndexByKey(objects: any, key: any) {
    const newObjects = {};

    objects.forEach(function (object: any) {
      Reflect.set(newObjects, object[key], object);
    });

    return newObjects;
  },

  /**
   *
   * 给一个对象数组fn进行索引，返回对象
   *
   * @param objects
   * @param fn
   */
  objectsIndexByFn(objects: any, fn: Function) {
    const newObjects = {};

    objects.forEach(function (object: any) {
      Reflect.set(newObjects, fn(object), object);
    });

    return newObjects;
  },

  /**
   *
   * 给一个对象数组按照key来分组
   *
   * @param objects
   * @param key
   */
  objectsGroupByKey(objects: any, key: any) {
    const newObjects = {};

    objects.forEach(function (object: any) {
      const value = object[key];
      let pairObjects = Reflect.get(newObjects, value);

      if (typeof pairObjects === 'undefined') {
        pairObjects = [];
        Reflect.set(newObjects, value, pairObjects);
      }

      pairObjects.push(object);
    });

    return newObjects;
  },

  /**
   *
   * 给一个对象数组按照fn来分组
   *
   * @param objects
   * @param fn
   */
  objectsGroupByFn(objects: any, fn: Function) {
    const newObjects = {};

    objects.forEach(function (object: any) {
      const value = fn(object);
      let pairObjects = Reflect.get(newObjects, value);

      if (typeof pairObjects === 'undefined') {
        pairObjects = [];
        Reflect.set(newObjects, value, pairObjects);
      }

      pairObjects.push(object);
    });

    return newObjects;
  },

  /** 打乱一个数组 */
  shuffle(array: any[]): any[] {
    return _.shuffle(array);
  },
};
