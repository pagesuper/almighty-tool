import ValidateSchema, { ValidateError as OriginalValidateError, ValidateOption as OriginalValidateOption, RuleItem as OriginalValidateRuleItem, ValidateCallback, ExecuteRule as ValidateExecuteRule, ExecuteValidator as ValidateExecuteValidator, ValidateFieldsError, InternalRuleItem as ValidateInternalRuleItem, InternalValidateMessages as ValidateInternalValidateMessages, ValidateMessages, ValidateResult, RuleType as ValidateRuleType, RuleValuePackage as ValidateRuleValuePackage, Value as ValidateValue, Values as ValidateValues } from 'async-validator';
import { I18n } from '../common/i18n';
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
export declare type ValidateRule = ValidateRuleItem | ValidateRuleItem[];
export declare type ValidateRules = Record<string, ValidateRule>;
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
export declare type GetRulesOptions = Record<string, GetRuleOptions | GetRuleOptions[]>;
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
export type { ValidateCallback, ValidateExecuteRule, ValidateExecuteValidator, ValidateFieldsError, ValidateInternalRuleItem, ValidateInternalValidateMessages, ValidateMessages, ValidateResult, ValidateRuleType, ValidateRuleValuePackage, ValidateValue, ValidateValues, };
/** 校验工具 */
declare const validateUtil: {
    /**
     * 获取校验器
     * @param rules 校验规则
     * @returns 校验器
     */
    getSchema: (rules: ValidateRules | ValidateSchema) => ValidateSchema;
    getErrorMessage: (error: unknown) => any;
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
    getErrors: (error: unknown, options?: GetErrorsOptions | undefined) => ValidateError[] | {
        message: any;
        model: string;
        field?: string | undefined;
        fieldValue?: any;
    }[];
    /**
     * 校验数据
     * @param rules 校验规则
     * @param data 数据
     * @returns 校验结果
     */
    validate: (rules: ValidateRules | ValidateSchema, data: ValidateValues, options?: ValidateOption | undefined, callback?: ValidateCallback | undefined) => Promise<ValidateResponse>;
    /** 获取规则 */
    getRule(options: GetRuleOptions): ValidateRuleItem;
};
export default validateUtil;
export interface ValidatorOptions {
    action: string;
    rules: Record<string, GetRuleOptions | GetRuleOptions[]>;
    model?: string;
    i18n?: I18n | (() => I18n);
}
export declare class Validator {
    action: string;
    rules: Record<string, ValidateRules>;
    model: string;
    i18n: I18n | (() => I18n);
    constructor(options: ValidatorOptions);
    getI18n(): I18n;
    validate(data: ValidateValues, options?: ValidateOption, callback?: ValidateCallback): Promise<ValidateResponse>;
    private loadRules;
    private loadRule;
}
