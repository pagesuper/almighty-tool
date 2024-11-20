/* eslint-disable @typescript-eslint/no-var-requires */
import randomUtil, { IGenerateRandomStringParams } from '../utils/random.util';

const DEFAULT_KEY = '__ALMIGHTY_TOOL_DEFAULT__';

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

  /** 获取时间的字符串 */
  getUtcTimeString(dateTime: Date | null = null): string {
    return randomUtil.getUtcTimeString(dateTime);
  },

  /** 生成随机的字符串 */
  generateRandomString(options: IGenerateRandomStringParams = {}): string {
    return randomUtil.generateRandomString(options);
  },

  /** 生成击穿缓存参数 */
  generateIjt(): string {
    return `${new Date().valueOf()}`;
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
