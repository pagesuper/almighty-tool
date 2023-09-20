// flow
import capitalize from 'lodash/capitalize';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import debug from 'debug';
import general from '../common/general';

const log = debug('locale-id');

interface IReturnValue {
  keyword?: string;
  language: string;
  variant?: string;
  country?: string;
  script?: string;
}

const DEFAULT_LOCALE_MEMORY_KEY = 'tuitui-lib/locale.util#default-locale';
const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE ?? 'zh-cn';

export function setDefaultLocale(key: string) {
  return general.setDefault(DEFAULT_LOCALE_MEMORY_KEY, key);
}

export function getDefaultLocale() {
  return general.getDefault<string>(DEFAULT_LOCALE_MEMORY_KEY) ?? DEFAULT_LOCALE;
}

// http://userguide.icu-project.org/locale
export default function parse(locale?: string) {
  if (!locale) {
    return undefined;
  }

  // extract keyword
  const stringLocale = String(locale);
  const keywordPos = stringLocale.indexOf('@');

  const keyword = keywordPos !== -1 ? stringLocale.substr(keywordPos + 1) : undefined;

  const localeWithoutKeyword = keywordPos !== -1 ? stringLocale.substr(0, keywordPos) : stringLocale;

  // en-us => en_us
  const parts = String(localeWithoutKeyword).replace(/-/g, '_').split('_');

  if (!parts.length || parts.length > 4) {
    return undefined;
  }

  const language = parts.shift();
  if (!language) {
    return undefined;
  }

  const retVar: IReturnValue = {
    keyword,
    language: language.toLowerCase(),
  };

  if (!parts.length) {
    return retVar;
  }

  if (parts.length === 3) {
    const variant = parts.pop();
    if (variant) {
      retVar.variant = variant.toUpperCase();
    }
  }

  let country = parts.pop();

  if (country && country.length > 3) {
    retVar.keyword = country;

    country = parts.pop();
  }

  if (country) {
    retVar.country = country.toUpperCase();
  }

  if (!parts.length) {
    return retVar;
  }

  const script = parts.pop();

  if (script) {
    retVar.script = capitalize(script.toLowerCase());
  }

  return retVar;
}

export function getLanguage(locale: string) {
  const obj = parse(locale);
  return obj && obj.language;
}

export function getCountry(locale: string) {
  const obj = parse(locale);
  return obj && obj.country;
}

export function getScript(locale: string) {
  const obj = parse(locale);
  return obj && obj.script;
}

export function getVariant(locale: string) {
  const obj = parse(locale);
  return obj && obj.variant;
}

export function getKeyword(locale: string) {
  const obj = parse(locale);
  return obj && obj.keyword;
}

export function normalize(locale: string, delimeter = '_') {
  const obj = parse(locale);
  if (!obj) {
    return obj;
  }

  let result = obj.language;

  if (obj.script) {
    result += `${delimeter}${obj.script}`;
  }

  if (obj.country) {
    result += `${delimeter}${obj.country}`;
  }

  return result;
}

const splitAcceptLanguageRegEx = /([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/gi;
const acceptLanguageItemRegEx = /^([a-z]{1,8}(-[a-z]{1,8})?)/i;

export function normalizeAcceptLanguage(acceptLanguage: string) {
  const returnItems: string[] = [];
  if (!acceptLanguage) {
    return returnItems;
  }

  const items = acceptLanguage.match(splitAcceptLanguageRegEx) || [];
  forEach(items, (acceptLanguageItem) => {
    const matches = acceptLanguageItem.match(acceptLanguageItemRegEx) || [];
    const locale = normalize(matches[0] ?? '');
    if (locale) {
      returnItems.push(locale);
    }
  });

  return returnItems;
}

export function prepareSupported(supported: string[] | string) {
  const lgs = {};

  forEach(supported, (supportedLocale) => {
    const parsed = parse(supportedLocale);

    if (parsed) {
      const { language, country } = parsed;

      if (!language) {
        throw new Error(`Locale ${supportedLocale} is not parsable`);
      }

      if (!Reflect.get(lgs, language)) {
        Reflect.set(lgs, language, {
          countries: {},
          firstCountry: undefined,
          main: undefined,
        });
      }

      const lg = Reflect.get(lgs, language);

      if (lg) {
        if (country) {
          lg.countries[country] = supportedLocale;

          if (!lg.firstCountry) {
            lg.firstCountry = supportedLocale;
          }
        } else {
          lg.main = supportedLocale;
        }
      }
    }
  });

  return lgs;
}

export function getBest(
  supported: string[] | string,
  locale: string | null | undefined,
  defaultLocale?: string | null,
  getAnyCountry?: boolean,
): string | null | undefined {
  const lgs = isArray(supported) ? prepareSupported(supported) : supported;

  // return defaultLocale if current locale is undefined
  if (!locale && defaultLocale) {
    return getBest(supported, defaultLocale, undefined, getAnyCountry);
  }

  if (!locale) {
    log(`Locale ${locale} is not supported`);
    return undefined;
  }

  const parsed = parse(locale);

  if (!parsed) {
    return undefined;
  }

  const { language, country } = parsed;

  if (!language) {
    return defaultLocale;
  }

  // selected locale is not supported
  if (!Reflect.get(lgs, language)) {
    log(`Locale ${locale} is not supported`);

    if (locale === defaultLocale) {
      return undefined;
    }

    return getBest(supported, defaultLocale, null, getAnyCountry);
  }

  const { countries, main = defaultLocale, firstCountry } = Reflect.get(lgs, language);

  if (!countries || !country) {
    if (getAnyCountry && firstCountry) {
      return firstCountry;
    }

    return main;
  }

  if (getAnyCountry && firstCountry) {
    return countries[country] ? countries[country] : firstCountry;
  }

  return countries[country] ? countries[country] : main;
}
