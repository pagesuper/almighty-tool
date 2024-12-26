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
import _ from 'lodash';
import { I18n, i18nConfig } from '../common/i18n';
import { regExps } from './format.util';
import deepmerge from 'deepmerge';

export interface ValidateOption extends OriginalValidateOption {
  /** 模型 */
  model?: string;
  /** 规则 */
  rules?: GetRulesOptions;
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
}

export type ValidateRule = ValidateRuleItem | ValidateRuleItem[];
export type ValidateRules = Record<string, ValidateRule>;

export interface GetRuleOptions extends Omit<ValidateRuleItem, 'fields'> {
  /** 字段 */
  label?: string;
  /** 子规则 */
  fields?: Record<string, GetRuleOptions | GetRuleOptions[]>;
  /** 正则表达式 */
  regexp?: RegExp;
  /** 正则表达式的key */
  regexpKey?: string;
  /** 相反 */
  regexpReversed?: boolean;
}

export type GetRulesOptions = Record<string, GetRuleOptions | GetRuleOptions[]>;

export interface GetErrorsOptions {
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
}

export interface ValidateResponse {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  errors?: ValidateError[];
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

const defaultMessages: ValidateMessages = {
  default: 'validation error',
  required: 'is required',
  enum: 'must be one of enum',
  whitespace: 'cannot be empty',
  date: {
    format: '%s date %s is invalid for format %s',
    parse: '%s date could not be parsed, %s is invalid ',
    invalid: '%s date %s is invalid',
  },
  types: {
    string: 'is not a string',
    method: 'is not a function',
    array: 'is not an array',
    object: 'is not an object',
    number: 'is not a number',
    date: 'is not a date',
    boolean: 'is not a boolean',
    integer: 'is not an integer',
    float: 'is not a float',
    regexp: 'is not a regexp',
    email: 'is not an email',
    url: 'is not a url',
    hex: 'is not a hex',
  },
  string: {
    len: '%s must be exactly %s characters',
    min: '%s must be at least %s characters',
    max: '%s cannot be longer than %s characters',
    range: '%s must be between %s and %s characters',
  },
  number: {
    len: '%s must equal %s',
    min: '%s cannot be less than %s',
    max: '%s cannot be greater than %s',
    range: '%s must be between %s and %s',
  },
  array: {
    len: '%s must be exactly %s in length',
    min: '%s cannot be less than %s in length',
    max: '%s cannot be greater than %s in length',
    range: '%s must be between %s and %s in length',
  },
  pattern: {
    mismatch: '%s value %s does not match pattern %s',
  },
};

/** 校验工具 */
const validateUtil = {
  /**
   * 获取校验器
   * @param rules 校验规则
   * @returns 校验器
   */
  getSchema: (rules: ValidateRules | ValidateSchema) => {
    if (rules instanceof ValidateSchema) {
      return rules;
    }

    return new ValidateSchema(rules);
  },

  getErrorMessage: (error: unknown) => {
    if (typeof error === 'object' && error !== null && ('message' in error || 'msg' in error)) {
      return Reflect.get(error, 'message') ?? Reflect.get(error, 'msg');
    }

    if (typeof error === 'string') {
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
          message: validateUtil.getErrorMessage(err.message),
          model,
        };
      });
    }

    return [
      {
        message: validateUtil.getErrorMessage(error),
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
    rules: ValidateRules,
    data: ValidateValues,
    options?: ValidateOption,
    callback?: ValidateCallback,
  ): Promise<ValidateResponse> => {
    const model = options?.model ?? 'Base';

    try {
      const schema = validateUtil.getSchema(rules);
      await schema.validate(data, deepmerge({ messages: defaultMessages }, options ?? {}), callback);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        errors: validateUtil.getErrors(error, { model }),
      };
    }
  },

  getRules: (rules: GetRulesOptions, initialRules: ValidateRules = {}, options: { i18n: I18n } = { i18n: i18nConfig.i18n }) => {
    const mergedRules = _.reduce(
      rules,
      (result, rule, fieldKey) => {
        const i18n = options.i18n ?? i18nConfig.i18n;
        const label = i18n.t(fieldKey);
        const loadedRules = Array.isArray(rule)
          ? rule.map((option) => validateUtil.getRule({ label, path: fieldKey, ...option }))
          : [validateUtil.getRule({ label, path: fieldKey, ...rule })];

        const previousRules = Reflect.get(result, fieldKey) ?? [];
        const storedRules = Array.isArray(previousRules) ? previousRules : [previousRules];
        storedRules.push(...loadedRules);
        Reflect.set(result, fieldKey, storedRules);
        return result;
      },
      initialRules,
    );

    return validateUtil.normalizeRules(mergedRules);
  },

  /** 获取规则 */
  getRule(options: GetRuleOptions): ValidateRuleItem {
    const path = options?.path ?? '';
    const regexpKey = options?.regexpKey;
    const regexp = options?.regexp ?? (regexpKey ? Reflect.get(regExps, regexpKey) : undefined);
    const type = options?.type ?? (options.fields ? 'object' : 'string');
    const regexpReversed = options?.regexpReversed ?? false;

    const message = (() => {
      if (options.message) {
        if (typeof options.message === 'function') {
          return options.message(options.label);
        }

        return options.message;
      }

      if (regexpKey) {
        return `${options.regexpReversed ? 'InvalidReversed' : 'Invalid'}:${options.regexpKey ?? 'format'}`;
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

  collectRulesRequired: (requires: Record<string, boolean[]>, rules: ValidateRules) => {
    Object.keys(rules).forEach((fieldKey) => {
      const fieldRules = rules[fieldKey];

      (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach((rule) => {
        if (typeof rule.required === 'boolean') {
          if (rule.path) {
            requires[rule.path] ||= [];
            requires[rule.path].push(rule.required);
          }
        }

        if (rule.fields) {
          validateUtil.collectRulesRequired(requires, rule.fields);
        }
      });
    });

    return requires;
  },

  collectRulesRequiredAssign: (requires: Record<string, boolean[]>, rules: ValidateRules) => {
    Object.keys(rules).forEach((fieldKey) => {
      const fieldRules = rules[fieldKey];
      const fieldRulesArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules];

      fieldRulesArray.forEach((rule, ruleIndex) => {
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
    const requires = validateUtil.collectRulesRequired({}, pureRules);
    validateUtil.collectRulesRequiredAssign(requires, pureRules);
    return pureRules;
  },
};

export default validateUtil;

export interface ValidatorOptions {
  action: string;
  rules: Record<string, GetRuleOptions | GetRuleOptions[]>;
  model?: string;
  i18n?: I18n | (() => I18n);
}

export class Validator {
  public action!: string;
  public rules: ValidateRules = {};
  public model = 'Base';
  public i18n: I18n | (() => I18n);

  constructor(options: ValidatorOptions) {
    this.action = options.action;
    this.rules = validateUtil.getRules(options.rules ?? {}, this.rules, { i18n: this.getI18n() });
    this.model = options.model ?? this.model;
    this.i18n = options.i18n ?? i18nConfig.i18n;
  }

  public getI18n() {
    return (typeof this.i18n === 'function' ? this.i18n() : this.i18n) ?? i18nConfig.i18n;
  }

  public validate(data: ValidateValues, options?: ValidateOption, callback?: ValidateCallback) {
    return validateUtil.validate(
      validateUtil.getRules(options?.rules ?? {}, this.rules, { i18n: this.getI18n() }),
      data,
      { model: this.model, ...options },
      callback,
    );
  }

  public wrapRules(options: WrapRulesOptions) {
    const override = options.override ?? false;
    const validator = override ? this : _.cloneDeep(this);
    validator.rules = validateUtil.getRules(options.rules ?? {}, validator.rules, { i18n: validator.getI18n() });
    return validator;
  }
}
