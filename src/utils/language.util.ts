// import { franc, Options } from 'franc-all';
import { franc, Options } from 'franc';
import _get from 'lodash-es/get';

export interface GetKeyByTypeOptions extends Options {
  /**
   * - CebabCase: zh-CN (默认)
   * - SnakeCase: zh_CN
   * - Code: cmn
   */
  style?: 'SnakeCase' | 'CebabCase' | 'Code';
  /** 默认语言标识: 默认 zh-CN */
  default?: string;
}

// 定义语言代码到区域标识的映射配置对象
const languageLocaleMap = {
  // 亚洲语言
  cmn: 'zh-CN',
  jpn: 'ja-JP',
  kor: 'ko-KR',
  hin: 'hi-IN',
  tha: 'th-TH',
  vie: 'vi-VN',
  ind: 'id-ID',
  fil: 'tl-PH',

  // 欧洲语言
  eng: 'en-US',
  spa: 'es-ES',
  fra: 'fr-FR',
  deu: 'de-DE',
  ita: 'it-IT',
  rus: 'ru-RU',
  por: 'pt-BR',
  nld: 'nl-NL',
  pol: 'pl-PL',
  ukr: 'uk-UA',
  ces: 'cs-CZ',
  swe: 'sv-SE',
  dan: 'da-DK',
  fin: 'fi-FI',
  nor: 'no-NO',
  ell: 'el-GR',
  hun: 'hu-HU',
  ron: 'ro-RO',
  bul: 'bg-BG',

  // 中东和非洲语言
  arb: 'ar-SA',
  heb: 'he-IL',
  tur: 'tr-TR',
  fas: 'fa-IR',
  swh: 'sw-KE',
  af: 'af-ZA',
  zu: 'zu-ZA',

  // 南亚语言
  ben: 'bn-BD',
  tam: 'ta-IN',
  tel: 'te-IN',
  mar: 'mr-IN',
  guj: 'gu-IN',
  kan: 'kn-IN',
  mal: 'ml-IN',
  pan: 'pa-IN',
  urd: 'ur-PK',

  // 其他重要语言
  cat: 'ca-ES',
  eus: 'eu-ES',
  glg: 'gl-ES',
  hrv: 'hr-HR',
  srp: 'sr-RS',
  slk: 'sk-SK',
  slv: 'sl-SI',
  lit: 'lt-LT',
  lav: 'lv-LV',
  est: 'et-EE',
  isl: 'is-IS',
};

const languageCodeMap = Object.entries(languageLocaleMap).reduce((acc, [key, value]) => {
  Reflect.set(acc, value, key);
  return acc;
}, {});

const languageUtil = {
  /** 通过文本获取语言标识 */
  getKeyByText(text?: string, options?: GetKeyByTypeOptions) {
    let only: string[] | undefined;

    if (options?.only) {
      only = [];

      for (const item of options.only) {
        const code = Reflect.get(languageCodeMap, item);

        if (code) {
          only.push(code);
        } else if (Reflect.get(languageLocaleMap, item)) {
          only.push(item);
        }
      }
    }

    const code = franc(text, { ...options, only });
    const style = options?.style || 'CebabCase';

    if (style === 'Code') {
      return code;
    }

    // 使用配置对象进行判断
    const cebabCaseKey = _get(languageLocaleMap, code, options?.default ?? 'zh-CN');

    if (style === 'SnakeCase') {
      return cebabCaseKey.replace(/-/g, '_');
    }

    return cebabCaseKey;
  },
};

export default languageUtil;
