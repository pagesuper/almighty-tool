import ValidateSchema, { ValidateError as OriginalValidateError, ValidateOption as OriginalValidateOption, RuleItem as OriginalValidateRuleItem, ValidateCallback, ExecuteRule as ValidateExecuteRule, ExecuteValidator as ValidateExecuteValidator, ValidateFieldsError, InternalRuleItem as ValidateInternalRuleItem, InternalValidateMessages as ValidateInternalValidateMessages, ValidateMessages, ValidateResult, RuleType as ValidateRuleType, RuleValuePackage as ValidateRuleValuePackage, Value as ValidateValue, Values as ValidateValues } from 'async-validator';
import { I18n } from '../i18n/index';
export declare type ValidateTransform = (value: ValidateValue) => ValidateValue;
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
}
export declare type ValidateRule = ValidateRuleItem | ValidateRuleItem[];
export declare type ValidateRules = Record<string, ValidateRule>;
export interface ValidateOptionRule extends Omit<ValidateRuleItem, 'fields'> {
    /** 子规则 */
    fields?: Record<string, ValidateOptionRule | ValidateOptionRule[]>;
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
export declare type ValidateOptionRules = Record<string, ValidateOptionRule | ValidateOptionRule[]>;
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
export type { ValidateCallback, ValidateExecuteRule, ValidateExecuteValidator, ValidateFieldsError, ValidateInternalRuleItem, ValidateInternalValidateMessages, ValidateMessages, ValidateResult, ValidateRuleType, ValidateRuleValuePackage, ValidateValue, ValidateValues, };
declare function getErrorDataJSON(messageJSON: ErrorDataJSON): string;
/** 校验工具 */
declare const validateUtil: {
    /**
     * 获取校验器
     * @param rules 校验规则
     * @returns 校验器
     */
    getSchema: (rules: ValidateOptionRules, options?: ValidateOption | undefined) => ValidateSchema;
    getErrorMessage: (error: unknown, options?: GetErrorsOptions | undefined) => any;
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
    getErrors: (error: unknown, options?: GetErrorsOptions | undefined) => ValidateError[] | {
        data: ErrorDataJSON;
        message: any;
        model: string;
        field?: string | undefined;
        fieldValue?: any;
    }[];
    transform: (values: ValidateValues, rules?: ValidateOptionRules | undefined) => {};
    /**
     * 校验数据
     * @param rules 校验规则
     * @param data 数据
     * @returns 校验结果
     */
    validate: (rules: ValidateOptionRules, values: ValidateValues, options?: ValidateOption | undefined, callback?: ValidateCallback | undefined) => Promise<ValidateResponse>;
    recursiveGetLocaleRules: (rules: ValidateRules, options?: GetLocaleRulesOptions) => ValidateRules;
    getLocaleRules: (rules: ValidateRules, options?: GetLocaleRulesOptions) => ValidateRules;
    getRules: (rules: ValidateOptionRules, initialRules?: ValidateRules, options?: GetRulesOptions | undefined) => ValidateRules;
    parseToRules: (opts: ValidateOptionRule) => ValidateRuleItem[];
    /** 获取规则 */
    getRule(options: ValidateOptionRule): ValidateRuleItem;
    getErrorDataJSON: typeof getErrorDataJSON;
    parseErrorDataJSON: (message?: string | unknown) => ErrorDataJSON;
    collectRulesTransform: (rules: ValidateRules, transforms: Record<string, ValidateTransform[]>, path?: string) => Record<string, ValidateTransform[]>;
    collectRulesRequired: (rules: ValidateRules, requires: Record<string, boolean[]>, path?: string) => Record<string, boolean[]>;
    collectRulesRequiredAssign: (requires: Record<string, boolean[]>, rules: ValidateRules) => void;
    normalizeRules: (rules: ValidateRules) => ValidateRules;
};
export default validateUtil;
export interface ValidatorOptions {
    action: string;
    rules: Record<string, ValidateOptionRule | ValidateOptionRule[]>;
    model?: string;
}
export declare class Validator {
    action: string;
    rules: ValidateRules;
    model: string;
    constructor(options: ValidatorOptions);
    validate(data: ValidateValues, options?: ValidateOption, callback?: ValidateCallback): Promise<ValidateResponse>;
    getLocaleRules(options?: GetLocaleRulesOptions): ValidateRules;
    /** 包装规则 */
    wrapRules(options: WrapRulesOptions): this;
    /** 省略规则 */
    omitRules(options: OmitRulesOptions): this;
}
