import _ from 'lodash';
export const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'zh-CN';
export type DATETIME_TYPE = 'long' | 'date' | 'shortDate' | 'shortTime' | 'time';
export type DATETIME_LANG = 'en-US' | 'zh-CN';

/** 常用的正则表达式 */
export const regExps = {
  /** 网址 */
  url: /^(?!mailto:)(?:(?:http|https|ftp):\/\/|\/\/)(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:(\/|\?|#)[^\s]*)?$/i,
  /** 空字符串 */
  'blank-string': /^(?![\s\u3000]+$).+$/,
  /** 邮箱 */
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  /** 手机号 */
  'mobile-number-china': /^1[3456789]\d{9}$/,
  /** 身份证 */
  'id-card-china':
    /[1-9]\d{5}(((1[89]|20)\d{2}(((0[13578]|1[0-2])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((((1[89]|20)(0[48]|[2468][048]|[13579][26]))|((19|20)00))0229))\d{3}(\d|X|x)/,
  /** 身份证15位 */
  'id-card-15-china': /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/,
  /** 纯数字 */
  'pure-number': /^[0-9]+$/,
  /** 中文 */
  'words-chinese': /[\u4e00-\u9fff\u3400-\u4dbf\uF900-\uFAFF]/,
  /** ipv4地址 */
  'ipv4-address': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  /** ipv6地址 */
  'ipv6-address': /^(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}$/,
  /** mac地址 */
  'mac-address': /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
  /** ip地址 */
  'ip-address':
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}$|^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
  /** 域名 */
  'domain-name': /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/,
  /** 日期 */
  'date-format': /^\d{4}-\d{1,2}-\d{1,2}$/,
  /** 时间 */
  'time-format': /^\d{2}:\d{2}:\d{2}$/,
  /** 日期时间 */
  'date-time-format': /^\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{2}:\d{2}$/,
};

export default {
  /** 判断是否是手机号码 */
  isMobileNumber(mobileNumber: string, locale: string = DEFAULT_LOCALE): boolean {
    if (locale === 'zh-CN') {
      return regExps['mobile-number-china'].test(mobileNumber);
    } else {
      /** 其他的暂不支持 */
      return false;
    }
  },

  /** 是否是纯数字 */
  isPureNumber(str: string): boolean {
    return /^\d{1,}$/.test(str);
  },

  /**
   * 是否是邮箱格式
   *
   * - 参考：http://emailregex.com/
   */
  isEmail(str: string): boolean {
    return regExps.email.test(str);
  },

  /** 是否是中国大陆的身份证 */
  isChinaIDCard(str: string, type: 15 | 18 = 18): boolean {
    if (type === 15 && str.length === 15) {
      return regExps['id-card-15-china'].test(str);
    }

    if (type === 18 && str.length === 18) {
      return regExps['id-card-china'].test(str);
    }

    return false;
  },

  /** 是否包含中文 */
  isContainChinese(str: string): boolean {
    return regExps['words-chinese'].test(str);
  },

  /** 是否是链接 */
  isUrl(str: string): boolean {
    return regExps.url.test(str);
  },

  /** 转为中横线命名 */
  toHyphenName(value: string): string {
    if (value) {
      return value
        .trim()
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
    }

    return '';
  },

  /** 转为中横线命名 */
  toHumpName(value: string): string {
    if (value) {
      return value.replace(/-(\w)/g, (_all, letter) => {
        return letter.toUpperCase();
      });
    }

    return '';
  },

  /** 将对象类型的css样式转化为字符串 */
  cssStyleObjectToString(style: Record<string, string>): string {
    const styles: string[] = [];

    _.keys(style).forEach((key) => {
      styles.push([this.toHyphenName(key), style[key]].join(': '));
    });

    return styles.join('; ');
  },
};
