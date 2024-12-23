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
import { regExps } from './format.util';

export interface ValidateOption extends OriginalValidateOption {
  /** 模型 */
  model?: string;
}

export interface ValidateRuleItemRequiredFnOptions {
  item: ValidateRuleItem;
}

export interface ValidateRuleItem extends Omit<OriginalValidateRuleItem, 'fields'> {
  /** 子规则 */
  fields?: Record<string, ValidateRule>;
}

export type ValidateRule = ValidateRuleItem | ValidateRuleItem[];
export type ValidateRules = Record<string, ValidateRule>;

export interface GetRuleOptions extends Omit<ValidateRuleItem, 'fields'> {
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
    rules: ValidateRules | ValidateSchema,
    data: ValidateValues,
    options?: ValidateOption,
    callback?: ValidateCallback,
  ): Promise<ValidateResponse> => {
    const model = options?.model ?? 'Base';

    try {
      const schema = validateUtil.getSchema(rules);
      await schema.validate(data, options, callback);
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

  /** 获取规则 */
  getRule(options: GetRuleOptions): ValidateRuleItem {
    const regexpKey = options?.regexpKey;
    const regexp = options?.regexp ?? (regexpKey ? regExps[regexpKey] : undefined);
    const type = options?.type ?? 'string';
    const regexpReversed = options?.regexpReversed ?? false;

    const message = (() => {
      if (options.message) {
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
    };

    if (asyncValidator) {
      rule.asyncValidator = asyncValidator;
    }

    if (options.fields) {
      rule.fields = _.reduce(
        options.fields,
        (result: Record<string, ValidateRuleItem[]>, field, fieldKey) => {
          const fields = (Array.isArray(field) ? field : [field]).map((field) => {
            return validateUtil.getRule(field);
          });
          Reflect.set(result, fieldKey, fields);
          return result;
        },
        {},
      );
    }

    return rule;
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
  public rules: Record<string, ValidateRules> = {};
  public model: string = 'Base';

  constructor(options: ValidatorOptions) {
    this.action = options.action;
    this.rules = this.loadRules(options.rules ?? {});
    this.model = options.model ?? this.model;
  }

  public validate(data: ValidateValues, options?: ValidateOption, callback?: ValidateCallback) {
    return validateUtil.validate(this.rules, data, { model: this.model, ...options }, callback);
  }

  private loadRules(rules: GetRulesOptions) {
    return _.reduce(
      rules,
      (result, options, fieldKey) => {
        const loadedRule = this.loadRule(options);
        Reflect.set(result, fieldKey, loadedRule);
        return result;
      },
      {},
    );
  }

  private loadRule(options: GetRuleOptions | GetRuleOptions[] = {}) {
    if (Array.isArray(options)) {
      return options.map((option) => {
        return validateUtil.getRule(option);
      });
    }

    return validateUtil.getRule(options);
  }
}
