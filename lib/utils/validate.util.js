"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = exports.ValidateSchema = void 0;
var tslib_1 = require("tslib");
var async_validator_1 = (0, tslib_1.__importDefault)(require("async-validator"));
exports.ValidateSchema = async_validator_1.default;
var deepmerge_1 = (0, tslib_1.__importDefault)(require("deepmerge"));
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
var index_1 = require("../i18n/index");
var format_util_1 = require("./format.util");
var defaultMessages = {
    default: 'validation error',
    required: 'is required',
    enum: 'must be one of enum',
    whitespace: 'cannot be empty',
    date: {
        format: '%s date %s is invalid for format %s',
        parse: '%s date could not be parsed, %s is invalid ',
        invalid: '%s date %s is invalid',
    },
    types: {
        string: 'is not a string',
        method: 'is not a function',
        array: 'is not an array',
        object: 'is not an object',
        number: 'is not a number',
        date: 'is not a date',
        boolean: 'is not a boolean',
        integer: 'is not an integer',
        float: 'is not a float',
        regexp: 'is not a regexp',
        email: 'is not an email',
        url: 'is not a url',
        hex: 'is not a hex',
    },
    string: {
        len: '%s must be exactly %s characters',
        min: '%s must be at least %s characters',
        max: '%s cannot be longer than %s characters',
        range: '%s must be between %s and %s characters',
    },
    number: {
        len: '%s must equal %s',
        min: '%s cannot be less than %s',
        max: '%s cannot be greater than %s',
        range: '%s must be between %s and %s',
    },
    array: {
        len: '%s must be exactly %s in length',
        min: '%s cannot be less than %s in length',
        max: '%s cannot be greater than %s in length',
        range: '%s must be between %s and %s in length',
    },
    pattern: {
        mismatch: '%s value %s does not match pattern %s',
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
        var _a;
        return new async_validator_1.default(validateUtil.normalizeRules(validateUtil.getRules((_a = options === null || options === void 0 ? void 0 : options.rules) !== null && _a !== void 0 ? _a : {}, validateUtil.getRules(rules, {}))));
    },
    getErrorMessage: function (error, options) {
        var _a, _b;
        var i18n = (_a = options === null || options === void 0 ? void 0 : options.i18n) !== null && _a !== void 0 ? _a : index_1.i18nConfig.i18n;
        if (typeof error === 'object' && error !== null && ('message' in error || 'msg' in error)) {
            return (_b = Reflect.get(error, 'message')) !== null && _b !== void 0 ? _b : Reflect.get(error, 'msg');
        }
        if (typeof error === 'string') {
            if (i18n && typeof i18n.t === 'function') {
                var messageJSON = validateUtil.parseMessageJSON(error);
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
                return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, lodash_1.default.pick(err, ['field', 'fieldValue'])), { message: validateUtil.getErrorMessage(err.message, options), model: model });
            });
        }
        return [
            {
                message: validateUtil.getErrorMessage(error, options),
                fieldValue: options === null || options === void 0 ? void 0 : options.fieldValue,
                field: options === null || options === void 0 ? void 0 : options.field,
                model: model,
            },
        ];
    },
    /**
     * 校验数据
     * @param rules 校验规则
     * @param data 数据
     * @returns 校验结果
     */
    validate: function (rules, data, options, callback) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var model, schema, error_1;
        var _a, _b;
        return (0, tslib_1.__generator)(this, function (_c) {
            switch (_c.label) {
                case 0:
                    model = (_a = options === null || options === void 0 ? void 0 : options.model) !== null && _a !== void 0 ? _a : 'Base';
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    schema = validateUtil.getSchema(rules, options);
                    return [4 /*yield*/, schema.validate(data, (0, deepmerge_1.default)({ messages: defaultMessages }, options !== null && options !== void 0 ? options : {}), callback)];
                case 2:
                    _c.sent();
                    return [2 /*return*/, {
                            success: true,
                        }];
                case 3:
                    error_1 = _c.sent();
                    return [2 /*return*/, {
                            success: false,
                            errors: validateUtil.getErrors(error_1, { model: model, i18n: (_b = options === null || options === void 0 ? void 0 : options.i18n) !== null && _b !== void 0 ? _b : index_1.i18nConfig.i18n, lang: options === null || options === void 0 ? void 0 : options.lang }),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getRules: function (rules, initialRules) {
        if (initialRules === void 0) { initialRules = {}; }
        var mergedRules = lodash_1.default.reduce(rules, function (result, rule, fieldKey) {
            var _a;
            var loadedRules = Array.isArray(rule)
                ? rule.map(function (option) { return validateUtil.getRule((0, tslib_1.__assign)({ path: fieldKey }, option)); })
                : [validateUtil.getRule((0, tslib_1.__assign)({ path: fieldKey }, rule))];
            var previousRules = (_a = Reflect.get(result, fieldKey)) !== null && _a !== void 0 ? _a : [];
            var storedRules = Array.isArray(previousRules) ? previousRules : [previousRules];
            storedRules.push.apply(storedRules, loadedRules);
            Reflect.set(result, fieldKey, storedRules);
            return result;
        }, initialRules);
        return mergedRules;
    },
    /** 获取规则 */
    getRule: function (options) {
        var _this = this;
        var _a, _b, _c, _d;
        var path = (_a = options === null || options === void 0 ? void 0 : options.path) !== null && _a !== void 0 ? _a : '';
        var regexpKey = options === null || options === void 0 ? void 0 : options.regexpKey;
        var regexp = (_b = options === null || options === void 0 ? void 0 : options.pattern) !== null && _b !== void 0 ? _b : (regexpKey ? Reflect.get(format_util_1.regExps, regexpKey) : undefined);
        var type = (_c = options === null || options === void 0 ? void 0 : options.type) !== null && _c !== void 0 ? _c : (options.fields ? 'object' : 'string');
        var regexpReversed = (_d = options === null || options === void 0 ? void 0 : options.regexpReversed) !== null && _d !== void 0 ? _d : false;
        var message = (function () {
            var _a;
            var pickedRules = lodash_1.default.pick(options, ['min', 'max', 'len', 'range', 'pattern']);
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
                return "validate.regexp-key.".concat(options.regexpReversed ? 'invalid-reversed' : 'invalid', ":").concat((_a = options.regexpKey) !== null && _a !== void 0 ? _a : 'format');
            }
            switch (type) {
                case 'string':
                    if (typeof options.min !== 'undefined' && typeof options.max !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.string.must-be-between-the-range-of-characters',
                        });
                    }
                    if (typeof options.min !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.string.must-be-at-least-characters',
                        });
                    }
                    if (typeof options.max !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.string.cannot-be-longer-than-characters',
                        });
                    }
                    if (typeof options.len !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.string.must-be-exactly-characters',
                        });
                    }
                    if (typeof options.pattern !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.string.pattern-mismatch',
                        });
                    }
                    break;
                case 'number':
                    if (typeof options.min !== 'undefined' && typeof options.max !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.number.must-be-between-the-range-of-numbers',
                        });
                    }
                    if (typeof options.min !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.number.cannot-be-less-than',
                        });
                    }
                    if (typeof options.max !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.number.cannot-be-greater-than',
                        });
                    }
                    if (typeof options.len !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.number.must-equal',
                        });
                    }
                    break;
                case 'array':
                    if (typeof options.min !== 'undefined' && typeof options.max !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.array.must-be-between-the-range-of-array-length',
                        });
                    }
                    if (typeof options.min !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.array.cannot-be-less-than-array-length',
                        });
                    }
                    if (typeof options.max !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.array.cannot-be-greater-than-array-length',
                        });
                    }
                    if (typeof options.len !== 'undefined') {
                        return validateUtil.getMessageJSON({
                            rules: pickedRules,
                            message: 'validate.array.must-be-exactly-array-length',
                        });
                    }
                    break;
            }
            return undefined;
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
        var rule = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { type: type, message: message, path: path });
        if (asyncValidator) {
            rule.asyncValidator = asyncValidator;
        }
        if (options.fields) {
            rule.fields = lodash_1.default.reduce(options.fields, function (result, field, fieldKey) {
                var fields = (Array.isArray(field) ? field : [field]).map(function (field) {
                    return validateUtil.getRule((0, tslib_1.__assign)({ path: "".concat(path, ".").concat(fieldKey) }, field));
                });
                Reflect.set(result, fieldKey, fields);
                return result;
            }, {});
        }
        return rule;
    },
    getMessageJSON: function (messageJSON) {
        return "json:".concat(JSON.stringify(messageJSON));
    },
    parseMessageJSON: function (message) {
        try {
            return JSON.parse(message.replace(/^json:/, ''));
        }
        catch (error) {
            return { rules: {}, message: message };
        }
    },
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
    normalizeRules: function (rules) {
        var pureRules = lodash_1.default.cloneDeep(rules);
        var requires = validateUtil.collectRulesRequired(pureRules, {}, '');
        validateUtil.collectRulesRequiredAssign(requires, pureRules);
        return pureRules;
    },
};
exports.default = validateUtil;
var Validator = /** @class */ (function () {
    function Validator(options) {
        var _a, _b;
        this.rules = {};
        this.model = 'Base';
        this.action = options.action;
        this.rules = validateUtil.getRules((_a = options.rules) !== null && _a !== void 0 ? _a : {}, this.rules);
        this.model = (_b = options.model) !== null && _b !== void 0 ? _b : this.model;
    }
    Validator.prototype.validate = function (data, options, callback) {
        return validateUtil.validate(this.rules, data, (0, tslib_1.__assign)({ model: this.model }, options), callback);
    };
    Validator.prototype.wrapRules = function (options) {
        var _a, _b;
        var override = (_a = options.override) !== null && _a !== void 0 ? _a : false;
        var validator = override ? this : lodash_1.default.cloneDeep(this);
        validator.rules = validateUtil.getRules((_b = options.rules) !== null && _b !== void 0 ? _b : {}, validator.rules);
        return validator;
    };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=validate.util.js.map