"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringUtil = void 0;
var stringUtil = {
    /**
     * 计算字符串的字节长度
     * @param str - 原始字符串
     * @param options - 计算选项
     * @returns 字节长度
     *
     * @example
     * // 显示模式（默认）：中文=1, 英文=0.5
     * stringUtil.byteLength('你好ab') // 3 (2 + 0.5 + 0.5)
     * stringUtil.byteLength('你好ab', { mode: 'display' }) // 3
     *
     * // UTF-8模式：中文=3, 英文=1
     * stringUtil.byteLength('你好ab', { mode: 'utf8' }) // 8 (3*2 + 1*2)
     *
     * // GBK模式：中文=2, 英文=1
     * stringUtil.byteLength('你好ab', { mode: 'gbk' }) // 6 (2*2 + 1*2)
     */
    byteLength: function (str, options) {
        var _a;
        if (typeof str === 'undefined' || str === null || str === '') {
            return 0;
        }
        var mode = (_a = options === null || options === void 0 ? void 0 : options.mode) !== null && _a !== void 0 ? _a : 'display';
        switch (mode) {
            case 'utf8':
                return stringUtil.utf8ByteLength(str);
            case 'gbk':
                return stringUtil.gbkByteLength(str);
            case 'display':
            default:
                return stringUtil.displayByteLength(str);
        }
    },
    /**
     * 显示宽度计算：中文=1, 英文/半角=0.5
     * 适用于UI显示场景，2个英文字符宽度约等于1个中文字符
     */
    displayByteLength: function (str) {
        var _a;
        var length = 0;
        for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
            var char = str_1[_i];
            var codePoint = (_a = char.codePointAt(0)) !== null && _a !== void 0 ? _a : 0;
            if (stringUtil.isFullWidth(codePoint)) {
                length += 1;
            }
            else {
                length += 0.5;
            }
        }
        return length;
    },
    /**
     * UTF-8字节长度计算
     * 中文=3字节, 英文=1字节
     */
    utf8ByteLength: function (str) {
        return new TextEncoder().encode(str).length;
    },
    /**
     * GBK字节长度计算
     * 中文=2字节, 英文=1字节
     * 注：纯前端环境无法精确计算GBK字节，此为近似实现
     */
    gbkByteLength: function (str) {
        var _a;
        var length = 0;
        for (var _i = 0, str_2 = str; _i < str_2.length; _i++) {
            var char = str_2[_i];
            var codePoint = (_a = char.codePointAt(0)) !== null && _a !== void 0 ? _a : 0;
            if (stringUtil.isFullWidth(codePoint)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    },
    /**
     * 判断字符是否为全角字符
     * 包括：中文、日文、韩文、全角标点、全角字母数字等
     */
    isFullWidth: function (codePoint) {
        return ((codePoint >= 0x4e00 && codePoint <= 0x9fff) ||
            (codePoint >= 0x3400 && codePoint <= 0x4dbf) ||
            (codePoint >= 0x20000 && codePoint <= 0x2a6df) ||
            (codePoint >= 0x2a700 && codePoint <= 0x2b73f) ||
            (codePoint >= 0x2b740 && codePoint <= 0x2b81f) ||
            (codePoint >= 0x2b820 && codePoint <= 0x2ceaf) ||
            (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
            (codePoint >= 0x2f800 && codePoint <= 0x2fa1f) ||
            (codePoint >= 0x3000 && codePoint <= 0x303f) ||
            (codePoint >= 0xff00 && codePoint <= 0xffef) ||
            (codePoint >= 0xac00 && codePoint <= 0xd7af) ||
            (codePoint >= 0x3040 && codePoint <= 0x309f) ||
            (codePoint >= 0x30a0 && codePoint <= 0x30ff));
    },
    /**
     * 高性能字符串截断函数
     * @param str - 原始字符串
     * @param options - 截断配置
     * @returns 截断后的字符串
     *
     * 性能优化点：
     * 1. 快速路径：直接返回满足条件的字符串
     * 2. 避免不必要的计算：提前计算关键变量
     * 3. 最小化字符串操作：使用slice替代substring
     * 4. 优化单词保留逻辑：使用indexOf替代split
     */
    truncate: function (str, options) {
        var _a, _b, _c, _d;
        var length = options.length;
        if (typeof str === 'undefined' || str === null) {
            return '';
        }
        // 快速返回路径：字符串本身已满足长度要求
        if (str.length <= length) {
            return str;
        }
        var position = (_a = options.position) !== null && _a !== void 0 ? _a : 'end';
        var endChars = (_b = options.endChars) !== null && _b !== void 0 ? _b : 4;
        var omission = (_c = options.omission) !== null && _c !== void 0 ? _c : '...';
        var preserveWord = (_d = options.preserveWord) !== null && _d !== void 0 ? _d : false;
        // 计算实际可保留的最大长度（减去省略符长度）
        var omissionLength = omission.length;
        var maxLength = length - omissionLength;
        // 根据是否保留单词选择处理路径
        return preserveWord
            ? stringUtil.preserveWordTruncate(str, { position: position, omission: omission, maxLength: maxLength })
            : stringUtil.simpleTruncate(str, { position: position, omission: omission, maxLength: maxLength, endChars: endChars });
    },
    /**
     * 简单截断处理（不保留单词）
     */
    simpleTruncate: function (str, options) {
        var position = options.position, omission = options.omission, maxLength = options.maxLength, endChars = options.endChars;
        // 使用switch语句优化分支预测
        switch (position) {
            case 'start':
                // 开头截断：保留结尾部分
                return omission + str.slice(-maxLength);
            case 'middle':
                // 中间截断：计算保留的起始和结束位置
                return str.slice(0, Math.max(0, maxLength - endChars)) + omission + str.slice(-endChars);
            case 'end':
            default:
                // 默认结尾截断
                return str.slice(0, maxLength) + omission;
        }
    },
    /**
     * 保留单词的截断处理
     */
    preserveWordTruncate: function (str, options) {
        var position = options.position, omission = options.omission, maxLength = options.maxLength;
        // 查找最近的空格位置（单词边界）
        var spaceIndex = str.lastIndexOf(' ', maxLength);
        // 根据截断位置选择处理方式
        if (position === 'end') {
            // 结尾截断：找到最近的空格位置截断
            return spaceIndex === -1
                ? str.slice(0, maxLength) + omission // 没有空格则强制截断
                : str.slice(0, spaceIndex) + omission;
        }
        if (position === 'start') {
            // 开头截断：从末尾向前找第一个空格
            var spaceIndexFromEnd = str.indexOf(' ', str.length - maxLength);
            return spaceIndexFromEnd === -1
                ? omission + str.slice(-maxLength) // 没有空格则强制截断
                : omission + str.slice(spaceIndexFromEnd + 1);
        }
        // 中间截断（最复杂的情况）
        var half = Math.floor(maxLength / 2);
        // 查找前半部分的最后一个空格
        var firstSpace = str.lastIndexOf(' ', half);
        // 查找后半部分的第一个空格
        var lastSpace = str.indexOf(' ', str.length - half);
        // 处理找不到空格的情况
        if (firstSpace === -1 || lastSpace === -1) {
            return str.slice(0, half) + omission + str.slice(-half);
        }
        // 组合结果：前半部分+省略符+后半部分
        return str.slice(0, firstSpace) + omission + str.slice(lastSpace + 1);
    },
};
exports.stringUtil = stringUtil;
exports.default = stringUtil;
//# sourceMappingURL=string.util.js.map