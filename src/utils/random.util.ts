import _padStart from 'lodash-es/padStart';
import _uniq from 'lodash-es/uniq';
import _reduce from 'lodash-es/reduce';
import _sample from 'lodash-es/sample';

export const DEFINED_RANDOM_CHARS = {
  /** 小写字母 */
  lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  /** 大写字母 */
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  /** 数值 */
  number: '0123456789'.split(''),
  /** 符号 */
  symbol: '~!@#$%^&*()_+'.split(''),
};

export type RANDOM_CHARS_RANGE_KEY = 'lower' | 'upper' | 'number' | 'symbol';

function getCharsByRanges(ranges: RANDOM_CHARS_RANGE_KEY | RANDOM_CHARS_RANGE_KEY[] = ['lower', 'number']): string[] {
  if (typeof ranges === 'string') {
    return DEFINED_RANDOM_CHARS[ranges] ?? [];
  } else if (typeof ranges === 'object' && ranges.length) {
    return _uniq(
      _reduce(
        ranges,
        (result: string[], rangeKey) => {
          const chars = DEFINED_RANDOM_CHARS[rangeKey] ?? [];
          result.push(...chars);
          return result;
        },
        [],
      ),
    );
  }

  return [];
}

export const RANDOM_CHARS = {
  /** 全字符 */
  full: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  /** 小写 + 数字 */
  downcase: '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
  /** 小写字母 */
  lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  /** 大写字母 */
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  /** 简单没有0 */
  simple: '13456789abcdefghijklmnopqrstuvwxy'.split(''),
  /** 数值 */
  number: '0123456789'.split(''),
  /** 符号 */
  symbol: '~!@#$%^&*()_+'.split(''),
};

export type RANDOM_CHARS_GROUP_KEY = 'full' | 'downcase' | 'lower' | 'upper' | 'simple' | 'symbol' | 'number' | 'symbol';

export interface IGenerateRandomStringParams {
  /** 默认32 */
  length?: number;
  /** 可用的字符串 */
  characters?: string[];
  /** 分组 */
  group?: RANDOM_CHARS_GROUP_KEY;
  /** 范围 */
  ranges?: RANDOM_CHARS_RANGE_KEY | RANDOM_CHARS_RANGE_KEY[];
  /** time类型 */
  timeType?: 'date' | 'number' | 'char' | 'none';
  /** time */
  time?: Date;
  /** time长度 */
  timeLength?: number;
}

function getCharacters(options: IGenerateRandomStringParams = {}) {
  if (options.characters) {
    return options.characters;
  }

  if (options.ranges) {
    return getCharsByRanges(options.ranges);
  }

  if (options.group) {
    return RANDOM_CHARS[options.group];
  }

  return getCharsByRanges(['number', 'lower']);
}

const randomUtil = {
  /** 生成随机的字符串 */
  generateRandomString(options: IGenerateRandomStringParams = {}): string {
    const timeType = options.timeType ?? 'none';
    const timeLength = options.timeLength ?? timeType === 'none' ? 0 : 18;
    const length = Math.max(options.length ?? 32, timeLength);
    const values: string[] = [];
    const characters = getCharacters(options);
    const time = options.time ?? new Date();

    const timeString = (() => {
      switch (timeType) {
        case 'date':
          return _padStart(this.getUtcTimeString(time), timeLength, '0');

        case 'number':
          return _padStart(time.valueOf().toString(10), timeLength, '0');

        case 'char':
          return _padStart(time.valueOf().toString(36), timeLength, '0');

        default:
          return '';
      }
    })();

    values.push(timeString);

    const randomLength = values[0] ? length - values[0].length : length;

    for (let index = 0; index < randomLength; index++) {
      const sample = _sample(characters);

      if (sample) {
        values.push(sample);
      }
    }

    return values.join('');
  },

  /** 获取时间的字符串 */
  getUtcTimeString(dateTime: Date | null = null): string {
    const time = dateTime || new Date();

    return [
      time.getUTCFullYear(),
      _padStart(String(time.getUTCMonth() + 1), 2, '0'),
      _padStart(String(time.getUTCDate()), 2, '0'),
      _padStart(String(time.getUTCHours()), 2, '0'),
      _padStart(String(time.getUTCMinutes()), 2, '0'),
      _padStart(String(time.getUTCSeconds()), 2, '0'),
      _padStart(String(time.getUTCMilliseconds()), 3, '0'),
    ].join('');
  },
};

export default randomUtil;
export { randomUtil };
