import general from './general';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type I18nValues = any[] | { [key: string]: any };

const DEFAULT_I18N_KEY = 'almighty-lib/common/enum-object#i18n';

const i18n = {
  t: (key: string, _values?: I18nValues): string => {
    return `${key}`;
  },
};

export interface IEnumObjectI18n {
  t: (key: string, values?: I18nValues) => string;
}

/** 选项 */
export interface ISelectOption {
  /** 显示文字 */
  label: string;
  /** 关联的Key */
  key: string;
  /** 关联的值 */
  value: string | number;
}

export interface IEnumObjectOptions {
  i18n?: IEnumObjectI18n;
  source: Object;
  sourceName: string;
}

export class EnumObject<T> {
  /** 国际化工具 */
  private __i18n!: IEnumObjectI18n | null;
  /** 源 */
  private __source: Record<string, string | number> = {};
  /** 反向源 */
  private __reverseSource: Record<string, string> = {};
  /** 源名称 */
  public sourceName!: string;
  public source!: T;

  /** 选择的项目 */
  getSelectOptions(): ISelectOption[] {
    const options: ISelectOption[] = [];

    Object.entries(this.__source).forEach(([key, value]) => {
      options.push({
        label: this.getText(key),
        key,
        value,
      });
    });

    return options;
  }

  /** 根据key获取对应的翻译 */
  getText(key: string): string {
    return this.i18n.t(`enum.${this.sourceName}.${key}`);
  }

  /** 根据value获取对应的翻译 */
  getValueText(value: string | number): string {
    return this.i18n.t(`enum.${this.sourceName}.${this.getKey(value)}`);
  }

  /** 根据key获取对应的值 */
  getValue(key: string): string | number | undefined {
    return Reflect.get(this.__source, key);
  }

  /** 根据value获取对应的key */
  getKey(value: string | number): string | undefined {
    return Reflect.get(this.__reverseSource, `${value}`);
  }

  toJSON(): object {
    return Object.assign({}, this, {});
  }

  get i18n(): IEnumObjectI18n {
    return this.__i18n || general.getDefault(DEFAULT_I18N_KEY) || i18n;
  }

  constructor(options: IEnumObjectOptions) {
    if (options.i18n) {
      this.__i18n = options.i18n;
    }

    this.sourceName = options.sourceName;
    this.source = options.source as T;

    Object.entries(options.source).forEach(([key, value]) => {
      /** 如果是纯数字，则判断对应key的值是否一致 */
      if (!/^[0-9]*$/.test(key) || `${Reflect.get(options.source, value)}` !== key) {
        Reflect.set(this.__source, key, value);
        Reflect.set(this.__reverseSource, value, key);
      }
    });
  }

  /** 设置默认的i18n对象 */
  setI18n(i18n: IEnumObjectI18n | null): void {
    this.__i18n = i18n;
  }

  /** 设置默认的i18n对象 */
  static setDefaultI18n(i18n: IEnumObjectI18n | null): void {
    general.setDefault(DEFAULT_I18N_KEY, i18n);
  }
}
