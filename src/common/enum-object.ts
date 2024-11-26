import _ from 'lodash';

export type TranslateOptions = {
  lang?: string;
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

export interface I18n {
  t: (key: string, options?: TranslateOptions) => string;
}

export interface IEnumObjectTranslate {
  [key: string]: string;
}

export interface IEnumObject<T> {
  source: T;
  name: string;
  i18n: I18n | (() => I18n);
  langs?: string[];
}

export interface IEnumObjectOptions {
  key: string;
  value: string | number;
  translate: IEnumObjectTranslate;
}

export class EnumObject<T extends Record<string, string | number>> {
  constructor(options: IEnumObject<T>) {
    this.source = options.source;
    this.name = options.name;
    this.langs = options.langs ?? this.langs;
    this.i18n = options.i18n;

    Object.entries(options.source).forEach(([key, value]) => {
      this.valueMap.set(key, value);
      this.keyMap.set(value, key);
    });
  }

  public i18n: I18n | (() => I18n);
  /** 键到值的映射(键为枚举的键, 值为枚举的值) */
  public valueMap: Map<string, string | number> = new Map();
  /** 值到键的映射(键为枚举的值, 值为枚举的键) */
  public keyMap: Map<string | number, string> = new Map();

  public source: T;
  public name: string;

  private langs: string[] = ['zh-CN', 'en'];
  private translateOptionsMap: Map<string, IEnumObjectOptions> | null = null;
  private options: IEnumObjectOptions[] | null = null;
  private translate: IEnumObjectTranslate | null = null;

  public getI18n() {
    return typeof this.i18n === 'function' ? this.i18n() : this.i18n;
  }

  /**
   * 获取指定语言的选项
   * @param lang - 语言
   * @returns 指定语言的选项
   */
  public getDialectOptions(lang: string) {
    return this.getOptions().map((option) => {
      return {
        key: option.key,
        value: option.value,
        dialect: option.translate[lang],
      };
    });
  }

  public getTranslateOptionsMap() {
    if (this.translateOptionsMap) {
      return this.translateOptionsMap;
    }

    const map = new Map();

    Object.entries(this.source).forEach(([key, value]) => {
      if (isNaN(Number(key))) {
        map.set(key, {
          key,
          value,
          translate: _.reduce(
            this.langs,
            (acc, lang) => {
              Reflect.set(acc, lang, this.getI18n().t(`enum.types.${this.name}.options.${key}`, { lang }));
              return acc;
            },
            {},
          ),
        });
      }
    });

    this.translateOptionsMap = map;
    return this.translateOptionsMap;
  }

  public getTranslateOptionWithKey(key: string) {
    return this.getTranslateOptionsMap().get(key) ?? null;
  }

  public getTranslateOptionWithValue(value: string | number) {
    const key = this.keyMap.get(value);

    if (key) {
      return this.getTranslateOptionWithKey(key) ?? null;
    }

    return null;
  }

  /**
   * 获取指定语言的名称
   * @param lang - 语言
   * @returns 指定语言的名称
   */
  public getDialectName(lang: string) {
    return this.getTranslate()[lang];
  }

  public getOptions() {
    if (this.options) {
      return this.options;
    }

    const options: IEnumObjectOptions[] = [];
    const translateOptionsMap = this.getTranslateOptionsMap();

    Object.entries(this.source).forEach(([key]) => {
      if (isNaN(Number(key))) {
        options.push(translateOptionsMap.get(key) as IEnumObjectOptions);
      }
    });

    this.options = options;

    return this.options;
  }

  public getTranslate() {
    if (this.translate) {
      return this.translate;
    }

    this.translate = _.reduce(
      this.langs,
      (acc, lang) => {
        Reflect.set(acc, lang, this.getI18n().t(`enum.types.${this.name}.name`, { lang }));
        return acc;
      },
      {},
    );

    return this.translate;
  }
}
