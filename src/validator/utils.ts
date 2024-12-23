import type {
  ValidateInternalRuleItem,
  ValidateOption,
  ValidateRuleItem,
  ValidateValue,
  ValidateValues,
} from '../utils/validate.util';
import regularExpressions from './regular-expressions';

export interface GetRuleOptions extends ValidateRuleItem {
  /** 正则表达式 */
  regexp?: RegExp;
  /** 正则表达式的key */
  regexpKey?: string;
  /** 相反 */
  regexpReversed?: boolean;
}

const validatorUtils = {
  /** 获取规则 */
  getRule(options: GetRuleOptions): ValidateRuleItem {
    const regexpKey = options?.regexpKey;
    const type = options?.type ?? 'string';
    const message = options?.message ?? `${options.regexpReversed ? 'InvalidReversed' : 'Invalid'}:${options.regexpKey}`;
    const regexpReversed = options?.regexpReversed ?? false;

    const asyncValidator = async (
      rule: ValidateInternalRuleItem,
      value: ValidateValue,
      callback: (error?: string | Error) => void,
      source: ValidateValues,
      option: ValidateOption,
    ): Promise<void> => {
      const regexp = options?.regexp ?? (regexpKey ? regularExpressions[regexpKey] : undefined);

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

    return {
      type,
      message,
      asyncValidator,
    };
  },
};

export default validatorUtils;
