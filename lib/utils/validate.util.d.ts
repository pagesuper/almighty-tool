import ValidateSchema, { ValidateError as OriginalValidateError, ValidateOption as OriginalValidateOption, RuleItem as OriginalValidateRuleItem, ValidateCallback, ExecuteRule as ValidateExecuteRule, ExecuteValidator as ValidateExecuteValidator, ValidateFieldsError, InternalRuleItem as ValidateInternalRuleItem, InternalValidateMessages as ValidateInternalValidateMessages, ValidateMessages, ValidateResult, RuleType as ValidateRuleType, RuleValuePackage as ValidateRuleValuePackage, Value as ValidateValue, Values as ValidateValues } from 'async-validator';
import { I18n } from '../i18n/index';
export type ValidateTrigger = 'blur' | 'change' | Array<'change' | 'blur'>;
export type ValidateTransform = (value: ValidateValue) => ValidateValue;
export type ValidateTransformer = 'toDate' | 'toBoolean' | 'trim' | 'trimLeft' | 'trimRight' | 'trimStart' | 'trimEnd' | 'toLower' | 'toUpper' | 'tryToNumber' | 'toNumber' | 'firstLetterUpper' | 'firstLetterLower' | 'capitalize' | 'camelize' | 'dasherize' | 'underscore' | 'pluralize' | 'singularize' | 'humanize';
export interface ParseRulesOptions {
    /**
     * 方向:
     * - prefix: 前缀
     * - suffix: 后缀(默认)
     */
    direction?: 'prefix' | 'suffix';
    /** 设置 */
    settings?: Record<string, ValidateOptionSetting>;
}
export interface ValidateOptionSetting {
    /** 禁用字段: 默认都是false */
    disabled?: boolean;
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
    /** 字段设置 */
    settings?: Record<string, ValidateOptionSetting>;
    /** 忽略的字段 */
    omitKeys?: string[];
    /** 选取的字段 */
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
    /** 子类型 */
    subType?: string;
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
}
export type ValidateRule = ValidateRuleItem | ValidateRuleItem[];
export type ValidateRules = Record<string, ValidateRule>;
export interface ValidateOptionRule extends Omit<ValidateRuleItem, 'fields'> {
    /** 子规则 */
    fields?: Record<string, ValidateOptionRule | ValidateOptionRule[]>;
}
export interface ParseRuleOptions {
    /** 是否解析转换器: 默认false */
    parseTransformers?: boolean;
    /** 是否解析异步校验器: 默认false */
    parseAsyncValidator?: boolean;
    /** 是否解析子字段: 默认false */
    parseSubFields?: boolean;
}
export interface GetRulesOptions {
    /** 字段设置 */
    settings?: Record<string, ValidateOptionSetting>;
}
export interface GetLocaleRulesOptions extends GetRulesOptions {
    /** 国际化 */
    i18n?: I18n;
    /** 语言 */
    lang?: string;
    /**
     * 是否扁平化
     * - true: 扁平化  eg. { user: { name: 'jack } } => { user.name: 'jack' }
     * - false: 不扁平化(默认)
     */
    flat?: boolean;
    /** 对象数组项是否转换 */
    objectArrayItemsTransform?: boolean;
    /** 数据 */
    values?: ValidateValues;
}
export type ValidateOptionRules = Record<string, ValidateOptionRule | ValidateOptionRule[]>;
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
export declare class ValidateResponseInstance<T extends ValidateValues = ValidateValues> implements ValidateResponse {
    /** 是否成功 */
    success: boolean;
    /** 错误信息 */
    errors?: ValidateError[];
    /** 数据 */
    values?: T;
    constructor(options: ValidateResponse);
    /**
     * 添加错误
     * @param error 错误
     */
    addError(error: ValidateError): void;
}
export interface ErrorDataJSON {
    rules: Partial<ValidateOptionRule>;
    message: any;
}
export declare const ARRAY_ITEMS_BASIC_TYPE_KEY = "__items__";
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
    getSchema: (rules: ValidateOptionRules, options?: ValidateOption) => ValidateSchema;
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
    getErrorMessage: (error: unknown, options?: GetErrorsOptions) => any;
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
    getErrors: (error: unknown, options?: GetErrorsOptions) => ValidateError[] | {
        field: string | undefined;
        fieldValue: any;
        data: ErrorDataJSON;
        message: any;
        model: string;
    }[];
    /**
     * 转换数据
     * @param values 数据
     * @param rules 校验规则
     * @returns 转换后的数据
     */
    transform: (values: ValidateValues, rules?: ValidateOptionRules) => {};
    /**
     * 校验数据
     * @param rules 校验规则
     * @param data 数据
     * @returns 校验结果
     */
    validate<T extends ValidateValues = ValidateValues>(rules: ValidateOptionRules, values: T, options?: ValidateOption, callback?: ValidateCallback): Promise<ValidateResponseInstance<T>>;
    /**
     * 递归获取国际化规则
     * @param rules 校验规则
     * @param flatRules 扁平化校验规则
     * @param options 选项
     * @returns 校验规则
     */
    recursiveGetLocaleRules: (rules: ValidateRules, flatRules: ValidateRules, options?: GetLocaleRulesOptions) => ValidateRules;
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
     * @param options 选项
     * @returns 校验规则
     */
    getRules: (rules: ValidateRules, options?: GetRulesOptions) => ValidateRules;
    /**
     * 获取校验规则
     * @param rules 校验规则
     * @param initialRules 初始校验规则
     * @param options 选项
     * @returns 校验规则
     */
    parseRules: (rules: ValidateOptionRules, initialRules?: ValidateRules, options?: ParseRulesOptions) => ValidateRules;
    /**
     * 解析校验规则
     * @param opts 校验规则
     * @returns 校验规则
     */
    parseToRules: (opts: ValidateOptionRule) => ValidateRuleItem[];
    /**
     * 尝试将值转换为数字
     * @param val 值
     * @returns 数字
     */
    tryToNumber(val: string | number): number;
    /**
     * 获取规则
     * @param options 校验规则
     * @returns 校验规则
     */
    parseRule(options: ValidateOptionRule, parseRuleOptions?: ParseRuleOptions): ValidateRuleItem;
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
    normalizeRules: (rules: ValidateRules, options?: GetRulesOptions) => ValidateRules;
    /** 过滤规则 */
    filterRules: (rules: ValidateRules, settings: Record<string, ValidateOptionSetting>, parentPath?: string) => ValidateRules;
};
export default validateUtil;
export { validateUtil };
/**
 * 校验器选项
 */
export interface ValidatorOptions {
    action: string;
    rules: Record<string, ValidateOptionRule | ValidateOptionRule[]>;
    model?: string;
    settings?: Record<string, ValidateOptionSetting>;
}
/**
 * 校验器
 */
export declare class Validator {
    action: string;
    rules: ValidateRules;
    model: string;
    settings: Record<string, ValidateOptionSetting>;
    constructor(options: ValidatorOptions);
    /**
     * 校验数据
     * @param data 数据
     * @param options 选项
     * @param callback 回调
     * @returns 校验结果
     */
    validate<T extends ValidateValues = ValidateValues>(data: T, options?: ValidateOption, callback?: ValidateCallback): Promise<ValidateResponseInstance<T>>;
    /**
     * 获取国际化规则
     * @param options 选项
     * @returns 校验规则
     */
    getLocaleRules(options?: GetLocaleRulesOptions): ValidateRules;
    getRules(options?: GetRulesOptions): ValidateRules;
    /**
     * 合并设置
     * @param settings 设置
     * @returns 校验器
     */
    mergeSettings(settings?: Record<string, ValidateOptionSetting>): this;
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
