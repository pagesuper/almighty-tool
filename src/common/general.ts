/* eslint-disable @typescript-eslint/no-var-requires */
import _ from 'lodash';
import {
  IGeneralResult,
  IGeneralOptions,
  IGeneralError,
  IGeneralOptionsWithT,
} from '../interfaces/common/general';
import { Stream } from 'stream';

import cryptoUtil from '../utils/crypto-util';

const DEFAULT_KEY = '__TUITUI_LIB_DEFAULT__';

const RANDOM_CHARS = {
  /** 全字符 */
  full: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRST'.split(''),
  /** 小写 + 数字 */
  downcase: '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
  /** 小写字母 */
  lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  /** 简单没有0 */
  simple: '13456789abcdefghijklmnopqrstuvwxy'.split(''),
  /** 数值 */
  number: '0123456789'.split(''),
};

type RANDOM_CHARS_GROUP_KEY = 'full' | 'downcase' | 'lower' | 'simple' | 'number';

export interface IGenerateRandomStringParams {
  /** 默认32 */
  length?: number;
  /** 可用的字符串 */
  characters?: string[];
  /** 分组 */
  group?: RANDOM_CHARS_GROUP_KEY;
  /** time类型 */
  timeType?: 'number' | 'char' | 'none';
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

export default {
  /** 获取全局 */
  getGlobal(): Object {
    if (typeof window !== 'undefined') {
      return window;
    }

    return global;
  },

  /** 设置默认值 */
  setDefault<T>(key: string, value: T): void {
    const g = this.getGlobal();
    const PRE_DEFAULT = Reflect.get(g, DEFAULT_KEY);
    const DEFAULT = PRE_DEFAULT || {};

    if (!PRE_DEFAULT) {
      Reflect.set(g, DEFAULT_KEY, DEFAULT);
    }

    Reflect.set(DEFAULT, key, value);
  },

  /** 获取默认值 */
  getDefault<T>(key: string): T {
    const g = this.getGlobal();
    const PRE_DEFAULT = Reflect.get(g, DEFAULT_KEY);
    const DEFAULT = PRE_DEFAULT || {};

    if (!PRE_DEFAULT) {
      Reflect.set(g, DEFAULT_KEY, DEFAULT);
    }

    return Reflect.get(DEFAULT, key) ?? null;
  },

  /** 获取有效值 */
  getValidValue(inputValue: number, minValue: number, maxValue: number): number {
    if (inputValue < minValue) {
      return minValue;
    }

    if (inputValue > maxValue) {
      return maxValue;
    }

    return inputValue;
  },

  /** 获取md5 */
  md5(value: string | Buffer | Stream): string {
    return cryptoUtil.md5(value.toString());
  },

  /** 生成安全的随机字符串 */
  generateSecureRandom(bytes = 16): string {
    return cryptoUtil.generateRandomBytes(bytes).toString();
  },

  /** 获取时间的字符串 */
  getUtcTimeString(dateTime: Date | null = null): string {
    const time = dateTime || new Date();

    return [
      time.getUTCFullYear(),
      _.padStart(String(time.getUTCMonth() + 1), 2, '0'),
      _.padStart(String(time.getUTCDate()), 2, '0'),
      _.padStart(String(time.getUTCHours()), 2, '0'),
      _.padStart(String(time.getUTCMinutes()), 2, '0'),
      _.padStart(String(time.getUTCSeconds()), 2, '0'),
      _.padStart(String(time.getUTCMilliseconds()), 3, '0'),
    ].join('');
  },

  /** 生成随机的字符串 */
  generateRandomString(options: IGenerateRandomStringParams = {}): string {
    const length = options.length || 32;
    const characters = options.characters || RANDOM_CHARS[options.group || 'downcase'];
    const values: string[] = [];

    switch (options.timeType) {
      case 'number':
        values.push(this.getUtcTimeString(new Date()));
        break;

      case 'char':
        values.push(new Date().valueOf().toString(36));
        break;

      default:
        break;
    }

    const randomLength = values[0] ? length - values[0].length : length;

    for (let index = 0; index < randomLength; index++) {
      const sample = _.sample(characters);

      if (sample) {
        values.push(sample);
      }
    }

    return values.join('');
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

  /** 版本比较 */
  compareVersion(v01: string, v02: string): 0 | 1 | -1 {
    const v1 = v01.split('.');
    const v2 = v02.split('.');
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
      v1.push('0');
    }
    while (v2.length < len) {
      v2.push('0');
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i]);
      const num2 = parseInt(v2[i]);

      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }

    return 0;
  },
};
