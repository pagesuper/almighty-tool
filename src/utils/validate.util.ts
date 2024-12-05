import * as inflection from 'inflection';

import OriginalSchema, {
  ExecuteRule as ValidateExecuteRule,
  ExecuteValidator as ValidateExecuteValidator,
  InternalRuleItem as ValidateInternalRuleItem,
  InternalValidateMessages as ValidateInternalValidateMessages,
  ValidateError as OriginalValidateError,
  Rule as ValidateRule,
  RuleItem as ValidateRuleItem,
  Rules as ValidateRules,
  RuleType as ValidateRuleType,
  RuleValuePackage as ValidateRuleValuePackage,
  ValidateCallback as ValidateValidateCallback,
  ValidateFieldsError as ValidateValidateFieldsError,
  ValidateMessages as ValidateValidateMessages,
  ValidateOption as ValidateValidateOption,
  ValidateResult as ValidateValidateResult,
  Value as ValidateValue,
  Values as ValidateValues,
} from 'async-validator';

export class ValidateSchema extends OriginalSchema {}

export type {
  ValidateExecuteRule,
  ValidateExecuteValidator,
  ValidateInternalRuleItem,
  ValidateInternalValidateMessages,
  ValidateRule,
  ValidateRuleItem,
  ValidateRules,
  ValidateRuleType,
  ValidateRuleValuePackage,
  ValidateValidateCallback,
  ValidateValidateFieldsError,
  ValidateValidateMessages,
  ValidateValidateOption,
  ValidateValidateResult,
  ValidateValue,
  ValidateValues,
};

export interface ValidateError extends OriginalValidateError {
  code?: string;
}

export interface ValidateResponse {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  errors?: ValidateError[];
}

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
   * 获取错误信息
   * @param error 错误信息
   * @returns 错误信息
   */
  getErrors: (error: unknown) => {
    if (typeof error === 'object' && error !== null && 'errors' in error) {
      const messageToCode = (str: string): string => {
        const regex = /[a-zA-Z0-9]+/g;
        const matches = str.match(regex) || [];
        return matches.map((word) => word.toLowerCase()).join('_');
      };

      return (Reflect.get(error, 'errors') as ValidateError[]).map((err) => {
        const parts = (Reflect.get(err, 'message') ?? '').split('.').map((part: string) => {
          return inflection.camelize(messageToCode(part));
        });

        const code = `ValidateError.${parts.length ? parts.join('.') : 'Failed'}`;

        return {
          ...err,
          code,
        };
      });
    }

    return [
      {
        message: validateUtil.getErrorMessage(error),
        code: 'Error',
        fieldValue: '',
        field: '',
      },
    ] as ValidateError[];
  },

  /**
   * 校验数据
   * @param rules 校验规则
   * @param data 数据
   * @returns 校验结果
   */
  validate: async (rules: ValidateRules | ValidateSchema, data: ValidateValues): Promise<ValidateResponse> => {
    try {
      await validateUtil.getSchema(rules).validate(data);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        errors: validateUtil.getErrors(error),
      };
    }
  },
};

export default validateUtil;
