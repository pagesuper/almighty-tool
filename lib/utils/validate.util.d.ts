import ValidateSchema, { ValidateError as OriginalValidateError, ValidateOption as OriginalValidateOption, RuleItem as OriginalValidateRuleItem, ValidateCallback, ExecuteRule as ValidateExecuteRule, ExecuteValidator as ValidateExecuteValidator, ValidateFieldsError, InternalRuleItem as ValidateInternalRuleItem, InternalValidateMessages as ValidateInternalValidateMessages, ValidateMessages, ValidateResult, RuleType as ValidateRuleType, RuleValuePackage as ValidateRuleValuePackage, Value as ValidateValue, Values as ValidateValues } from 'async-validator';
import { I18n } from '../i18n/index';
export declare type ValidateTrigger = 'blur' | 'change' | Array<'change' | 'blur'>;
export declare type ValidateTransform = (value: ValidateValue) => ValidateValue;
export declare type ValidateTransformer = 'toDate' | 'toBoolean' | 'trim' | 'trimLeft' | 'trimRight' | 'trimStart' | 'trimEnd' | 'toLower' | 'toUpper' | 'toNumber' | 'firstLetterUpper' | 'firstLetterLower' | 'capitalize' | 'camelize' | 'dasherize' | 'underscore' | 'pluralize' | 'singularize' | 'humanize';
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
    /** 忽略的字段 */
    omitKeys?: string[];
    /** 选择字段 */
    pickKeys?: string[];
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
    /** 触发时机 */
    trigger?: ValidateTrigger;
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
    /**
     * 转换器
     *
     * - toDate 转为日期对象
     * - toBoolean 转为布尔值
     * - trim 去除首尾空格
     * - trimLeft 去除首空格
     * - trimRight 去除尾空格
     * - trimStart 去除首空格
     * - trimEnd 去除尾空格
     * - toLower 转为小写
     * - toUpper 转为大写
     * - toNumber 转为数字
     * - firstLetterUpper 首字母大写
     * - firstLetterLower 首字母小写
     * - capitalize 首字母大写
     * - camelize 驼峰命名
     * - dasherize 短横线命名
     * - underscore 下划线命名
     * - pluralize 复数
     * - singularize 单数
     * - humanize 人类化
     */
    transformers?: ValidateTransformer[];
    /** 触发时机 */
    trigger?: ValidateTrigger;
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
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
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
    /**
     * 转换数据
     * @param values 数据
     * @param rules 校验规则
     * @returns 转换后的数据
     */
    transform: (values: ValidateValues, rules?: ValidateOptionRules | undefined) => {};
    /**
     * 校验数据
     * @param rules 校验规则
     * @param data 数据
     * @returns 校验结果
     */
    validate: (rules: ValidateOptionRules, values: ValidateValues, options?: ValidateOption | undefined, callback?: ValidateCallback | undefined) => Promise<ValidateResponse>;
    /**
     * 递归获取国际化规则
     * @param rules 校验规则
     * @param options 选项
     * @returns 校验规则
     */
    recursiveGetLocaleRules: (rules: ValidateRules, options?: GetLocaleRulesOptions) => ValidateRules;
    /**
     * 获取国际化规则
     * @param rules 校验规则
     * @param options 选项
     * @returns 校验规则
     */
    getLocaleRules: (rules: ValidateRules, options?: GetLocaleRulesOptions) => ValidateRules;
    /**
     * 获取校验规则
     * @param rules 校验规则
     * @param initialRules 初始校验规则
     * @param options 选项
     * @returns 校验规则
     */
    getRules: (rules: ValidateOptionRules, initialRules?: ValidateRules, options?: GetRulesOptions | undefined) => ValidateRules;
    /**
     * 解析校验规则
     * @param opts 校验规则
     * @returns 校验规则
     */
    parseToRules: (opts: ValidateOptionRule) => ValidateRuleItem[];
    /**
     * 获取规则
     * @param options 校验规则
     * @returns 校验规则
     */
    getRule(options: ValidateOptionRule): ValidateRuleItem;
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
    getErrorDataJSON: typeof getErrorDataJSON;
    /**
     * 解析错误信息
     * @param message 错误信息
     * @returns 错误信息
     */
    parseErrorDataJSON: (message?: string | unknown) => ErrorDataJSON;
    /**
     * 收集规则转换
     * @param rules 校验规则
     * @param transforms 转换规则
     * @param path 路径
     * @returns 转换规则
     */
    collectRulesTransform: (rules: ValidateRules, transforms: Record<string, ValidateTransform[]>, path?: string) => Record<string, ValidateTransform[]>;
    /**
     * 收集规则必填
     * @param rules 校验规则
     * @param requires 必填规则
     * @param path 路径
     * @returns 必填规则
     */
    collectRulesRequired: (rules: ValidateRules, requires: Record<string, boolean[]>, path?: string) => Record<string, boolean[]>;
    /**
     * 收集规则必填
     * @param requires 必填规则
     * @param rules 校验规则
     */
    collectRulesRequiredAssign: (requires: Record<string, boolean[]>, rules: ValidateRules) => void;
    /**
     * 规范化规则
     * @param rules 校验规则
     * @returns 校验规则
     */
    normalizeRules: (rules: ValidateRules) => ValidateRules;
};
export default validateUtil;
/**
 * 校验器选项
 */
export interface ValidatorOptions {
    action: string;
    rules: Record<string, ValidateOptionRule | ValidateOptionRule[]>;
    model?: string;
}
/**
 * 校验器
 */
export declare class Validator {
    action: string;
    rules: ValidateRules;
    model: string;
    constructor(options: ValidatorOptions);
    /**
     * 校验数据
     * @param data 数据
     * @param options 选项
     * @param callback 回调
     * @returns 校验结果
     */
    validate(data: ValidateValues, options?: ValidateOption, callback?: ValidateCallback): Promise<ValidateResponse>;
    /**
     * 获取国际化规则
     * @param options 选项
     * @returns 校验规则
     */
    getLocaleRules(options?: GetLocaleRulesOptions): ValidateRules;
    /**
     * 包装规则
     * @param options 选项
     * @returns 校验器
     */
    wrapRules(options: WrapRulesOptions): this;
    /**
     * 省略规则
     * @param options 选项
     * @returns 校验器
     */
    omitRules(options: OmitRulesOptions): this;
}
