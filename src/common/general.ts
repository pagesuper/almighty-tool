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
};
