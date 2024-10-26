"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralResult = exports.GeneralError = void 0;
var GeneralError = /** @class */ (function () {
    function GeneralError(error) {
        Object.assign(this, error);
    }
    return GeneralError;
}());
exports.GeneralError = GeneralError;
var GeneralResult = /** @class */ (function () {
    function GeneralResult(options) {
        /** 请求的参数 */
        this.options = {};
        /** 错误 */
        this.errors = [];
        if (options) {
            this.options = options;
        }
    }
    /** 增加错误 */
    GeneralResult.prototype.pushError = function (error) {
        this.errors.push(new GeneralError(error));
    };
    return GeneralResult;
}());
exports.GeneralResult = GeneralResult;
//# sourceMappingURL=general.js.map