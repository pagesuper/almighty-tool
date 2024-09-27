import dayjs from 'dayjs';
import 'dayjs/locale/en';
import '../dayjs/locales/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import _ from 'lodash';
import zhCN from '../locales/zh-cn';
import general from '../common/general';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type I18nValues = any[] | { [key: string]: any };

const DEFAULT_I18N_KEY = 'almighty-tool/formats/date-format#i18n';

const i18n = {
  t: (key: string, _values?: I18nValues): string => {
    return _.get(zhCN, key);
  },
};

export interface IDateFormatI18n {
  t: (key: string, values?: I18nValues) => string;
}

export type DATE_FORMAT_FORMATTER =
  | 'default'
  | 'full'
  | 'long'
  | 'short'
  | 'date'
  | 'time'
  | 'shortTime'
  | 'step'
  | 'shortStep'
  | 'fromNow'
  | 'toNow';

export interface IDateFormatOptions {
  /** 格式模板 */
  template?: string;
  /** 格式化 */
  formatter?: DATE_FORMAT_FORMATTER;
  /** 语言 */
  locale?: string;
}

/** 日期格式化工具 */
const dateFormat = {
  /**
   * 对日期对象进行格式化
   *
   * - date 日期对象或者日期字符串
   * - options 格式化选项
   */
  format: (date: Date | string | null, options: IDateFormatOptions = {}): string => {
    if (date) {
      const _i18n = general.getDefault<IDateFormatI18n | null>(DEFAULT_I18N_KEY) || i18n;
      const locale = options.locale ?? _i18n.t('AlmightyTool.DateFormat.locale').toString();
      const template = options.template ?? dateFormat.getFormatTemplate(options.formatter);
      const day = dayjs(date);
      const now = dayjs();
      const localeDay = day.locale(locale);
      const i18nPrefix = `AlmightyTool.DateFormat.${options.formatter}`;

      switch (options.formatter) {
        case 'step':
        case 'shortStep':
          if (now.startOf('day').diff(day) <= 0 && now.add(1, 'day').startOf('day').diff(day) > 0) {
            /** 今天 */
            return localeDay.format(_i18n.t(`${i18nPrefix}.today`).toString());
          } else if (now.add(1, 'day').startOf('day').diff(day) <= 0 && now.add(2, 'day').startOf('day').diff(day) > 0) {
            /** 明天 */
            return localeDay.format(_i18n.t(`i18nPrefix.tomorrow`).toString());
          } else if (now.subtract(1, 'day').startOf('day').diff(day) <= 0 && now.startOf('day').diff(day) > 0) {
            /** 昨天 */
            return localeDay.format(_i18n.t(`i18nPrefix.yesterday`).toString());
          } else if (now.startOf('year').diff(day) <= 0 && now.add(1, 'year').startOf('year').diff(day) > 0) {
            /** 今年 */
            return localeDay.format(_i18n.t(`i18nPrefix.thisYear`).toString());
          }

          return localeDay.format(_i18n.t(`i18nPrefix.longAgo`).toString());

        case 'fromNow':
          dayjs.extend(relativeTime);
          return localeDay.fromNow();

        case 'toNow':
          dayjs.extend(relativeTime);
          return localeDay.toNow();

        default:
          return localeDay.format(template);
      }
    }

    return '';
  },

  /** 获取格式化模板 */
  getFormatTemplate(formatter: DATE_FORMAT_FORMATTER = 'default'): string {
    const _i18n = general.getDefault<IDateFormatI18n | null>(DEFAULT_I18N_KEY) || i18n;
    return _i18n.t(`AlmightyTool.DateFormat.formats.${formatter}`);
  },

  /** 设置默认的i18n对象 */
  setDefaultI18n: (i18n: IDateFormatI18n | null): void => {
    general.setDefault(DEFAULT_I18N_KEY, i18n);
  },
};

export default dateFormat;
