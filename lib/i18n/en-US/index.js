"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var validate_1 = tslib_1.__importDefault(require("./validate"));
var messages = tslib_1.__assign(tslib_1.__assign({}, validate_1.default), { 'AlmightyTool': {
        'DurationFormat': {
            'locale': 'en',
            'default': {
                'year': 'y',
                'day': 'd',
                'hour': 'h',
                'minute': 'm',
                'second': 's'
            },
            'short': {
                'year': 'y',
                'day': 'd',
                'hour': 'h',
                'minute': 'm',
                'second': 's'
            }
        }
    } });
exports.default = messages;
//# sourceMappingURL=index.js.map