/* eslint-disable */
import { GeneralResult } from './general';
import Schema, { Rules, ValidateError, ValidateOption, Values } from 'async-validator';

export interface IValidateOptions {
  /** 字段的前缀 */
  prefix?: string;
  /** 前置的结果 */
  previousResult?: GeneralResult;
  /** 校验的options */
  options?: ValidateOption;
}

export default {
  /**
   *
   * @param rules 规则
   * @param source 校验的源
   * @param options 校验选项
   */
  validate(rules: Rules, source: Values, options: IValidateOptions = {}): GeneralResult {
    const generalResult: GeneralResult = options.previousResult || new GeneralResult();
    const schema = new Schema(rules);

    schema.validate(source, options.options || {}, (errors: ValidateError[] | null): void => {
      (errors || []).forEach((error) => {
        generalResult.pushError({
          path: `${options.prefix ? `${options.prefix}.` : ''}${error.field}`,
          message: error.message || '',
          info: 'validate.fail',
        });
      });
    });

    return generalResult;
  },
};
