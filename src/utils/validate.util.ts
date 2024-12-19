import * as inflection from 'inflection';
import _ from 'lodash';

import ValidateSchema, {
  ValidateError as OriginalValidateError,
  ValidateOption as OriginalValidateOption,
  ValidateCallback,
  ExecuteRule as ValidateExecuteRule,
  ExecuteValidator as ValidateExecuteValidator,
  ValidateFieldsError,
  InternalRuleItem as ValidateInternalRuleItem,
  InternalValidateMessages as ValidateInternalValidateMessages,
  ValidateMessages,
  ValidateResult,
  Rule as ValidateRule,
  RuleItem as ValidateRuleItem,
  Rules as ValidateRules,
  RuleType as ValidateRuleType,
  RuleValuePackage as ValidateRuleValuePackage,
  Value as ValidateValue,
  Values as ValidateValues,
} from 'async-validator';

export interface ValidateOption extends OriginalValidateOption {
  /** 模型 */
  model?: string;
}

export interface GetErrorsOptions {
  /** 模型 */
  model?: string;
  /** 字段 */
  field?: string;
  /** 字段值 */
  fieldValue?: ValidateValue;
}

export interface ValidateError extends OriginalValidateError {
  /** 错误码 */
  code?: string;
  /** 模型 */
  model?: string;
}

export interface ValidateResponse {
  /** 是否成功 */
  success: boolean;
  /** 数据 */
  values: ValidateValues;
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
  ValidateRule,
  ValidateRuleItem,
  ValidateRules,
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

  /**
   * 获取错误信息
   * @param error 错误信息
   * @returns 错误信息
   */
  getErrorMessage: (error: unknown) => {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return Reflect.get(error, 'message');
    }

    if (typeof error === 'string') {
      return error;
    }

    return `${error}`;
  },

  /**
   * 获取错误码
   * @param error 错误信息
   * @returns 错误码
   */
  getErrorCode: (error: unknown) => {
    if (typeof error === 'object' && error !== null && 'name' in error && typeof Reflect.get(error, 'name') === 'string') {
      return Reflect.get(error, 'name');
    }

    return 'ValidateError.Failed';
  },

  /**
   * 获取错误信息
   * @param error 错误信息
   * @param options 选项
   * @returns 错误信息
   */
  getErrors: (error: unknown, options?: GetErrorsOptions) => {
    if (typeof error === 'object' && error !== null && 'errors' in error) {
      const messageToCode = (str: string): string => {
        const regex = /[a-zA-Z0-9]+/g;
        const matches = str.match(regex) || [];
        return matches.map((word) => word.toLowerCase()).join('_');
      };

      return (Reflect.get(error, 'errors') as ValidateError[]).map((err) => {
        const errMessage = Reflect.get(err, 'message') ?? '';

        const parts = (typeof errMessage === 'string' ? errMessage : '').split('.').map((part: string) => {
          return inflection.camelize(messageToCode(part));
        });

        const code = `ValidateError.${parts.length ? parts.join('.') : 'Failed'}`;

        return {
          ..._.pick(err, ['message', 'field', 'fieldValue']),
          code,
          model: options?.model,
        };
      });
    }

    return [
      {
        message: validateUtil.getErrorMessage(error),
        code: validateUtil.getErrorCode(error),
        fieldValue: options?.fieldValue,
        field: options?.field,
        model: options?.model,
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
      const values = await validateUtil.getSchema(rules).validate(data, options, callback);
      return {
        success: true,
        values,
      };
    } catch (error) {
      return {
        success: false,
        values: data,
        errors: validateUtil.getErrors(error, { model }),
      };
    }
  },
};

export default validateUtil;
