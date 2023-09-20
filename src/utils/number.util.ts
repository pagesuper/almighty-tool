import _ from 'lodash';

export interface ISplitFloatOptions {
  /** 忽略尾部的0: 默认为true */
  ignoreTailZeros?: boolean;
  /** 最大的小数部分位数: 默认为2 */
  maxTailsCount?: number;
}

export interface ISplitFloatResult {
  /** 整数部分 */
  integer: string;
  /** 小数部分 */
  float: string;
  /** 小数点 */
  point: string;
}

const numberUtil = {
  /** 格式化1个浮点数 */
  formatFloat(value: number | string, options: ISplitFloatOptions = {}): string {
    const splitResult = this.splitFloat(value, options);
    return [splitResult.integer, splitResult.point, splitResult.float]
      .filter((part) => {
        return part.length > 0;
      })
      .join('');
  },

  /** 分割一个浮点数 */
  splitFloat(value: number | string, options: ISplitFloatOptions = {}): ISplitFloatResult {
    // 默认为true
    const ignoreTailZeros = options.ignoreTailZeros !== false;
    const maxTailsCount = options.maxTailsCount ?? 2;
    const s = (value || '0').toString().trim().split('.');
    const floatPart = (ignoreTailZeros ? s[1] || '' : _.padEnd(s[1] || '', maxTailsCount, '0')).slice(0, maxTailsCount);

    return {
      integer: s[0] || '0',
      float: floatPart,
      point: floatPart.length ? '.' : '',
    };
  },
};

export default numberUtil;
