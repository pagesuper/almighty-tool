/**
 * 一些精确的计算方法
 */

export default {
  /** 加法 */
  add(arg1: number, arg2: number): number {
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
  sub(arg1: number, arg2: number): number {
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
  mul(arg1: number, arg2: number): number {
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
  div(arg1: number, arg2: number): number {
    let t1 = 0;
    let t2 = 0;

    try {
      t1 = arg1.toString().split('.')[1].length;
    } catch (e) {}
    try {
      t2 = arg2.toString().split('.')[1].length;
    } catch (e) {}

    const t = Math.max(t1, t2);
    const digits = 10 ** t;

    return (arg1 * digits) / (arg2 * digits);
  },

  /**
   * 计算位数
   */
  countDecimals(num: number): number {
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
    } catch (e) {
      throw e;
    } finally {
      if (isNaN(len) || len < 0) {
        len = 0;
      }

      return len;
    }
  },

  /**
   * 转为数字类型
   */
  convertToNumber(num: number): number {
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
