"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var validate_1 = tslib_1.__importDefault(require("./validate"));
var messages = tslib_1.__assign(tslib_1.__assign({}, validate_1.default), { 'AlmightyTool': {
        'DurationFormat': {
            'locale': 'zh-cn',
            'default': {
                'year': '年',
                'day': '天',
                'hour': '小时',
                'minute': '分',
                'second': '秒'
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