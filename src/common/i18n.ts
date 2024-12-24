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

export interface I18nConfig {
  i18n: I18n;
}

const defaultI18n: I18n = {
  t: (key: string, _options?: TranslateOptions) => key,
};

export const i18nConfig: I18nConfig = {
  i18n: defaultI18n,
};