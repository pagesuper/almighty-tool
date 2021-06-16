import dateUtil from './date-util';

export const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'zh-CN';
export type DATETIME_TYPE = 'long' | 'date' | 'shortDate' | 'shortTime' | 'time';
export type DATETIME_LANG = 'en-US' | 'zh-CN';

/** URL正则 */
export const URL_REG_EXP = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i',
);

/** 邮箱正则 */
export const EMAIL_REG_EXP = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/** 国内身份证15位正则 */
export const CN_ID_CARD_REG_EXP15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;

/** 国内身份证18位正则 */
export const CN_ID_CARD_REG_EXP18 = /[1-9]\d{5}(((1[89]|20)\d{2}(((0[13578]|1[0-2])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((((1[89]|20)(0[48]|[2468][048]|[13579][26]))|((19|20)00))0229))\d{3}(\d|X|x)/;

/** 国内手机号码正则 */
export const CN_MOBILE_PHONE_REG_EXP = /^1[3456789]\d{9}$/;

export default {
  /** 正则表达式清单 */
  regExps: {
    /** 链接 */
    url: URL_REG_EXP,
    /** 邮箱 */
    email: EMAIL_REG_EXP,
    /** 身份证15位 */
    cnIdCard15: CN_ID_CARD_REG_EXP15,
    /** 身份证18位 */
    cnIdCard18: CN_ID_CARD_REG_EXP18,
    /** 国内手机号码正则 */
    cnMobilePhone: CN_MOBILE_PHONE_REG_EXP,
  },

  /** 判断是否是手机号码 */
  isMobilePhone(mobileNumber: string, locale: string = DEFAULT_LOCALE): boolean {
    if (locale === 'zh-CN') {
      return CN_MOBILE_PHONE_REG_EXP.test(mobileNumber);
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
    return EMAIL_REG_EXP.test(str);
  },

  /** 是否是中国大陆的身份证 */
  isChinaIDCard(str: string, type: 15 | 18 = 18): boolean {
    if (type === 15 && str.length === 15) {
      return CN_ID_CARD_REG_EXP15.test(str);
    }

    if (type === 18 && str.length === 18) {
      return CN_ID_CARD_REG_EXP18.test(str);
    }

    return false;
  },

  /** 是否是链接 */
  isUrl(str: string): boolean {
    return URL_REG_EXP.test(str);
  },

  /**
   * 格式换时间
   *
   * 中文: lang = 'zh-CN' (默认)
   *
   * @type
   *
   * - long(默认) -> 2020年12月14日 12:23:33
   * - date -> 2020年12月14日
   * - shortDate -> 12月14日
   * - shortTime -> 12:23
   * - time -> 12:23:33
   *
   * 英文: lang = 'en-US'
   *
   * - long(默认) -> 2020-12-14 12:23:33
   * - date -> 2020-12-14
   * - shortDate -> 12-14
   * - shortTime -> 12:23
   * - time -> 12:23:33
   */
  showDatetime: (
    value: Date | string,
    type: DATETIME_TYPE = 'long',
    lang: DATETIME_LANG = 'zh-CN',
  ): string => {
    function pad(number: number): string {
      if (number < 10) {
        return `0${number}`;
      } else {
        return `${number}`;
      }
    }

    if (value) {
      const value2 = dateUtil.parse(value);

      if (value2) {
        const year = value2.getFullYear();
        const month = value2.getMonth() + 1;
        const date = value2.getDate();
        const hour = value2.getHours();
        const minute = value2.getMinutes();
        const second = value2.getSeconds();

        switch (lang) {
          case 'en-US':
            switch (type) {
              case 'date':
                return `${year}-${pad(month)}-${pad(date)}`;
              case 'shortDate':
                return `${pad(month)}-${pad(date)}`;
              case 'shortTime':
                return `${pad(hour)}:${pad(minute)}`;
              case 'time':
                return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
              default:
                return `${year}-${pad(month)}-${pad(date)} ${pad(hour)}:${pad(minute)}:${pad(
                  second,
                )}`;
            }

          default:
            switch (type) {
              case 'date':
                return `${year}年${pad(month)}月${pad(date)}日`;
              case 'shortDate':
                return `${pad(month)}月${pad(date)}日`;
              case 'shortTime':
                return `${pad(hour)}:${pad(minute)}`;
              case 'time':
                return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
              default:
                return `${year}年${pad(month)}月${pad(date)}日 ${pad(hour)}:${pad(minute)}:${pad(
                  second,
                )}`;
            }
        }
      }
    }

    return `${value}`;
  },
};
