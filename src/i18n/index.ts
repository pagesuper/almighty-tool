import deepmerge from 'deepmerge';
import _ from 'lodash';
import mustache from 'mustache';
import enUSMessages from './en-US/index';
import zhCNMessages from './zh-CN/index';

const messages = {
  'en-US': enUSMessages,
  'zh-CN': zhCNMessages,
};

export type TranslateOptions = {
  lang?: string;
  locale?: string;
  fallbackLang?: string;
  fallbackLocale?: string;
  args?:
    | (
        | {
            [k: string]: any;
          }
        | string
      )[]
    | {
        [k: string]: any;
      };
  defaultValue?: string;
  debug?: boolean;
};

export interface I18nConfig {
  i18n: I18n;
  defaultLang: string;
}

export const defaultLang = 'zh-CN';

export interface I18nOptions {
  lang?: string;
  locale?: string;
  fallbackLang?: string;
  fallbackLocale?: string;
  messages?: Record<string, any>;
}

export class I18n {
  public lang: string;
  public fallbackLang: string;
  public messages: Record<string, any>;

  constructor(options: I18nOptions) {
    this.lang = options.lang ?? options.locale ?? defaultLang;
    this.fallbackLang = options.fallbackLang ?? options.fallbackLocale ?? defaultLang;
    this.messages = options.messages ?? messages;
  }

  setMessages(messages: Record<string, any>) {
    this.messages = messages;
  }

  mergeMessages(messages: Record<string, any>) {
    this.messages = deepmerge(this.messages, messages);
  }

  setLang(lang: string) {
    this.lang = lang;
  }

  setFallbackLang(lang: string) {
    this.fallbackLang = lang;
  }

  t(key: string, options?: TranslateOptions) {
    const lang = options?.lang ?? options?.locale ?? this.lang;
    const fallbackLang = options?.fallbackLang ?? options?.fallbackLocale ?? this.fallbackLang;
    const path = key.split('.');
    const template = _.get(this.messages, [lang, ...path]) ?? _.get(this.messages, [fallbackLang, ...path]);

    if (template && typeof template === 'string') {
      return mustache.render(template, options?.args ?? {}, {}, { tags: ['{', '}'] });
    }

    return key;
  }
}

export const i18nConfig: I18nConfig = {
  i18n: new I18n({
    lang: defaultLang,
    fallbackLang: defaultLang,
    messages,
  }),
  defaultLang,
};

export default messages;
