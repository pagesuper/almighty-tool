"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicModel = void 0;
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var BasicModel = /** @class */ (function () {
    function BasicModel(obj) {
        this.__typename = BasicModel.name;
        this.__classname = BasicModel.name;
        BasicModel.assign(this, obj);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    BasicModel.assign = function (target, source) {
        if (source) {
            Object.assign(target, lodash_1.default.pickBy(source, function (value) {
                return typeof value !== 'undefined';
            }));
        }
    };
    BasicModel.prototype.toJSON = function () {
        return Object.assign({}, this, {});
    };
    return BasicModel;
}());
exports.BasicModel = BasicModel;
//# sourceMappingURL=basic.model.js.map