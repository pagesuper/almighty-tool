"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable */
var general_1 = require("./general");
var async_validator_1 = (0, tslib_1.__importDefault)(require("async-validator"));
exports.default = {
    /**
     *
     * @param rules 规则
     * @param source 校验的源
     * @param options 校验选项
     */
    validate: function (rules, source, options) {
        if (options === void 0) { options = {}; }
        var generalResult = options.previousResult || new general_1.GeneralResult();
        var schema = new async_validator_1.default(rules);
        schema.validate(source, options.options || {}, function (errors) {
            (errors || []).forEach(function (error) {
                generalResult.pushError({
                    path: "".concat(options.prefix ? "".concat(options.prefix, ".") : '').concat(error.field),
                    message: error.message || '',
                    info: 'validate.fail',
                });
            });
        });
        return generalResult;
    },
};
//# sourceMappingURL=validator.js.map