/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import base64Js from 'base64-js';
import { isPlainObject } from 'is-what';
import _each from 'lodash-es/each';
import qs from 'qs';

export interface AnyObject {
  [key: string]: any;
}

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

export interface LikeTreeObject<T> {
  children?: T[] | null;
}

export interface TreeErgodicOptions<T> {
  depth: number;
  ancestors?: T[];
}

export interface UniqueArrayByFieldOptions<T> {
  field: keyof T;
  uniqueType?: 'keepFirst' | 'keepLast';
}

const basicUtil = {
  uniqueArrayByField<T>(arr: T[], options: UniqueArrayByFieldOptions<T>): T[] {
    const field = options.field;
    const uniqueType = options.uniqueType ?? 'keepFirst';
    const uniqueMap = new Map<string, T>();
    const keys: string[] = [];

    for (const item of arr) {
      const key = String(item[field]);

      if (uniqueType === 'keepLast') {
        const index = keys.indexOf(key);
        if (index !== -1) {
          keys.splice(index, 1);
        }
        uniqueMap.set(key, item);
        keys.push(key);
      } else {
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
          keys.push(key);
        }
      }
    }

    return keys.map((key) => uniqueMap.get(key) as T);
  },

  isEmpty(value: any): boolean {
    // 处理 null 和 undefined
    if (value === null || value === undefined) {
      return true;
    }

    // 处理字符串
    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    // 处理数组
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    // 处理 Set/Map
    switch (Object.prototype.toString.call(value)) {
      case '[object Set]':
      case '[object Map]':
        return value.size === 0;
      case '[object Object]':
        return Object.keys(value).length === 0;
    }

    // 其他类型（number, boolean, symbol, function 等）均不为空
    return false;
  },

  isPresent(value: any): boolean {
    return !basicUtil.isEmpty(value);
  },

  isPromise<T = any>(obj: any): obj is Promise<T> {
    return (
      obj instanceof Promise || (typeof obj === 'object' && typeof obj.then === 'function' && typeof obj.catch === 'function')
    );
  },

  /**
   * 获取树的子节点
   * @param compareFn 比较函数
   * @param treeChildren 树节点
   * @returns 子节点
   */
  getTreeChildren<T extends LikeTreeObject<T>>(compareFn: (node: T) => boolean, treeChildren: T | T[] = []): T[] {
    const nodes = Array.isArray(treeChildren) ? treeChildren : [treeChildren];

    for (const node of nodes) {
      if (compareFn(node)) {
        return node.children ?? [];
      }

      if (node.children) {
        const children = basicUtil.getTreeChildren(compareFn, node.children);
        if (children && children.length) {
          return children;
        }
      }
    }

    return [];
  },

  /**
   * 获取指定节点的父节点
   * @param compareFn 比较函数，用于匹配目标节点
   * @param treeNodes 树节点数组或单个树节点
   * @returns 父节点，如果未找到则返回 null
   */
  getTreeParent<T extends LikeTreeObject<T>>(compareFn: (node: T) => boolean, treeNodes: T | T[] = []): T | null {
    const nodes = Array.isArray(treeNodes) ? treeNodes : [treeNodes];

    for (const node of nodes) {
      // 如果当前节点有子节点，检查子节点是否匹配目标节点
      if (node.children) {
        for (const child of node.children) {
          if (compareFn(child)) {
            // 找到目标节点，返回其父节点
            return node;
          }
        }

        // 递归检查子节点的子节点
        const parent = this.getTreeParent(compareFn, node.children);
        if (parent) {
          // 在子节点中找到目标节点，返回其父节点
          return parent;
        }
      }
    }

    return null; // 未找到目标节点
  },

  /** 树遍历 */
  treeErgodic<T extends LikeTreeObject<T>>(
    treeChildren: T | T[],
    callFn?: (linkTreeObject: T, options: TreeErgodicOptions<T>) => void,
    options: Partial<TreeErgodicOptions<T>> = {},
  ) {
    const depth = options.depth ?? 0;
    const ancestors = options.ancestors ?? [];

    (Array.isArray(treeChildren) ? treeChildren : [treeChildren]).forEach((linkTreeObject) => {
      if (typeof callFn === 'function') {
        callFn(linkTreeObject, { depth, ancestors });
      }

      if (linkTreeObject.children?.length) {
        basicUtil.treeErgodic(linkTreeObject.children, callFn, { depth: depth + 1, ancestors: [...ancestors, linkTreeObject] });
      }
    });
  },

  /** 过滤html标签 */
  escapeHTML(str: string): string {
    const escapeChars: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return str.replace(/[&<>"']/g, (char) => escapeChars[char]);
  },

  /** 将css样式对象转为字符串 */
  cssObjectToString(style: Record<string, string | boolean>): string {
    const styles: string[] = [];

    _each(style, (value: string | boolean, key: string) => {
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

  /** 获取两个对象的差异 */
  getDifferences(obj1: any, obj2: any, options: { noStrict?: boolean } = {}): string[] {
    function areEqual(value1: any, value2: any): boolean {
      if (options.noStrict) {
        if (typeof value1 === 'number' || typeof value2 === 'number') {
          return String(value1) === String(value2);
        }

        if (typeof value1 === 'boolean' || typeof value2 === 'boolean') {
          return String(value1) === String(value2);
        }

        if (typeof value1 === 'string' || typeof value2 === 'string') {
          return String(value1) === String(value2);
        }
      }

      if (typeof value1 !== typeof value2) {
        return false;
      }

      return value1 === value2;
    }

    function implGetDifferences(obj1: any, obj2: any, path: string[] = []): string[] {
      let differences: string[] = [];

      if (Array.isArray(obj1) && Array.isArray(obj2)) {
        const maxLength = Math.max(obj1.length, obj2.length);
        for (let i = 0; i < maxLength; i++) {
          if (i >= obj1.length || i >= obj2.length || !areEqual(obj1[i], obj2[i])) {
            differences = differences.concat(implGetDifferences(obj1[i], obj2[i], [...path, i.toString()]));
          }
        }
      } else if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
        const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
        for (const key of Array.from(keys)) {
          differences = differences.concat(implGetDifferences(obj1[key], obj2[key], [...path, key]));
        }
      } else if (!areEqual(obj1, obj2)) {
        differences.push(path.join('.'));
      }

      return differences;
    }

    return implGetDifferences(obj1, obj2, []);
  },

  getTextWidth(text: string): number {
    if (!text) {
      return 0;
    }

    // ES5 兼容的正则表达式（使用代理对匹配 Emoji 和全角字符）
    const regex =
      // eslint-disable-next-line no-control-regex, no-misleading-character-class
      /[^\u0000-\u00FF]|[\uD83C-\uD83D][\uDC00-\uDFFF]|[\u20D0-\u20FF\uFE00-\uFE0F]|[\u2600-\u27BF]|[\uD83E\uD83C][\uDD00-\uDDFF]/g;

    return text.replace(regex, 'aa').length;
  },

  /** 空值合并 */
  nullCoalesce<T>(...args: (T | null | undefined)[]): T {
    for (const arg of args) {
      if (arg !== null && arg !== undefined) {
        return arg;
      }
    }
    return args[args.length - 1] as T; // 兜底返回最后一个参数（需断言为 T）
  },
};

export default basicUtil;
