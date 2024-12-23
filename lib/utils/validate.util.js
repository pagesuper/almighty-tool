"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = exports.ValidateSchema = void 0;
var tslib_1 = require("tslib");
var async_validator_1 = (0, tslib_1.__importDefault)(require("async-validator"));
exports.ValidateSchema = async_validator_1.default;
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
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
    /** 获取规则 */
    getRule: function (options) {
        var _this = this;
        var _a, _b, _c;
        var regexpKey = options === null || options === void 0 ? void 0 : options.regexpKey;
        var regexp = (_a = options === null || options === void 0 ? void 0 : options.regexp) !== null && _a !== void 0 ? _a : (regexpKey ? Reflect.get(format_util_1.regExps, regexpKey) : undefined);
        var type = (_b = options === null || options === void 0 ? void 0 : options.type) !== null && _b !== void 0 ? _b : 'string';
        var regexpReversed = (_c = options === null || options === void 0 ? void 0 : options.regexpReversed) !== null && _c !== void 0 ? _c : false;
        var message = (function () {
            var _a;
            if (options.message) {
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
        var rule = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { type: type, message: message });
        if (asyncValidator) {
            rule.asyncValidator = asyncValidator;
        }
        if (options.fields) {
            rule.fields = lodash_1.default.reduce(options.fields, function (result, field, fieldKey) {
                var fields = (Array.isArray(field) ? field : [field]).map(function (field) {
                    return validateUtil.getRule(field);
                });
                Reflect.set(result, fieldKey, fields);
                return result;
            }, {});
        }
        return rule;
    },
};
exports.default = validateUtil;
var Validator = /** @class */ (function () {
    function Validator(options) {
        var _a, _b;
        this.rules = {};
        this.model = 'Base';
        this.action = options.action;
        this.rules = this.loadRules((_a = options.rules) !== null && _a !== void 0 ? _a : {});
        this.model = (_b = options.model) !== null && _b !== void 0 ? _b : this.model;
    }
    Validator.prototype.validate = function (data, options, callback) {
        return validateUtil.validate(this.rules, data, (0, tslib_1.__assign)({ model: this.model }, options), callback);
    };
    Validator.prototype.loadRules = function (rules) {
        var _this = this;
        return lodash_1.default.reduce(rules, function (result, options, fieldKey) {
            var loadedRule = _this.loadRule(options);
            Reflect.set(result, fieldKey, loadedRule);
            return result;
        }, {});
    };
    Validator.prototype.loadRule = function (options) {
        if (options === void 0) { options = {}; }
        if (Array.isArray(options)) {
            return options.map(function (option) {
                return validateUtil.getRule(option);
            });
        }
        return validateUtil.getRule(options);
    };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=validate.util.js.map