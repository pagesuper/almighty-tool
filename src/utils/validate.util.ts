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
import _ from 'lodash';
import { I18n, i18nConfig } from '../i18n/index';
import { regExps } from './format.util';

export interface ValidateOption extends OriginalValidateOption {
  /** 模型 */
  model?: string;
  /** 规则 */
  rules?: GetRulesOptions;
  /** 国际化 */
  i18n?: I18n;
  /**
   * 语言
   * - zh-CN
   * - en-US
   */
  lang?: string;
}

export interface WrapRulesOptions extends ValidateOption {
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
  messageData?: MessageJSON;
}

export type ValidateRule = ValidateRuleItem | ValidateRuleItem[];
export type ValidateRules = Record<string, ValidateRule>;

export interface GetRuleOptions extends Omit<ValidateRuleItem, 'fields'> {
  /** 子规则 */
  fields?: Record<string, GetRuleOptions | GetRuleOptions[]>;
  /** 正则表达式的key */
  regexpKey?: string;
  /** 相反 */
  regexpReversed?: boolean;
}

export interface GetLocaleRulesOptions {
  /** 国际化 */
  i18n?: I18n;
  /** 语言 */
  lang?: string;
}

export type GetRulesOptions = Record<string, GetRuleOptions | GetRuleOptions[]>;

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
  messageData?: MessageJSON;
}

export interface ValidateResponse {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  errors?: ValidateError[];
}

export interface MessageJSON {
  rules: Partial<GetRuleOptions>;
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

function getMessageJSON(messageJSON: MessageJSON) {
  return `json:${JSON.stringify(messageJSON)}`;
}

const defaultMessages: ValidateMessages = {
  default: getMessageJSON({ rules: {}, message: 'validate.default.field-is-invalid' }),
  required: getMessageJSON({ rules: {}, message: 'validate.default.field-is-required' }),
  enum: getMessageJSON({ rules: {}, message: 'validate.default.field-must-be-enum' }),
  whitespace: getMessageJSON({ rules: {}, message: 'validate.default.cannot-be-empty' }),
  date: {
    format: getMessageJSON({ rules: {}, message: 'validate.date.format-is-invalid' }),
    parse: getMessageJSON({ rules: {}, message: 'validate.date.could-not-be-parsed' }),
    invalid: getMessageJSON({ rules: {}, message: 'validate.date.is-invalid' }),
  },
  types: {
    string: getMessageJSON({ rules: {}, message: 'validate.types.must-be-string' }),
    method: getMessageJSON({ rules: {}, message: 'validate.types.must-be-method' }),
    array: getMessageJSON({ rules: {}, message: 'validate.types.must-be-array' }),
    object: getMessageJSON({ rules: {}, message: 'validate.types.must-be-object' }),
    number: getMessageJSON({ rules: {}, message: 'validate.types.must-be-number' }),
    date: getMessageJSON({ rules: {}, message: 'validate.types.must-be-date' }),
    boolean: getMessageJSON({ rules: {}, message: 'validate.types.must-be-boolean' }),
    integer: getMessageJSON({ rules: {}, message: 'validate.types.must-be-integer' }),
    float: getMessageJSON({ rules: {}, message: 'validate.types.must-be-float' }),
    regexp: getMessageJSON({ rules: {}, message: 'validate.types.must-be-regexp' }),
    email: getMessageJSON({ rules: {}, message: 'validate.types.must-be-email' }),
    url: getMessageJSON({ rules: {}, message: 'validate.types.must-be-url' }),
    hex: getMessageJSON({ rules: {}, message: 'validate.types.must-be-hex' }),
  },
};

/** 校验工具 */
const validateUtil = {
  /**
   * 获取校验器
   * @param rules 校验规则
   * @returns 校验器
   */
  getSchema: (rules: GetRulesOptions, options?: ValidateOption) => {
    return new ValidateSchema(
      validateUtil.normalizeRules(validateUtil.getRules(options?.rules ?? {}, validateUtil.getRules(rules, {}))),
    );
  },

  getErrorMessage: (error: unknown, options?: GetErrorsOptions) => {
    const i18n = options?.i18n ?? i18nConfig.i18n;

    if (typeof error === 'object' && error !== null && ('message' in error || 'msg' in error)) {
      return Reflect.get(error, 'message') ?? Reflect.get(error, 'msg');
    }

    if (typeof error === 'string') {
      if (i18n && typeof i18n.t === 'function') {
        const messageJSON = validateUtil.parseMessageJSON(error);
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
          messageData: validateUtil.parseMessageJSON(err.message),
          message: validateUtil.getErrorMessage(err.message, options),
          model,
        };
      });
    }

    return [
      {
        messageData: validateUtil.parseMessageJSON(error),
        message: validateUtil.getErrorMessage(error, options),
        fieldValue: options?.fieldValue,
        field: options?.field,
        model,
      },
    ] as ValidateError[];
  },

  /**
   * 校验数据
   * @param rules 校验规则
   * @param data 数据
   * @returns 校验结果
   */
  validate: async (
    rules: GetRulesOptions,
    data: ValidateValues,
    options?: ValidateOption,
    callback?: ValidateCallback,
  ): Promise<ValidateResponse> => {
    const model = options?.model ?? 'Base';

    try {
      const schema = validateUtil.getSchema(rules, options);
      await schema.validate(data, deepmerge({ messages: defaultMessages }, options ?? {}), callback);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        errors: validateUtil.getErrors(error, { model, i18n: options?.i18n ?? i18nConfig.i18n, lang: options?.lang }),
      };
    }
  },

  recursiveGetLocaleRules: (rules: ValidateRules, options: GetLocaleRulesOptions = {}) => {
    const i18n = options?.i18n ?? i18nConfig.i18n;
    const lang = options?.lang ?? i18nConfig.defaultLang;

    Object.keys(rules).forEach((fieldKey) => {
      const fieldRules = rules[fieldKey];

      (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach((rule) => {
        if (i18n && typeof i18n.t === 'function' && typeof rule.message === 'string') {
          const messageJSON = validateUtil.parseMessageJSON(rule.message);
          rule.messageData = messageJSON;
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

  getLocaleRules: (rules: ValidateRules, options: GetLocaleRulesOptions = {}) => {
    const i18n = options?.i18n ?? i18nConfig.i18n;
    const lang = options?.lang ?? i18nConfig.defaultLang;
    return validateUtil.recursiveGetLocaleRules(_.cloneDeep(validateUtil.getRules(rules)), { i18n, lang });
  },

  getRules: (rules: GetRulesOptions, initialRules: ValidateRules = {}): ValidateRules => {
    const mergedRules = _.reduce(
      rules,
      (result, rule, fieldKey) => {
        const loadedRules = Array.isArray(rule)
          ? rule.map((option) => validateUtil.getRule({ path: fieldKey, ...option }))
          : [validateUtil.getRule({ path: fieldKey, ...rule })];

        const previousRules = Reflect.get(result, fieldKey) ?? [];
        const storedRules = Array.isArray(previousRules) ? previousRules : [previousRules];
        storedRules.push(...loadedRules);
        Reflect.set(result, fieldKey, storedRules);
        return result;
      },
      initialRules,
    );

    return mergedRules;
  },

  /** 获取规则 */
  getRule(options: GetRuleOptions): ValidateRuleItem {
    const path = options?.path ?? '';
    const regexpKey = options?.regexpKey;
    const regexp = options?.pattern ?? (regexpKey ? Reflect.get(regExps, regexpKey) : undefined);
    const type = options?.type ?? (options.fields ? 'object' : 'string');
    const regexpReversed = options?.regexpReversed ?? false;

    const message = (() => {
      const pickedRules = _.pick(options, [
        'min',
        'max',
        'len',
        'range',
        'pattern',
        'regexpKey',
        'regexpReversed',
        'type',
        'required',
        'enum',
        'whitespace',
      ]);

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
        return validateUtil.getMessageJSON({
          rules: pickedRules,
          message: `validate.regexp-key.${options.regexpReversed ? 'invalid-reversed' : 'invalid'}:${
            options.regexpKey ?? 'format'
          }`,
        });
      }

      switch (type) {
        case 'string':
          if (typeof options.min !== 'undefined' && typeof options.max !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.string.must-be-between-the-range-of-characters',
            });
          }

          if (typeof options.min !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.string.must-be-at-least-characters',
            });
          }

          if (typeof options.max !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.string.cannot-be-longer-than-characters',
            });
          }

          if (typeof options.len !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.string.must-be-exactly-characters',
            });
          }

          if (typeof options.pattern !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.string.pattern-mismatch',
            });
          }

          break;

        case 'number':
          if (typeof options.min !== 'undefined' && typeof options.max !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.number.must-be-between-the-range-of-numbers',
            });
          }

          if (typeof options.min !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.number.cannot-be-less-than',
            });
          }

          if (typeof options.max !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.number.cannot-be-greater-than',
            });
          }

          if (typeof options.len !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.number.must-equal',
            });
          }

          break;

        case 'array':
          if (typeof options.min !== 'undefined' && typeof options.max !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.array.must-be-between-the-range-of-array-length',
            });
          }

          if (typeof options.min !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.array.cannot-be-less-than-array-length',
            });
          }

          if (typeof options.max !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.array.cannot-be-greater-than-array-length',
            });
          }

          if (typeof options.len !== 'undefined') {
            return validateUtil.getMessageJSON({
              rules: pickedRules,
              message: 'validate.array.must-be-exactly-array-length',
            });
          }

          break;
      }

      return undefined;
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

    const rule: ValidateRuleItem = {
      ...options,
      type,
      message,
      path,
    };

    if (asyncValidator) {
      rule.asyncValidator = asyncValidator;
    }

    if (options.fields) {
      rule.fields = _.reduce(
        options.fields,
        (result: ValidateRules, field, fieldKey) => {
          const fields = (Array.isArray(field) ? field : [field]).map((field) => {
            return validateUtil.getRule({ path: `${path}.${fieldKey}`, ...field });
          });
          Reflect.set(result, fieldKey, fields);
          return result;
        },
        {},
      );
    }

    return rule;
  },

  getMessageJSON,

  parseMessageJSON: (message?: string | unknown): MessageJSON => {
    try {
      return JSON.parse(`${message ?? ''}`.replace(/^json:/, ''));
    } catch (error) {
      return { rules: {}, message: message ?? '' };
    }
  },

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

  normalizeRules: (rules: ValidateRules) => {
    const pureRules = _.cloneDeep(rules);
    const requires = validateUtil.collectRulesRequired(pureRules, {}, '');
    validateUtil.collectRulesRequiredAssign(requires, pureRules);
    return pureRules;
  },
};

export default validateUtil;

export interface ValidatorOptions {
  action: string;
  rules: Record<string, GetRuleOptions | GetRuleOptions[]>;
  model?: string;
}

export class Validator {
  public action!: string;
  public rules: ValidateRules = {};
  public model = 'Base';

  constructor(options: ValidatorOptions) {
    this.action = options.action;
    this.rules = validateUtil.getRules(options.rules ?? {}, this.rules);
    this.model = options.model ?? this.model;
  }

  public validate(data: ValidateValues, options?: ValidateOption, callback?: ValidateCallback) {
    return validateUtil.validate(this.rules, data, { model: this.model, ...options }, callback);
  }

  public getLocaleRules(options?: GetLocaleRulesOptions) {
    return validateUtil.getLocaleRules(this.rules, options);
  }

  public wrapRules(options: WrapRulesOptions) {
    const override = options.override ?? false;
    const validator = override ? this : _.cloneDeep(this);
    validator.rules = validateUtil.getRules(options.rules ?? {}, validator.rules);
    return validator;
  }
}
