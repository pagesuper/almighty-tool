'use strict';
/**
 * 一些精确的计算方法
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = {
  /** 加法 */
  add: function (arg1, arg2) {
    let r1, r2;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    const c = Math.abs(r1 - r2);
    const m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      const cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', '')) * cm;
      } else {
        arg1 = Number(arg1.toString().replace('.', '')) * cm;
        arg2 = Number(arg2.toString().replace('.', ''));
      }
    } else {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', ''));
    }
    return (arg1 + arg2) / m;
  },
  /**
   * 减法
   */
  sub: function (arg1, arg2) {
    let r1, r2;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    const m = Math.pow(10, Math.max(r1, r2));
    const n = r1 >= r2 ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
  },
  /**
   * 乘法
   */
  mul: function (arg1, arg2) {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
  },
  /**
   * 除法
   */
  div: function (arg1, arg2) {
    let t1 = 0;
    let t2 = 0;
    try {
      t1 = arg1.toString().split('.')[1].length;
    } catch (e) {}
    try {
      t2 = arg2.toString().split('.')[1].length;
    } catch (e) {}
    const t = Math.max(t1, t2);
    const digits = Math.pow(10, t);
    return (arg1 * digits) / (arg2 * digits);
  },
  /**
   * 计算位数
   */
  countDecimals: function (num) {
    let len = 0;
    try {
      num = Number(num);
      let str = num.toString().toUpperCase();
      if (str.split('E').length === 2) {
        let isDecimal = false;
        if (str.split('.').length === 2) {
          str = str.split('.')[1];
          if (parseInt(str.split('E')[0]) !== 0) {
            isDecimal = true;
          }
        }
        const x = str.split('E');
        if (isDecimal) {
          len = x[0].length;
        }
        len -= parseInt(x[1]);
      } else if (str.split('.').length === 2) {
        if (parseInt(str.split('.')[1]) !== 0) {
          len = str.split('.')[1].length;
        }
      }
      // eslint-disable-next-line no-useless-catch
    } catch (e) {
      throw e;
    } finally {
      if (isNaN(len) || len < 0) {
        len = 0;
      }
      // eslint-disable-next-line no-unsafe-finally
      return len;
    }
  },
  /**
   * 转为数字类型
   */
  convertToNumber: function (num) {
    num = Number(num);
    let newNum = num;
    const times = this.countDecimals(num);
    const tempNum = num.toString().toUpperCase();
    if (tempNum.split('E').length === 2) {
      newNum = Math.round(num * Math.pow(10, times));
    } else {
      newNum = Number(tempNum.replace('.', ''));
    }
    return newNum;
  },
};
// # sourceMappingURL=accurate-util.js.map
