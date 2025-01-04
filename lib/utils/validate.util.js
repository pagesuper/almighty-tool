"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = exports.ValidateSchema = void 0;
var tslib_1 = require("tslib");
var async_validator_1 = (0, tslib_1.__importDefault)(require("async-validator"));
exports.ValidateSchema = async_validator_1.default;
var deepmerge_1 = (0, tslib_1.__importDefault)(require("deepmerge"));
var inflection_1 = (0, tslib_1.__importDefault)(require("inflection"));
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
var index_1 = require("../i18n/index");
var format_util_1 = require("./format.util");
var SIMPLE_RULE_KEYS = [
    'len',
    'min',
    'max',
    'pattern',
    'regexpKey',
    'regexpReversed',
    'type',
    'required',
    'enum',
    'whitespace',
];
function getErrorDataJSON(messageJSON) {
    return "json:".concat(JSON.stringify(messageJSON));
}
function isPresent(value) {
    return typeof value !== 'undefined' && value !== null;
}
var defaultMessages = {
    default: getErrorDataJSON({ rules: {}, message: 'validate.default.field-is-invalid' }),
    required: getErrorDataJSON({ rules: {}, message: 'validate.default.field-is-required' }),
    enum: getErrorDataJSON({ rules: {}, message: 'validate.default.field-must-be-enum' }),
    whitespace: getErrorDataJSON({ rules: {}, message: 'validate.default.cannot-be-empty' }),
    date: {
        format: getErrorDataJSON({ rules: {}, message: 'validate.date.format-is-invalid' }),
        parse: getErrorDataJSON({ rules: {}, message: 'validate.date.could-not-be-parsed' }),
        invalid: getErrorDataJSON({ rules: {}, message: 'validate.date.is-invalid' }),
    },
    types: {
        string: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-string' }),
        method: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-method' }),
        array: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-array' }),
        object: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-object' }),
        number: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-number' }),
        date: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-date' }),
        boolean: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-boolean' }),
        integer: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-integer' }),
        float: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-float' }),
        regexp: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-regexp' }),
        email: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-email' }),
        url: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-url' }),
        hex: getErrorDataJSON({ rules: {}, message: 'validate.types.must-be-hex' }),
    },
};
/** 校验工具 */
var validateUtil = {
    /**
     * 获取校验器
     * @param rules 校验规则
     * @returns 校验器
     */
    getSchema: function (rules, options) {
        var _a, _b;
        var optionsRules = (_a = options === null || options === void 0 ? void 0 : options.rules) !== null && _a !== void 0 ? _a : {};
        var initialRules = validateUtil.parseRules(rules, {});
        var settings = (_b = options === null || options === void 0 ? void 0 : options.settings) !== null && _b !== void 0 ? _b : {};
        return new async_validator_1.default(validateUtil.normalizeRules(validateUtil.parseRules(optionsRules, initialRules), { settings: settings }));
    },
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
    getErrorMessage: function (error, options) {
        var _a, _b;
        var i18n = (_a = options === null || options === void 0 ? void 0 : options.i18n) !== null && _a !== void 0 ? _a : index_1.i18nConfig.i18n;
        if (typeof error === 'object' && error !== null && ('message' in error || 'msg' in error)) {
            return (_b = Reflect.get(error, 'message')) !== null && _b !== void 0 ? _b : Reflect.get(error, 'msg');
        }
        if (typeof error === 'string') {
            if (i18n && typeof i18n.t === 'function') {
                var messageJSON = validateUtil.parseErrorDataJSON(error);
                return i18n.t(messageJSON.message, {
                    defaultValue: messageJSON.message,
                    args: messageJSON.rules,
                    lang: options === null || options === void 0 ? void 0 : options.lang,
                });
            }
            return error;
        }
        try {
            return JSON.stringify(error);
        }
        catch (err) {
            return error;
        }
    },
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
    getErrors: function (error, options) {
        var _a;
        var model = (_a = options === null || options === void 0 ? void 0 : options.model) !== null && _a !== void 0 ? _a : 'Base';
        if (typeof error === 'object' && error !== null && 'errors' in error) {
            return Reflect.get(error, 'errors').map(function (err) {
                return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, lodash_1.default.pick(err, ['field', 'fieldValue'])), { data: validateUtil.parseErrorDataJSON(err.message), message: validateUtil.getErrorMessage(err.message, options), model: model });
            });
        }
        return [
            {
                data: validateUtil.parseErrorDataJSON(error),
                message: validateUtil.getErrorMessage(error, options),
                fieldValue: options === null || options === void 0 ? void 0 : options.fieldValue,
                field: options === null || options === void 0 ? void 0 : options.field,
                model: model,
            },
        ];
    },
    /**
     * 转换数据
     * @param values 数据
     * @param rules 校验规则
     * @returns 转换后的数据
     */
    transform: function (values, rules) {
        var transforms = validateUtil.collectRulesTransform(rules !== null && rules !== void 0 ? rules : {}, {});
        function doTransform(values, parentPath) {
            return lodash_1.default.transform(values, function (result, value, key) {
                var path = "".concat(parentPath ? "".concat(parentPath, ".") : '').concat(key);
                var transform = transforms[path];
                if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        result[key] = value.map(function (item) {
                            if (transform === null || transform === void 0 ? void 0 : transform.length) {
                                return transform.reduce(function (value, trans) {
                                    return trans(value);
                                }, item);
                            }
                            if (typeof item === 'object') {
                                return doTransform(item, path);
                            }
                            return item;
                        });
                    }
                    else {
                        result[key] = doTransform(value, path);
                    }
                }
                else {
                    if (transform === null || transform === void 0 ? void 0 : transform.length) {
                        result[key] = transform.reduce(function (value, trans) {
                            return trans(value);
                        }, value);
                    }
                    else {
                        result[key] = value;
                    }
                }
                return result[key];
            }, {});
        }
        return doTransform(values, '');
    },
    /**
     * 校验数据
     * @param rules 校验规则
     * @param data 数据
     * @returns 校验结果
     */
    validate: function (rules, values, options, callback) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var model, transformedValues, usingValues, schema, error_1;
        var _a, _b;
        return (0, tslib_1.__generator)(this, function (_c) {
            switch (_c.label) {
                case 0:
                    model = (_a = options === null || options === void 0 ? void 0 : options.model) !== null && _a !== void 0 ? _a : 'Base';
                    transformedValues = values;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    usingValues = lodash_1.default.cloneDeep(values);
                    schema = validateUtil.getSchema(rules, options);
                    transformedValues = validateUtil.transform(usingValues, schema.rules);
                    return [4 /*yield*/, schema.validate(usingValues, (0, deepmerge_1.default)({ messages: defaultMessages }, options !== null && options !== void 0 ? options : {}), callback)];
                case 2:
                    _c.sent();
                    return [2 /*return*/, {
                            success: true,
                            values: transformedValues,
                        }];
                case 3:
                    error_1 = _c.sent();
                    return [2 /*return*/, {
                            success: false,
                            values: transformedValues,
                            errors: validateUtil.getErrors(error_1, { model: model, i18n: (_b = options === null || options === void 0 ? void 0 : options.i18n) !== null && _b !== void 0 ? _b : index_1.i18nConfig.i18n, lang: options === null || options === void 0 ? void 0 : options.lang }),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    /**
     * 递归获取国际化规则
     * @param rules 校验规则
     * @param options 选项
     * @returns 校验规则
     */
    recursiveGetLocaleRules: function (rules, options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        var i18n = (_a = options === null || options === void 0 ? void 0 : options.i18n) !== null && _a !== void 0 ? _a : index_1.i18nConfig.i18n;
        var lang = (_b = options === null || options === void 0 ? void 0 : options.lang) !== null && _b !== void 0 ? _b : index_1.i18nConfig.defaultLang;
        Object.keys(rules).forEach(function (fieldKey) {
            var fieldRules = rules[fieldKey];
            (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach(function (rule) {
                if (i18n && typeof i18n.t === 'function' && typeof rule.message === 'string') {
                    var messageJSON = validateUtil.parseErrorDataJSON(rule.message);
                    rule.data = messageJSON;
                    rule.message = i18n.t(messageJSON.message, {
                        defaultValue: messageJSON.message,
                        args: messageJSON.rules,
                        lang: lang,
                    });
                }
                if (rule.fields) {
                    validateUtil.recursiveGetLocaleRules(rule.fields, { i18n: i18n, lang: lang });
                }
            });
        });
        return rules;
    },
    /**
     * 获取国际化规则
     * @param rules 校验规则
     * @param options 选项
     * @returns 校验规则
     */
    getLocaleRules: function (rules, options) {
        if (options === void 0) { options = {}; }
        return validateUtil.recursiveGetLocaleRules(validateUtil.parseRules(rules, {}), options);
    },
    /**
     * 获取校验规则
     * @param rules 校验规则
     * @param initialRules 初始校验规则
     * @param options 选项
     * @returns 校验规则
     */
    parseRules: function (rules, initialRules, options) {
        if (initialRules === void 0) { initialRules = {}; }
        var mergedRules = lodash_1.default.reduce(rules, function (result, rule, fieldKey) {
            var _a, _b;
            var loadedRules = [];
            (Array.isArray(rule) ? rule : [rule]).forEach(function (option) {
                loadedRules.push.apply(loadedRules, validateUtil.parseToRules((0, tslib_1.__assign)({ path: fieldKey }, option)));
            });
            var previousRules = (_a = Reflect.get(result, fieldKey)) !== null && _a !== void 0 ? _a : [];
            var storedRules = Array.isArray(previousRules) ? previousRules : [previousRules];
            switch ((_b = options === null || options === void 0 ? void 0 : options.direction) !== null && _b !== void 0 ? _b : 'suffix') {
                case 'prefix':
                    storedRules.unshift.apply(storedRules, loadedRules);
                    break;
                case 'suffix':
                default:
                    storedRules.push.apply(storedRules, loadedRules);
                    break;
            }
            Reflect.set(result, fieldKey, storedRules);
            return result;
        }, lodash_1.default.isEmpty(initialRules) ? {} : validateUtil.parseRules(initialRules, {}));
        return validateUtil.normalizeRules(mergedRules, { settings: options === null || options === void 0 ? void 0 : options.settings });
    },
    /**
     * 解析校验规则
     * @param opts 校验规则
     * @returns 校验规则
     */
    parseToRules: function (opts) {
        var rules = [];
        var options = lodash_1.default.cloneDeep(opts);
        if (options.message) {
            rules.push(validateUtil.parseRule(options));
            delete options.message;
        }
        else {
            if (isPresent(options.regexpKey)) {
                rules.push(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.regexpKey;
            }
            if (isPresent(options.enum)) {
                rules.push(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.enum;
            }
            if (isPresent(options.len)) {
                rules.push(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.len;
            }
            if (isPresent(options.min) && isPresent(options.max)) {
                rules.push(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.min;
                delete options.max;
            }
            if (isPresent(options.min)) {
                rules.push(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.min;
            }
            if (isPresent(options.max)) {
                rules.push(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.max;
            }
            if (isPresent(options.pattern)) {
                rules.push(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.pattern;
            }
            if (isPresent(options.whitespace)) {
                rules.push(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.whitespace;
            }
            if (isPresent(options.required)) {
                rules.unshift(validateUtil.parseRule((0, tslib_1.__assign)({}, options)));
                delete options.required;
            }
            if (!lodash_1.default.isEmpty(lodash_1.default.omit(options, ['path', 'data', 'type']))) {
                rules.push(validateUtil.parseRule(options));
            }
        }
        return rules;
    },
    /**
     * 获取规则
     * @param options 校验规则
     * @returns 校验规则
     */
    parseRule: function (options) {
        var _this = this;
        var _a, _b, _c, _d;
        var path = (_a = options === null || options === void 0 ? void 0 : options.path) !== null && _a !== void 0 ? _a : '';
        var regexpKey = options === null || options === void 0 ? void 0 : options.regexpKey;
        var regexp = (_b = options === null || options === void 0 ? void 0 : options.pattern) !== null && _b !== void 0 ? _b : (regexpKey ? Reflect.get(format_util_1.regExps, regexpKey) : undefined);
        var type = (_c = options === null || options === void 0 ? void 0 : options.type) !== null && _c !== void 0 ? _c : (options.fields ? 'object' : 'string');
        var regexpReversed = (_d = options === null || options === void 0 ? void 0 : options.regexpReversed) !== null && _d !== void 0 ? _d : false;
        var message = (function () {
            var _a;
            var pickedRules = lodash_1.default.pick(options, SIMPLE_RULE_KEYS);
            if (pickedRules.pattern) {
                pickedRules.pattern = pickedRules.pattern.toString();
            }
            if (options.message) {
                if (typeof options.message === 'function') {
                    return options.message();
                }
                return options.message;
            }
            if (regexpKey) {
                return validateUtil.getErrorDataJSON({
                    rules: pickedRules,
                    message: "validate.regexp-key.".concat(options.regexpReversed ? 'invalid-reversed' : 'invalid', ":").concat((_a = options.regexpKey) !== null && _a !== void 0 ? _a : 'format'),
                });
            }
            if (options.enum) {
                return validateUtil.getErrorDataJSON({
                    rules: pickedRules,
                    message: "validate.default.field-must-be-enum",
                });
            }
            switch (type) {
                case 'string':
                    // len 存在时，表示固定长度
                    // min 和 max 同时存在时，表示长度范围
                    // min 存在时，表示最小长度
                    // max 存在时，表示最大长度
                    // pattern 存在时，表示正则表达式
                    if (isPresent(options.len)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.string.must-be-exactly-characters',
                        });
                    }
                    if (isPresent(options.min) && isPresent(options.max)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.string.must-be-between-the-range-of-characters',
                        });
                    }
                    if (isPresent(options.min)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.string.must-be-at-least-characters',
                        });
                    }
                    if (isPresent(options.max)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.string.cannot-be-longer-than-characters',
                        });
                    }
                    if (isPresent(options.pattern)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.string.pattern-mismatch',
                        });
                    }
                    if (isPresent(options.whitespace)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.string.cannot-be-empty',
                        });
                    }
                    break;
                case 'number':
                    // len 存在时，表示固定长度
                    // min 和 max 同时存在时，表示范围
                    // min 存在时，表示最小值
                    // max 存在时，表示最大值
                    if (isPresent(options.len)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.number.must-equal',
                        });
                    }
                    if (isPresent(options.min) && isPresent(options.max)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.number.must-be-between-the-range-of-numbers',
                        });
                    }
                    if (isPresent(options.min)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.number.cannot-be-less-than',
                        });
                    }
                    if (isPresent(options.max)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.number.cannot-be-greater-than',
                        });
                    }
                    break;
                case 'array':
                    // len 存在时，表示固定长度
                    // min 和 max 同时存在时，表示范围
                    // min 存在时，表示最小长度
                    // max 存在时，表示最大长度
                    if (isPresent(options.len)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.array.must-be-exactly-array-length',
                        });
                    }
                    if (isPresent(options.min) && isPresent(options.max)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.array.must-be-between-the-range-of-array-length',
                        });
                    }
                    if (isPresent(options.min)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.array.cannot-be-less-than-array-length',
                        });
                    }
                    if (isPresent(options.max)) {
                        return validateUtil.getErrorDataJSON({
                            rules: pickedRules,
                            message: 'validate.array.cannot-be-greater-than-array-length',
                        });
                    }
                    break;
            }
            if (options.required) {
                return validateUtil.getErrorDataJSON({
                    rules: pickedRules,
                    message: 'validate.default.field-is-required',
                });
            }
        })();
        var asyncValidator = (function () {
            if (!regexp && options.asyncValidator === undefined) {
                return undefined;
            }
            return function (rule, value, callback, source, option) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (regexp) {
                                if (regexpReversed) {
                                    if (regexp.test(value)) {
                                        return [2 /*return*/, Promise.reject(message)];
                                    }
                                }
                                else {
                                    if (!regexp.test(value)) {
                                        return [2 /*return*/, Promise.reject(message)];
                                    }
                                }
                            }
                            if (!(typeof options.asyncValidator === 'function')) return [3 /*break*/, 2];
                            return [4 /*yield*/, options.asyncValidator(rule, value, callback, source, option)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [2 /*return*/, Promise.resolve()];
                    }
                });
            }); };
        })();
        var transform = (function () {
            if ((options.transformers && options.transformers.length) || typeof options.transform === 'function') {
                return function (value) {
                    var _a;
                    var newValue = ((_a = options.transformers) !== null && _a !== void 0 ? _a : []).reduce(function (val, transformer) {
                        switch (transformer) {
                            case 'toBoolean':
                                return Boolean(val);
                            case 'toDate':
                                return new Date(val);
                            case 'trim':
                                return val.trim();
                            case 'trimLeft':
                                return val.trimLeft();
                            case 'trimRight':
                                return val.trimRight();
                            case 'trimStart':
                                return val.trimStart();
                            case 'trimEnd':
                                return val.trimEnd();
                            case 'toLower':
                                return val.toLowerCase();
                            case 'toUpper':
                                return val.toUpperCase();
                            case 'toNumber':
                                return Number(val);
                            case 'firstLetterUpper':
                                return val.charAt(0).toUpperCase() + val.slice(1);
                            case 'firstLetterLower':
                                return val.charAt(0).toLowerCase() + val.slice(1);
                            case 'capitalize':
                                return inflection_1.default.capitalize(val);
                            case 'camelize':
                                return inflection_1.default.camelize(val);
                            case 'dasherize':
                                return inflection_1.default.dasherize(val);
                            case 'underscore':
                                return inflection_1.default.underscore(val);
                            case 'pluralize':
                                return inflection_1.default.pluralize(val);
                            case 'singularize':
                                return inflection_1.default.singularize(val);
                            case 'humanize':
                                return inflection_1.default.humanize(val);
                            default:
                                return val;
                        }
                    }, value);
                    if (typeof options.transform === 'function') {
                        newValue = options.transform(newValue);
                    }
                    return newValue;
                };
            }
            return undefined;
        })();
        var rule = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { type: type, message: message, path: path });
        if (asyncValidator) {
            rule.asyncValidator = asyncValidator;
        }
        if (transform) {
            rule.transform = transform;
        }
        if (rule.defaultField) {
            (Array.isArray(rule.defaultField) ? rule.defaultField : [rule.defaultField]).forEach(function (defaultField) {
                defaultField.path = path;
                if (defaultField.fields) {
                    defaultField.fields = lodash_1.default.reduce(defaultField.fields, function (result, field, fieldKey) {
                        var fields = [];
                        (Array.isArray(field) ? field : [field]).forEach(function (field) {
                            fields.push.apply(fields, validateUtil.parseToRules((0, tslib_1.__assign)({ path: "".concat(path, ".").concat(fieldKey) }, field)));
                        });
                        Reflect.set(result, fieldKey, fields);
                        return result;
                    }, {});
                }
            });
        }
        if (options.fields) {
            rule.fields = lodash_1.default.reduce(options.fields, function (result, field, fieldKey) {
                var fields = [];
                (Array.isArray(field) ? field : [field]).forEach(function (field) {
                    fields.push.apply(fields, validateUtil.parseToRules((0, tslib_1.__assign)({ path: "".concat(path, ".").concat(fieldKey) }, field)));
                });
                Reflect.set(result, fieldKey, fields);
                return result;
            }, {});
        }
        return rule;
    },
    /**
     * 获取错误信息
     * @param error 错误信息
     * @param options 选项
     * @returns 错误信息
     */
    getErrorDataJSON: getErrorDataJSON,
    /**
     * 解析错误信息
     * @param message 错误信息
     * @returns 错误信息
     */
    parseErrorDataJSON: function (message) {
        try {
            return JSON.parse("".concat(message !== null && message !== void 0 ? message : '').replace(/^json:/, ''));
        }
        catch (error) {
            return { rules: {}, message: message !== null && message !== void 0 ? message : '' };
        }
    },
    /**
     * 收集规则转换
     * @param rules 校验规则
     * @param transforms 转换规则
     * @param path 路径
     * @returns 转换规则
     */
    collectRulesTransform: function (rules, transforms, path) {
        if (path === void 0) { path = ''; }
        Object.keys(rules).forEach(function (fieldKey) {
            var fieldRules = rules[fieldKey];
            (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach(function (rule) {
                var _a;
                var _b;
                rule.path = (_a = rule.path) !== null && _a !== void 0 ? _a : "".concat(path ? "".concat(path, ".") : '').concat(fieldKey);
                if (rule.type === 'array') {
                    (Array.isArray(rule.defaultField) ? rule.defaultField : [rule.defaultField]).forEach(function (defaultFieldRule) {
                        var _a;
                        if (defaultFieldRule) {
                            if (typeof (defaultFieldRule === null || defaultFieldRule === void 0 ? void 0 : defaultFieldRule.transform) === 'function') {
                                if (defaultFieldRule.path) {
                                    transforms[_a = defaultFieldRule.path] || (transforms[_a] = []);
                                    transforms[defaultFieldRule.path].push(defaultFieldRule.transform);
                                }
                            }
                            if (defaultFieldRule.fields) {
                                validateUtil.collectRulesTransform(defaultFieldRule.fields, transforms, defaultFieldRule.path);
                            }
                        }
                    });
                }
                else {
                    if (typeof rule.transform === 'function') {
                        transforms[_b = rule.path] || (transforms[_b] = []);
                        transforms[rule.path].push(rule.transform);
                    }
                }
                if (rule.fields) {
                    validateUtil.collectRulesTransform(rule.fields, transforms, rule.path);
                }
            });
        });
        return transforms;
    },
    /**
     * 收集规则必填
     * @param rules 校验规则
     * @param requires 必填规则
     * @param path 路径
     * @returns 必填规则
     */
    collectRulesRequired: function (rules, requires, path) {
        if (path === void 0) { path = ''; }
        Object.keys(rules).forEach(function (fieldKey) {
            var fieldRules = rules[fieldKey];
            (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach(function (rule) {
                var _a;
                var _b;
                rule.path = (_a = rule.path) !== null && _a !== void 0 ? _a : "".concat(path ? "".concat(path, ".") : '').concat(fieldKey);
                if (typeof rule.required === 'boolean') {
                    if (rule.path) {
                        requires[_b = rule.path] || (requires[_b] = []);
                        requires[rule.path].push(rule.required);
                    }
                }
                if (rule.fields) {
                    validateUtil.collectRulesRequired(rule.fields, requires, rule.path);
                }
            });
        });
        return requires;
    },
    /**
     * 收集规则必填
     * @param requires 必填规则
     * @param rules 校验规则
     */
    collectRulesRequiredAssign: function (requires, rules) {
        Object.keys(rules).forEach(function (fieldKey) {
            var fieldRules = (Array.isArray(rules[fieldKey]) ? rules[fieldKey] : [rules[fieldKey]]);
            fieldRules.forEach(function (rule, ruleIndex) {
                var _a;
                if (ruleIndex === 0 && rule.path && lodash_1.default.last((_a = requires[rule.path]) !== null && _a !== void 0 ? _a : [])) {
                    rule.required = true;
                    delete requires[rule.path];
                }
                else {
                    delete rule.required;
                }
                if (rule.fields) {
                    validateUtil.collectRulesRequiredAssign(requires, rule.fields);
                }
            });
        });
    },
    /**
     * 规范化规则
     * @param rules 校验规则
     * @returns 校验规则
     */
    normalizeRules: function (rules, options) {
        var _a;
        var settings = (_a = options === null || options === void 0 ? void 0 : options.settings) !== null && _a !== void 0 ? _a : {};
        var pureRules = lodash_1.default.cloneDeep(rules);
        var requires = validateUtil.collectRulesRequired(pureRules, {}, '');
        validateUtil.collectRulesRequiredAssign(requires, pureRules);
        return validateUtil.filterRules(pureRules, settings);
    },
    filterRules: function (rules, settings, parentPath) {
        if (parentPath === void 0) { parentPath = ''; }
        Object.keys(rules !== null && rules !== void 0 ? rules : {}).forEach(function (fieldKey) {
            var fieldRules = rules[fieldKey];
            (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach(function (fieldRule) {
                var _a, _b;
                var path = "".concat(parentPath ? "".concat(parentPath, ".") : '').concat(fieldKey);
                var disabled = (_b = (_a = settings[path]) === null || _a === void 0 ? void 0 : _a.disabled) !== null && _b !== void 0 ? _b : false;
                if (disabled) {
                    delete rules[fieldKey];
                }
                else {
                    if (fieldRule.fields) {
                        validateUtil.filterRules(fieldRule.fields, settings, path);
                    }
                    if (fieldRule.defaultField) {
                        (Array.isArray(fieldRule.defaultField) ? fieldRule.defaultField : [fieldRule.defaultField]).forEach(function (defaultFieldRule) {
                            if (defaultFieldRule === null || defaultFieldRule === void 0 ? void 0 : defaultFieldRule.fields) {
                                if (defaultFieldRule.type === 'object') {
                                    validateUtil.filterRules(defaultFieldRule.fields, settings, path);
                                }
                            }
                        });
                    }
                }
            });
        });
        return rules;
    },
};
exports.default = validateUtil;
/**
 * 校验器
 */
var Validator = /** @class */ (function () {
    function Validator(options) {
        var _a, _b, _c;
        this.rules = {};
        this.model = 'Base';
        this.settings = {};
        this.action = options.action;
        this.rules = validateUtil.parseRules((_a = options.rules) !== null && _a !== void 0 ? _a : {}, this.rules);
        this.model = (_b = options.model) !== null && _b !== void 0 ? _b : this.model;
        this.settings = (_c = options.settings) !== null && _c !== void 0 ? _c : {};
    }
    /**
     * 校验数据
     * @param data 数据
     * @param options 选项
     * @param callback 回调
     * @returns 校验结果
     */
    Validator.prototype.validate = function (data, options, callback) {
        var _a;
        var settings = (0, deepmerge_1.default)(this.settings, (_a = options === null || options === void 0 ? void 0 : options.settings) !== null && _a !== void 0 ? _a : {});
        return validateUtil.validate(this.rules, data, (0, tslib_1.__assign)((0, tslib_1.__assign)({ model: this.model }, options), { settings: settings }), callback);
    };
    /**
     * 获取国际化规则
     * @param options 选项
     * @returns 校验规则
     */
    Validator.prototype.getLocaleRules = function (options) {
        var _a;
        var settings = (0, deepmerge_1.default)(this.settings, (_a = options === null || options === void 0 ? void 0 : options.settings) !== null && _a !== void 0 ? _a : {});
        return validateUtil.getLocaleRules(this.rules, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { settings: settings }));
    };
    /**
     * 合并设置
     * @param settings 设置
     * @returns 校验器
     */
    Validator.prototype.mergeSettings = function (settings) {
        if (settings === void 0) { settings = {}; }
        this.settings = (0, deepmerge_1.default)(this.settings, settings);
        return this;
    };
    /**
     * 包装规则
     * @param options 选项
     * @returns 校验器
     */
    Validator.prototype.wrapRules = function (options) {
        var _a, _b;
        var override = (_a = options.override) !== null && _a !== void 0 ? _a : false;
        var validator = override ? this : lodash_1.default.cloneDeep(this);
        validator.rules = validateUtil.parseRules((_b = options.rules) !== null && _b !== void 0 ? _b : {}, validator.rules, { direction: options.direction });
        return validator;
    };
    /**
     * 省略规则
     * @param options 选项
     * @returns 校验器
     */
    Validator.prototype.omitRules = function (options) {
        var _a;
        var override = (_a = options.override) !== null && _a !== void 0 ? _a : false;
        var validator = override ? this : lodash_1.default.cloneDeep(this);
        validator.rules = lodash_1.default.omit(validator.rules, options.fieldKeys);
        return validator;
    };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=validate.util.js.map