import { GeneralResult } from './general';
import { Rules, ValidateOption, Values } from 'async-validator';
declare namespace IValidate {
    interface Options {
        /** 字段的前缀 */
        prefix?: string;
        /** 前置的结果 */
        previousResult?: GeneralResult;
        /** 校验的options */
        options?: ValidateOption;
    }
}
declare const _default: {
    /**
     *
     * @param rules 规则
     * @param source 校验的源
     * @param options 校验选项
     */
    validate(rules: Rules, source: Values, options?: IValidate.Options): GeneralResult;
};
export default _default;
