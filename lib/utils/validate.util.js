"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = exports.ValidateSchema = void 0;
var tslib_1 = require("tslib");
var async_validator_1 = (0, tslib_1.__importDefault)(require("async-validator"));
exports.ValidateSchema = async_validator_1.default;
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
var i18n_1 = require("../common/i18n");
var format_util_1 = require("./format.util");
/** 校验工具 */
var validateUtil = {
    /**
     * 获取校验器
     * @param rules 校验规则
     * @returns 校验器
     */
    getSchema: function (rules) {
        if (rules instanceof async_validator_1.default) {
            return rules;
        }
        return new async_validator_1.default(rules);
    },
    getErrorMessage: function (error) {
        var _a;
        if (typeof error === 'object' && error !== null && ('message' in error || 'msg' in error)) {
            return (_a = Reflect.get(error, 'message')) !== null && _a !== void 0 ? _a : Reflect.get(error, 'msg');
        }
        if (typeof error === 'string') {
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
                return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, lodash_1.default.pick(err, ['field', 'fieldValue'])), { message: validateUtil.getErrorMessage(err.message), model: model });
            });
        }
        return [
            {
                message: validateUtil.getErrorMessage(error),
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
        var _a;
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    model = (_a = options === null || options === void 0 ? void 0 : options.model) !== null && _a !== void 0 ? _a : 'Base';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    schema = validateUtil.getSchema(rules);
                    return [4 /*yield*/, schema.validate(data, options, callback)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, {
                            success: true,
                        }];
                case 3:
                    error_1 = _b.sent();
                    return [2 /*return*/, {
                            success: false,
                            errors: validateUtil.getErrors(error_1, { model: model }),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getRules: function (rules, initialRules, options) {
        if (initialRules === void 0) { initialRules = {}; }
        if (options === void 0) { options = { i18n: i18n_1.i18nConfig.i18n }; }
        var mergedRules = lodash_1.default.reduce(rules, function (result, rule, fieldKey) {
            var _a, _b;
            var i18n = (_a = options.i18n) !== null && _a !== void 0 ? _a : i18n_1.i18nConfig.i18n;
            var label = i18n.t(fieldKey);
            var loadedRules = Array.isArray(rule)
                ? rule.map(function (option) { return validateUtil.getRule((0, tslib_1.__assign)({ label: label, path: fieldKey }, option)); })
                : [validateUtil.getRule((0, tslib_1.__assign)({ label: label, path: fieldKey }, rule))];
            var previousRules = (_b = Reflect.get(result, fieldKey)) !== null && _b !== void 0 ? _b : [];
            var storedRules = Array.isArray(previousRules) ? previousRules : [previousRules];
            storedRules.push.apply(storedRules, loadedRules);
            Reflect.set(result, fieldKey, storedRules);
            return result;
        }, initialRules);
        return validateUtil.normalizeRules(mergedRules);
    },
    /** 获取规则 */
    getRule: function (options) {
        var _this = this;
        var _a, _b, _c, _d;
        var path = (_a = options === null || options === void 0 ? void 0 : options.path) !== null && _a !== void 0 ? _a : '';
        var regexpKey = options === null || options === void 0 ? void 0 : options.regexpKey;
        var regexp = (_b = options === null || options === void 0 ? void 0 : options.regexp) !== null && _b !== void 0 ? _b : (regexpKey ? Reflect.get(format_util_1.regExps, regexpKey) : undefined);
        var type = (_c = options === null || options === void 0 ? void 0 : options.type) !== null && _c !== void 0 ? _c : (options.fields ? 'object' : 'string');
        var regexpReversed = (_d = options === null || options === void 0 ? void 0 : options.regexpReversed) !== null && _d !== void 0 ? _d : false;
        var message = (function () {
            var _a;
            if (options.message) {
                if (typeof options.message === 'function') {
                    return options.message(options.label);
                }
                return options.message;
            }
            if (regexpKey) {
                return "".concat(options.regexpReversed ? 'InvalidReversed' : 'Invalid', ":").concat((_a = options.regexpKey) !== null && _a !== void 0 ? _a : 'format');
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
    collectRulesRequired: function (requires, rules) {
        Object.keys(rules).forEach(function (fieldKey) {
            var fieldRules = rules[fieldKey];
            (Array.isArray(fieldRules) ? fieldRules : [fieldRules]).forEach(function (rule) {
                var _a;
                if (typeof rule.required === 'boolean') {
                    if (rule.path) {
                        requires[_a = rule.path] || (requires[_a] = []);
                        requires[rule.path].push(rule.required);
                    }
                }
                if (rule.fields) {
                    validateUtil.collectRulesRequired(requires, rule.fields);
                }
            });
        });
        return requires;
    },
    collectRulesRequiredAssign: function (requires, rules) {
        Object.keys(rules).forEach(function (fieldKey) {
            var fieldRules = rules[fieldKey];
            var fieldRulesArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules];
            fieldRulesArray.forEach(function (rule, ruleIndex) {
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
        var requires = validateUtil.collectRulesRequired({}, pureRules);
        validateUtil.collectRulesRequiredAssign(requires, pureRules);
        return pureRules;
    },
};
exports.default = validateUtil;
var Validator = /** @class */ (function () {
    function Validator(options) {
        var _a, _b, _c;
        this.rules = {};
        this.model = 'Base';
        this.action = options.action;
        this.rules = validateUtil.getRules((_a = options.rules) !== null && _a !== void 0 ? _a : {}, this.rules, { i18n: this.getI18n() });
        this.model = (_b = options.model) !== null && _b !== void 0 ? _b : this.model;
        this.i18n = (_c = options.i18n) !== null && _c !== void 0 ? _c : i18n_1.i18nConfig.i18n;
    }
    Validator.prototype.getI18n = function () {
        var _a;
        return (_a = (typeof this.i18n === 'function' ? this.i18n() : this.i18n)) !== null && _a !== void 0 ? _a : i18n_1.i18nConfig.i18n;
    };
    Validator.prototype.validate = function (data, options, callback) {
        var _a;
        return validateUtil.validate(validateUtil.getRules((_a = options === null || options === void 0 ? void 0 : options.rules) !== null && _a !== void 0 ? _a : {}, this.rules, { i18n: this.getI18n() }), data, (0, tslib_1.__assign)({ model: this.model }, options), callback);
    };
    Validator.prototype.wrapRules = function (options) {
        var _a, _b;
        var override = (_a = options.override) !== null && _a !== void 0 ? _a : false;
        var validator = override ? this : lodash_1.default.cloneDeep(this);
        validator.rules = validateUtil.getRules((_b = options.rules) !== null && _b !== void 0 ? _b : {}, validator.rules, { i18n: validator.getI18n() });
        return validator;
    };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=validate.util.js.map