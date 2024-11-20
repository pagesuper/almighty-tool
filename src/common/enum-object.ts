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
  i18n: I18n;
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

  public i18n: I18n;
  /** 键到值的映射(键为枚举的键, 值为枚举的值) */
  public valueMap: Map<string, string | number> = new Map();
  /** 值到键的映射(键为枚举的值, 值为枚举的键) */
  public keyMap: Map<string | number, string> = new Map();

  public source: T;
  public name: string;

  private langs: string[] = ['zh-CN', 'en'];
  private options: IEnumObjectOptions[] | null = null;
  private translate: IEnumObjectTranslate | null = null;

  public getOptions() {
    if (this.options) {
      return this.options;
    }

    const options: IEnumObjectOptions[] = [];

    Object.entries(this.source).forEach(([key, value]) => {
      if (isNaN(Number(key))) {
        options.push({
          key,
          value,
          translate: _.reduce(
            this.langs,
            (acc, lang) => {
              Reflect.set(acc, lang, this.i18n.t(`enum.types.${this.name}.options.${key}`, { lang }));
              return acc;
            },
            {},
          ),
        });
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
        Reflect.set(acc, lang, this.i18n.t(`enum.types.${this.name}.name`, { lang }));
        return acc;
      },
      {},
    );

    return this.translate;
  }
}
