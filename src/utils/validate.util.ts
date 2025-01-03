import ValidateSchema, {
  ValidateError as OriginalValidateError,
  ValidateOption as OriginalValidateOption,
  RuleItem as OriginalValidateRuleItem,
  ValidateCallback,
  ExecuteRule as ValidateExecuteRule,
  ExecuteValidator as ValidateExecuteValidator,
  ValidateFieldsError,
  InternalRuleItem as ValidateInternalRuleItem,
  InternalValidateMessages as ValidateInternalValidateMessages,
  ValidateMessages,
  ValidateResult,
  RuleType as ValidateRuleType,
  RuleValuePackage as ValidateRuleValuePackage,
  Value as ValidateValue,
  Values as ValidateValues,
} from 'async-validator';
import deepmerge from 'deepmerge';
import inflection from 'inflection';
import _ from 'lodash';
import { I18n, i18nConfig } from '../i18n/index';
import { regExps } from './format.util';

export type ValidateTrigger = 'blur' | 'change' | Array<'change' | 'blur'>;
export type ValidateTransform = (value: ValidateValue) => ValidateValue;
export type ValidateTransformer =
  | 'toDate' // string, number -> date
  | 'toBoolean' // string, number, boolean -> boolean
  | 'trim'
  | 'trimLeft'
  | 'trimRight'
  | 'trimStart'
  | 'trimEnd'
  | 'toLower'
  | 'toUpper'
  | 'toNumber'
  | 'firstLetterUpper'
  | 'firstLetterLower'
  | 'capitalize'
  | 'camelize'
  | 'dasherize'
  | 'underscore'
  | 'pluralize'
  | 'singularize'
  | 'humanize';

export interface GetRulesOptions {
  /**
   * 方向:
   * - prefix: 前缀
   * - suffix: 后缀(默认)
   */
  direction?: 'prefix' | 'suffix';
}

export interface ValidateOption extends OriginalValidateOption {
  /** 模型 */
  model?: string;
  /** 规则 */
  rules?: ValidateOptionRules;
  /** 国际化 */
  i18n?: I18n;
  /**
   * 语言
   * - zh-CN
   * - en-US
   */
  lang?: string;
  /** 忽略的字段 */
  omitKeys?: string[];
  /** 选择字段 */
  pickKeys?: string[];
}

export interface WrapRulesOptions extends ValidateOption {
  /** 覆盖规则: 默认为false */
  override?: boolean;
  /** 方向:
   * - prefix: 前缀
   * - suffix: 后缀(默认)
   */
  direction?: 'prefix' | 'suffix';
}

export interface OmitRulesOptions {
  /** 要省略的字段 */
  fieldKeys: string[];
  /** 覆盖规则: 默认为false */
  override?: boolean;
}

export interface ValidateRuleItemRequiredFnOptions {
  item: ValidateRuleItem;
}

export interface ValidateRuleItem extends Omit<OriginalValidateRuleItem, 'fields'> {
  /** 路径 */
  path?: string;
  /** 子规则 */
  fields?: ValidateRules;
  /** 消息数据 */
  data?: ErrorDataJSON;
  /** 默认字段 */
  defaultField?: ValidateRule;
  /** 触发时机 */
  trigger?: ValidateTrigger;
}

export type ValidateRule = ValidateRuleItem | ValidateRuleItem[];
export type ValidateRules = Record<string, ValidateRule>;

export interface ValidateOptionRule extends Omit<ValidateRuleItem, 'fields'> {
  /** 子规则 */
  fields?: Record<string, ValidateOptionRule | ValidateOptionRule[]>;
  /** 正则表达式的key */
  regexpKey?: string;
  /** 相反 */
  regexpReversed?: boolean;
  /**
   * 转换器
   *
   * - toDate 转为日期对象
   * - toBoolean 转为布尔值
   * - trim 去除首尾空格
   * - trimLeft 去除首空格
   * - trimRight 去除尾空格
   * - trimStart 去除首空格
   * - trimEnd 去除尾空格
   * - toLower 转为小写
   * - toUpper 转为大写
   * - toNumber 转为数字
   * - firstLetterUpper 首字母大写
   * - firstLetterLower 首字母小写
   * - capitalize 首字母大写
   * - camelize 驼峰命名
   * - dasherize 短横线命名
   * - underscore 下划线命名
   * - pluralize 复数
   * - singularize 单数
   * - humanize 人类化
   */
  transformers?: ValidateTransformer[];
  /** 触发时机 */
  trigger?: ValidateTrigger;
}

export interface GetLocaleRulesOptions {
  /** 国际化 */
  i18n?: I18n;
  /** 语言 */
  lang?: string;
}

export type ValidateOptionRules = Record<string, ValidateOptionRule | ValidateOptionRule[]>;

export interface GetErrorsOptions extends GetLocaleRulesOptions {
  /** 模型 */
  model?: string;
  /** 字段 */
  field?: string;
  /** 字段值 */
  fieldValue?: ValidateValue;
}

export interface ValidateError extends OriginalValidateError {
  /** 模型 */
  model?: string;
  /** 消息数据 */
  data?: ErrorDataJSON;
}

export interface ValidateResponse {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  errors?: ValidateError[];
  /** 数据 */
  values?: ValidateValues;
}

export interface ErrorDataJSON {
  rules: Partial<ValidateOptionRule>;
  message: any;
}

export { ValidateSchema };

export type {
  ValidateCallback,
  ValidateExecuteRule,
  ValidateExecuteValidator,
  ValidateFieldsError,
  ValidateInternalRuleItem,
  ValidateInternalValidateMessages,
  ValidateMessages,
  ValidateResult,
  ValidateRuleType,
  ValidateRuleValuePackage,
  ValidateValue,
  ValidateValues,
};

const SIMPLE_RULE_KEYS = [
  'len',
  'min',
  'max',
  'pattern',
  'regexpKey',
  'regexpReversed',
  'type',
  'required',
  'enum',
  'whitespace',
];

function getErrorDataJSON(messageJSON: ErrorDataJSON) {
  return `json:${JSON.stringify(messageJSON)}`;
}

function isPresent(value: any) {
  return typeof value !== 'undefined' && value !== null;
}

const defaultMessages: ValidateMessages = {
  default: getErrorDataJSON({ rules: {}, message: 'validate.default.field-is-invalid' }),
  required: getErrorDataJSON({ rules: {}, message: 'validate.default.field-is-required' }),
  enum: getErrorDataJSON({ rules: {}, message: 'validate.default.field-must-be-enum' }),
  whitespace: getErrorDataJSON({ rules: {}, message: 'validate.default.cannot-be-empty' }),
  date: {
    format: getErrorDataJSON({ rules: {}, message: 'validate.date.format-is-invalid' }),
    parse: getErrorDataJSON({ rules: {}, message: 'validate.date.could-not-be-parsed' }),
    invalid: getErrorDataJSON({ rules: {}, message: 'validate.date.is-invalid' }),
  },
  types: {
    string: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-string' }),
    method: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-method' }),
    array: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-array' }),
    object: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-object' }),
    number: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-number' }),
    date: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-date' }),
    boolean: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-boolean' }),
    integer: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-integer' }),
    float: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-float' }),
    regexp: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-regexp' }),
    email: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-email' }),
    url: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-url' }),
    hex: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-hex' }),
  },
};

/** 校验工具 */
const validateUtil = {
  /**
   * 获取校验器
   * @param rules 校验规则
   * @returns 校验器
   */
  getSchema: (rules: ValidateOptionRules, options?: ValidateOption) => {
    return new ValidateSchema(
      validateUtil.normalizeRules(validateUtil.getRules(options?.rules ?? {}, validateUtil.getRules(rules, {}))),
    );
  },

  /**
   * 获取错误信息
   * @param error 错误信息
   * @param options 选项
   * @returns 错误信息
   */
  getErrorMessage: (error: unknown, options?: GetErrorsOptions) => {
    const i18n = options?.i18n ?? i18nConfig.i18n;

    if (typeof error === 'object' && error !== null && ('message' in error || 'msg' in error)) {
      return Reflect.get(error, 'message') ?? Reflect.get(error, 'msg');
    }

    if (typeof error === 'string') {
      if (i18n && typeof i18n.t === 'function') {
        const messageJSON = validateUtil.parseErrorDataJSON(error);
        return i18n.t(messageJSON.message, {
          defaultValue: messageJSON.message,
          args: messageJSON.rules,
          lang: options?.lang,
        });
      }

      return error;
    }

    try {
      return JSON.stringify(error);
    } catch (err) {
      return error;
    }
  },

  /**
   * 获取错误信息
   * @param error 错误信息
   * @param options 选项
   * @returns 错误信息
   */
  getErrors: (error: unknown, options?: GetErrorsOptions) => {
    const model = options?.model ?? 'Base';

    if (typeof error === 'object' && error !== null && 'errors' in error) {
      return (Reflect.get(error, 'errors') as ValidateError[]).map((err) => {
        return {
          ..._.pick(err, ['field', 'fieldValue']),
          data: validateUtil.parseErrorDataJSON(err.message),
          message: validateUtil.getErrorMessage(err.message, options),
          model,
        };
      });
    }

    return [
      {
        data: validateUtil.parseErrorDataJSON(error),
        message: validateUtil.getErrorMessage(error, options),
        fieldValue: options?.fieldValue,
        field: options?.field,
        model,
      },
    ] as ValidateError[];
  },

  /**
   * 转换数据
   * @param values 数据
   * @param rules 校验规则
   * @returns 转换后的数据
   */
  transform: (values: ValidateValues, rules?: ValidateOptionRules) => {
    const transforms = validateUtil.collectRulesTransform(rules ?? {}, {});

    function doTransform(values: ValidateValues, parentPath: string) {
      return _.transform(
        values,
        (result: ValidateValues, value: ValidateValue, key: string) => {
          const path = `${parentPath ? `${parentPath}.` : ''}${key}`;
          const transform = transforms[path];

          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              result[key] = value.map((item) => {
                if (transform?.length) {
                  return transform.reduce((value, trans) => {
                    return trans(value);
                  }, item);
                }

                if (typeof item === 'object') {
                  return doTransform(item, path);
                }

                return item;
              });
            } else {
              result[key] = doTransform(value, path);
            }
          } else {
            if (transform?.length) {
              result[key] = transform.reduce((value, trans) => {
                return trans(value);
              }, value);
            } else {
              result[key] = value;
            }
          }

          return result[key];
        },
        {},
      );
    }

    return doTransform(values, '');
  },

  /**
   * 校验数据
   * @param rules 校验规则
   * @param data 数据
   * @returns 校验结果
   */
  validate: async (
    rules: ValidateOptionRules,
    values: ValidateValues,
    options?: ValidateOption,
    callback?: ValidateCallback,
  ): Promise<ValidateResponse> => {
    const model = options?.model ?? 'Base';
    let transformedValues: ValidateValues = values;

    try {
      const usingValues = _.omit(options?.pickKeys ? _.pick(values, options.pickKeys) : values, options?.omitKeys ?? []);
      const schema = validateUtil.getSchema(rules, options);
      transformedValues = validateUtil.transform(usingValues, schema.rules);
      await schema.validate(usingValues, deepmerge({ messages: defaultMessages }, options ?? {}), callback);

      return {
        success: true,
        values: transformedValues,
      };
    } catch (error) {
      return {
        success: false,
        values: transformedValues,
        errors: validateUtil.getErrors(error, { model, i18n: options?.i18n ?? i18nConfig.i18n, lang: options?.lang }),
      };
    }
  },

  /**
   * 递归获取国际化规则
   * @param rules 校验规则
   * @param options 选项
   * @returns 校验规则
   */
  recursiveGetLocaleRules: (rules: ValidateRules, options: GetLocaleRulesOptions = {}) => {
    const i18n = options?.i18n ?? i18nConfig.i18n;
    const lang = options?.lang ?? i18nConfig.defaultLang;

    Object.keys(rules).forEach((fieldKey) => {
      const fieldRules = rules[fieldKey];

      (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach((rule) => {
        if (i18n && typeof i18n.t === 'function' && typeof rule.message === 'string') {
          const messageJSON = validateUtil.parseErrorDataJSON(rule.message);
          rule.data = messageJSON;
          rule.message = i18n.t(messageJSON.message, {
            defaultValue: messageJSON.message,
            args: messageJSON.rules,
            lang,
          });
        }

        if (rule.fields) {
          validateUtil.recursiveGetLocaleRules(rule.fields, { i18n, lang });
        }
      });
    });

    return rules;
  },

  /**
   * 获取国际化规则
   * @param rules 校验规则
   * @param options 选项
   * @returns 校验规则
   */
  getLocaleRules: (rules: ValidateRules, options: GetLocaleRulesOptions = {}) => {
    const i18n = options?.i18n ?? i18nConfig.i18n;
    const lang = options?.lang ?? i18nConfig.defaultLang;
    return validateUtil.recursiveGetLocaleRules(_.cloneDeep(validateUtil.getRules(rules)), { i18n, lang });
  },

  /**
   * 获取校验规则
   * @param rules 校验规则
   * @param initialRules 初始校验规则
   * @param options 选项
   * @returns 校验规则
   */
  getRules: (rules: ValidateOptionRules, initialRules: ValidateRules = {}, options?: GetRulesOptions): ValidateRules => {
    const mergedRules = _.reduce(
      rules,
      (result, rule, fieldKey) => {
        const loadedRules: ValidateRuleItem[] = [];

        (Array.isArray(rule) ? rule : [rule]).forEach((option) => {
          loadedRules.push(...validateUtil.parseToRules({ path: fieldKey, ...option }));
        });

        const previousRules = Reflect.get(result, fieldKey) ?? [];
        const storedRules = Array.isArray(previousRules) ? previousRules : [previousRules];

        switch (options?.direction ?? 'suffix') {
          case 'prefix':
            storedRules.unshift(...loadedRules);
            break;
          case 'suffix':
          default:
            storedRules.push(...loadedRules);
            break;
        }

        Reflect.set(result, fieldKey, storedRules);
        return result;
      },
      _.isEmpty(initialRules) ? {} : validateUtil.getRules(initialRules, {}),
    );

    return mergedRules;
  },

  /**
   * 解析校验规则
   * @param opts 校验规则
   * @returns 校验规则
   */
  parseToRules: (opts: ValidateOptionRule): ValidateRuleItem[] => {
    const rules: ValidateRuleItem[] = [];
    const options = _.cloneDeep(opts);

    if (options.message) {
      rules.push(validateUtil.getRule(options));
      delete options.message;
    } else {
      if (isPresent(options.regexpKey)) {
        rules.push(validateUtil.getRule({ ...options }));
        delete options.regexpKey;
      }

      if (isPresent(options.enum)) {
        rules.push(validateUtil.getRule({ ...options }));
        delete options.enum;
      }

      if (isPresent(options.len)) {
        rules.push(validateUtil.getRule({ ...options }));
        delete options.len;
      }

      if (isPresent(options.min) && isPresent(options.max)) {
        rules.push(validateUtil.getRule({ ...options }));
        delete options.min;
        delete options.max;
      }

      if (isPresent(options.min)) {
        rules.push(validateUtil.getRule({ ...options }));
        delete options.min;
      }

      if (isPresent(options.max)) {
        rules.push(validateUtil.getRule({ ...options }));
        delete options.max;
      }

      if (isPresent(options.pattern)) {
        rules.push(validateUtil.getRule({ ...options }));
        delete options.pattern;
      }

      if (isPresent(options.whitespace)) {
        rules.push(validateUtil.getRule({ ...options }));
        delete options.whitespace;
      }

      if (isPresent(options.required)) {
        rules.unshift(validateUtil.getRule({ ...options }));
        delete options.required;
      }

      if (!_.isEmpty(_.omit(options, ['path', 'data', 'type']))) {
        rules.push(validateUtil.getRule(options));
      }
    }

    return rules;
  },

  /**
   * 获取规则
   * @param options 校验规则
   * @returns 校验规则
   */
  getRule(options: ValidateOptionRule): ValidateRuleItem {
    const path = options?.path ?? '';
    const regexpKey = options?.regexpKey;
    const regexp = options?.pattern ?? (regexpKey ? Reflect.get(regExps, regexpKey) : undefined);
    const type = options?.type ?? (options.fields ? 'object' : 'string');
    const regexpReversed = options?.regexpReversed ?? false;

    const message = (() => {
      const pickedRules = _.pick(options, SIMPLE_RULE_KEYS);

      if (pickedRules.pattern) {
        pickedRules.pattern = pickedRules.pattern.toString();
      }

      if (options.message) {
        if (typeof options.message === 'function') {
          return options.message();
        }

        return options.message;
      }

      if (regexpKey) {
        return validateUtil.getErrorDataJSON({
          rules: pickedRules,
          message: `validate.regexp-key.${options.regexpReversed ? 'invalid-reversed' : 'invalid'}:${
            options.regexpKey ?? 'format'
          }`,
        });
      }

      if (options.enum) {
        return validateUtil.getErrorDataJSON({
          rules: pickedRules,
          message: `validate.default.field-must-be-enum`,
        });
      }

      switch (type) {
        case 'string':
          // len 存在时，表示固定长度
          // min 和 max 同时存在时，表示长度范围
          // min 存在时，表示最小长度
          // max 存在时，表示最大长度
          // pattern 存在时，表示正则表达式
          if (isPresent(options.len)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.string.must-be-exactly-characters',
            });
          }

          if (isPresent(options.min) && isPresent(options.max)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.string.must-be-between-the-range-of-characters',
            });
          }

          if (isPresent(options.min)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.string.must-be-at-least-characters',
            });
          }

          if (isPresent(options.max)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.string.cannot-be-longer-than-characters',
            });
          }

          if (isPresent(options.pattern)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.string.pattern-mismatch',
            });
          }

          if (isPresent(options.whitespace)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.string.cannot-be-empty',
            });
          }

          break;

        case 'number':
          // len 存在时，表示固定长度
          // min 和 max 同时存在时，表示范围
          // min 存在时，表示最小值
          // max 存在时，表示最大值

          if (isPresent(options.len)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.number.must-equal',
            });
          }

          if (isPresent(options.min) && isPresent(options.max)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.number.must-be-between-the-range-of-numbers',
            });
          }

          if (isPresent(options.min)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.number.cannot-be-less-than',
            });
          }

          if (isPresent(options.max)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.number.cannot-be-greater-than',
            });
          }

          break;

        case 'array':
          // len 存在时，表示固定长度
          // min 和 max 同时存在时，表示范围
          // min 存在时，表示最小长度
          // max 存在时，表示最大长度
          if (isPresent(options.len)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.array.must-be-exactly-array-length',
            });
          }

          if (isPresent(options.min) && isPresent(options.max)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.array.must-be-between-the-range-of-array-length',
            });
          }

          if (isPresent(options.min)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.array.cannot-be-less-than-array-length',
            });
          }

          if (isPresent(options.max)) {
            return validateUtil.getErrorDataJSON({
              rules: pickedRules,
              message: 'validate.array.cannot-be-greater-than-array-length',
            });
          }

          break;
      }

      if (options.required) {
        return validateUtil.getErrorDataJSON({
          rules: pickedRules,
          message: 'validate.default.field-is-required',
        });
      }
    })();

    const asyncValidator = (() => {
      if (!regexp && options.asyncValidator === undefined) {
        return undefined;
      }

      return async (
        rule: ValidateInternalRuleItem,
        value: ValidateValue,
        callback: (error?: string | Error) => void,
        source: ValidateValues,
        option: ValidateOption,
      ): Promise<void> => {
        if (regexp) {
          if (regexpReversed) {
            if (regexp.test(value)) {
              return Promise.reject(message);
            }
          } else {
            if (!regexp.test(value)) {
              return Promise.reject(message);
            }
          }
        }

        if (typeof options.asyncValidator === 'function') {
          return await options.asyncValidator(rule, value, callback, source, option);
        }

        return Promise.resolve();
      };
    })();

    const transform = (() => {
      if ((options.transformers && options.transformers.length) || typeof options.transform === 'function') {
        return (value: ValidateValue) => {
          let newValue = (options.transformers ?? []).reduce((val: ValidateValue, transformer) => {
            switch (transformer) {
              case 'toBoolean':
                return Boolean(val);
              case 'toDate':
                return new Date(val);
              case 'trim':
                return val.trim();
              case 'trimLeft':
                return val.trimLeft();
              case 'trimRight':
                return val.trimRight();
              case 'trimStart':
                return val.trimStart();
              case 'trimEnd':
                return val.trimEnd();
              case 'toLower':
                return val.toLowerCase();
              case 'toUpper':
                return val.toUpperCase();
              case 'toNumber':
                return Number(val);
              case 'firstLetterUpper':
                return val.charAt(0).toUpperCase() + val.slice(1);
              case 'firstLetterLower':
                return val.charAt(0).toLowerCase() + val.slice(1);
              case 'capitalize':
                return inflection.capitalize(val);
              case 'camelize':
                return inflection.camelize(val);
              case 'dasherize':
                return inflection.dasherize(val);
              case 'underscore':
                return inflection.underscore(val);
              case 'pluralize':
                return inflection.pluralize(val);
              case 'singularize':
                return inflection.singularize(val);
              case 'humanize':
                return inflection.humanize(val);
              default:
                return val;
            }
          }, value);

          if (typeof options.transform === 'function') {
            newValue = options.transform(newValue);
          }

          return newValue;
        };
      }

      return undefined;
    })();

    const rule: ValidateRuleItem = {
      ...options,
      type,
      message,
      path,
    };

    if (asyncValidator) {
      rule.asyncValidator = asyncValidator;
    }

    if (transform) {
      rule.transform = transform;
    }

    if (rule.defaultField) {
      (Array.isArray(rule.defaultField) ? rule.defaultField : [rule.defaultField]).forEach((defaultField) => {
        defaultField.path = path;

        if (defaultField.fields) {
          defaultField.fields = _.reduce(
            defaultField.fields,
            (result: ValidateRules, field, fieldKey) => {
              const fields: ValidateRuleItem[] = [];
              (Array.isArray(field) ? field : [field]).forEach((field) => {
                fields.push(...validateUtil.parseToRules({ path: `${path}.${fieldKey}`, ...field }));
              });
              Reflect.set(result, fieldKey, fields);
              return result;
            },
            {},
          );
        }
      });
    }

    if (options.fields) {
      rule.fields = _.reduce(
        options.fields,
        (result: ValidateRules, field, fieldKey) => {
          const fields: ValidateRuleItem[] = [];
          (Array.isArray(field) ? field : [field]).forEach((field) => {
            fields.push(...validateUtil.parseToRules({ path: `${path}.${fieldKey}`, ...field }));
          });
          Reflect.set(result, fieldKey, fields);
          return result;
        },
        {},
      );
    }

    return rule;
  },

  /**
   * 获取错误信息
   * @param error 错误信息
   * @param options 选项
   * @returns 错误信息
   */
  getErrorDataJSON,

  /**
   * 解析错误信息
   * @param message 错误信息
   * @returns 错误信息
   */
  parseErrorDataJSON: (message?: string | unknown): ErrorDataJSON => {
    try {
      return JSON.parse(`${message ?? ''}`.replace(/^json:/, ''));
    } catch (error) {
      return { rules: {}, message: message ?? '' };
    }
  },

  /**
   * 收集规则转换
   * @param rules 校验规则
   * @param transforms 转换规则
   * @param path 路径
   * @returns 转换规则
   */
  collectRulesTransform: (rules: ValidateRules, transforms: Record<string, ValidateTransform[]>, path = '') => {
    Object.keys(rules).forEach((fieldKey) => {
      const fieldRules = rules[fieldKey];
      (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach((rule) => {
        rule.path = rule.path ?? `${path ? `${path}.` : ''}${fieldKey}`;

        if (rule.type === 'array') {
          (Array.isArray(rule.defaultField) ? rule.defaultField : [rule.defaultField]).forEach((defaultFieldRule) => {
            if (defaultFieldRule) {
              if (typeof defaultFieldRule?.transform === 'function') {
                if (defaultFieldRule.path) {
                  transforms[defaultFieldRule.path] ||= [];
                  transforms[defaultFieldRule.path].push(defaultFieldRule.transform);
                }
              }

              if (defaultFieldRule.fields) {
                validateUtil.collectRulesTransform(defaultFieldRule.fields, transforms, defaultFieldRule.path);
              }
            }
          });
        } else {
          if (typeof rule.transform === 'function') {
            transforms[rule.path] ||= [];
            transforms[rule.path].push(rule.transform);
          }
        }

        if (rule.fields) {
          validateUtil.collectRulesTransform(rule.fields, transforms, rule.path);
        }
      });
    });

    return transforms;
  },

  /**
   * 收集规则必填
   * @param rules 校验规则
   * @param requires 必填规则
   * @param path 路径
   * @returns 必填规则
   */
  collectRulesRequired: (rules: ValidateRules, requires: Record<string, boolean[]>, path = '') => {
    Object.keys(rules).forEach((fieldKey) => {
      const fieldRules = rules[fieldKey];

      (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach((rule) => {
        rule.path = rule.path ?? `${path ? `${path}.` : ''}${fieldKey}`;

        if (typeof rule.required === 'boolean') {
          if (rule.path) {
            requires[rule.path] ||= [];
            requires[rule.path].push(rule.required);
          }
        }

        if (rule.fields) {
          validateUtil.collectRulesRequired(rule.fields, requires, rule.path);
        }
      });
    });

    return requires;
  },

  /**
   * 收集规则必填
   * @param requires 必填规则
   * @param rules 校验规则
   */
  collectRulesRequiredAssign: (requires: Record<string, boolean[]>, rules: ValidateRules) => {
    Object.keys(rules).forEach((fieldKey) => {
      const fieldRules = (Array.isArray(rules[fieldKey]) ? rules[fieldKey] : [rules[fieldKey]]) as ValidateRuleItem[];

      fieldRules.forEach((rule, ruleIndex) => {
        if (ruleIndex === 0 && rule.path && _.last(requires[rule.path] ?? [])) {
          rule.required = true;
          delete requires[rule.path];
        } else {
          delete rule.required;
        }

        if (rule.fields) {
          validateUtil.collectRulesRequiredAssign(requires, rule.fields);
        }
      });
    });
  },

  /**
   * 规范化规则
   * @param rules 校验规则
   * @returns 校验规则
   */
  normalizeRules: (rules: ValidateRules) => {
    const pureRules = _.cloneDeep(rules);
    const requires = validateUtil.collectRulesRequired(pureRules, {}, '');
    validateUtil.collectRulesRequiredAssign(requires, pureRules);
    return pureRules;
  },
};

export default validateUtil;

/**
 * 校验器选项
 */
export interface ValidatorOptions {
  action: string;
  rules: Record<string, ValidateOptionRule | ValidateOptionRule[]>;
  model?: string;
}

/**
 * 校验器
 */
export class Validator {
  public action!: string;
  public rules: ValidateRules = {};
  public model = 'Base';

  constructor(options: ValidatorOptions) {
    this.action = options.action;
    this.rules = validateUtil.getRules(options.rules ?? {}, this.rules);
    this.model = options.model ?? this.model;
  }

  /**
   * 校验数据
   * @param data 数据
   * @param options 选项
   * @param callback 回调
   * @returns 校验结果
   */
  public validate(data: ValidateValues, options?: ValidateOption, callback?: ValidateCallback) {
    return validateUtil.validate(this.rules, data, { model: this.model, ...options }, callback);
  }

  /**
   * 获取国际化规则
   * @param options 选项
   * @returns 校验规则
   */
  public getLocaleRules(options?: GetLocaleRulesOptions) {
    return validateUtil.getLocaleRules(this.rules, options);
  }

  /**
   * 包装规则
   * @param options 选项
   * @returns 校验器
   */
  public wrapRules(options: WrapRulesOptions) {
    const override = options.override ?? false;
    const validator = override ? this : _.cloneDeep(this);
    validator.rules = validateUtil.getRules(options.rules ?? {}, validator.rules, { direction: options.direction });
    return validator;
  }

  /**
   * 省略规则
   * @param options 选项
   * @returns 校验器
   */
  public omitRules(options: OmitRulesOptions) {
    const override = options.override ?? false;
    const validator = override ? this : _.cloneDeep(this);
    validator.rules = _.omit(validator.rules, options.fieldKeys);
    return validator;
  }
}
