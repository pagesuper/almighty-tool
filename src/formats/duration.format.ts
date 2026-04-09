import _get from 'lodash-es/get';
import en from '../i18n/en-US/index';
import zhCN from '../i18n/zh-CN/index';
import general from '../common/general';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type I18nValues = any[] | { [key: string]: any };

const DEFAULT_I18N_KEY = 'almighty-tool/formats/duration-format#i18n';

const i18n = {
  t: (key: string, _values?: I18nValues, locale?: string): string => {
    switch (locale?.toLowerCase()) {
      case 'en':
        return _get(en, key);

      case 'zh-cn':
      default:
        return _get(zhCN, key);
    }
  },
};

export interface IDurationFormatI18n {
  t: (key: string, values?: I18nValues) => string;
}

export type DURATION_FORMAT_FORMATTER = 'default' | 'short';

export interface IDurationFormatOptions {
  /** 格式化 */
  formatter?: DURATION_FORMAT_FORMATTER;
  /** 语言 */
  locale?: string;
}

/** 时长格式化工具 */
const durationFormat = {
  /**
   * 对秒数进行格式化
   *
   * - seconds 秒数
   * - options 格式化选项
   */
  format: (seconds: number, options: IDurationFormatOptions = {}): string => {
    if (seconds < 0) {
      return '';
    }

    try {
      const _i18n = general.getDefault<IDurationFormatI18n | null>(DEFAULT_I18N_KEY) || i18n;
      const locale = (options.locale ?? _i18n.t('AlmightyTool.DurationFormat.locale').toString()).toLowerCase();
      const formatter = options.formatter ?? 'default';
      const i18nPrefix = `AlmightyTool.DurationFormat.${formatter}`;

      const years = Math.floor(seconds / (365 * 24 * 60 * 60));
      const days = Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const remainingSeconds = Math.floor(seconds % 60);

      const parts: string[] = [];

      if (years > 0) {
        parts.push(`${years}${_i18n.t(`${i18nPrefix}.year`, undefined, locale)}`);
      }

      if (days > 0 || (years > 0 && days === 0)) {
        parts.push(`${days}${_i18n.t(`${i18nPrefix}.day`, undefined, locale)}`);
      }

      if (hours > 0 || (parts.length > 0 && hours === 0)) {
        parts.push(`${hours}${_i18n.t(`${i18nPrefix}.hour`, undefined, locale)}`);
      }

      if (minutes > 0 || (parts.length > 0 && minutes === 0)) {
        parts.push(`${minutes}${_i18n.t(`${i18nPrefix}.minute`, undefined, locale)}`);
      }

      parts.push(`${remainingSeconds}${_i18n.t(`${i18nPrefix}.second`, undefined, locale)}`);

      return parts.join('');
    } catch (error) {
      return '';
    }
  },

  /** 设置默认的i18n对象 */
  setDefaultI18n: (i18n: IDurationFormatI18n | null): void => {
    general.setDefault(DEFAULT_I18N_KEY, i18n);
  },
};

export default durationFormat;