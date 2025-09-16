"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var base64_js_1 = tslib_1.__importDefault(require("base64-js"));
var is_what_1 = require("is-what");
var lodash_es_1 = require("lodash-es");
var qs_1 = tslib_1.__importDefault(require("qs"));
var basicUtil = {
    uniqueArrayByField: function (arr, options) {
        var _a;
        var field = options.field;
        var uniqueType = (_a = options.uniqueType) !== null && _a !== void 0 ? _a : 'keepFirst';
        var uniqueMap = new Map();
        var keys = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var item = arr_1[_i];
            var key = String(item[field]);
            if (uniqueType === 'keepLast') {
                var index = keys.indexOf(key);
                if (index !== -1) {
                    keys.splice(index, 1);
                }
                uniqueMap.set(key, item);
                keys.push(key);
            }
            else {
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, item);
                    keys.push(key);
                }
            }
        }
        return keys.map(function (key) { return uniqueMap.get(key); });
    },
    isEmpty: function (value) {
        // 处理 null 和 undefined
        if (value === null || value === undefined) {
            return true;
        }
        // 处理字符串
        if (typeof value === 'string') {
            return value.trim().length === 0;
        }
        // 处理数组
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        // 处理 Set/Map
        switch (Object.prototype.toString.call(value)) {
            case '[object Set]':
            case '[object Map]':
                return value.size === 0;
            case '[object Object]':
                return Object.keys(value).length === 0;
        }
        // 其他类型（number, boolean, symbol, function 等）均不为空
        return false;
    },
    isPresent: function (value) {
        return !basicUtil.isEmpty(value);
    },
    isPromise: function (obj) {
        return (obj instanceof Promise || (typeof obj === 'object' && typeof obj.then === 'function' && typeof obj.catch === 'function'));
    },
    /**
     * 获取树的子节点
     * @param compareFn 比较函数
     * @param treeChildren 树节点
     * @returns 子节点
     */
    getTreeChildren: function (compareFn, treeChildren) {
        var _a;
        if (treeChildren === void 0) { treeChildren = []; }
        var nodes = Array.isArray(treeChildren) ? treeChildren : [treeChildren];
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (compareFn(node)) {
                return (_a = node.children) !== null && _a !== void 0 ? _a : [];
            }
            if (node.children) {
                var children = basicUtil.getTreeChildren(compareFn, node.children);
                if (children && children.length) {
                    return children;
                }
            }
        }
        return [];
    },
    /**
     * 获取指定节点的父节点
     * @param compareFn 比较函数，用于匹配目标节点
     * @param treeNodes 树节点数组或单个树节点
     * @returns 父节点，如果未找到则返回 null
     */
    getTreeParent: function (compareFn, treeNodes) {
        if (treeNodes === void 0) { treeNodes = []; }
        var nodes = Array.isArray(treeNodes) ? treeNodes : [treeNodes];
        for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
            var node = nodes_2[_i];
            // 如果当前节点有子节点，检查子节点是否匹配目标节点
            if (node.children) {
                for (var _a = 0, _b = node.children; _a < _b.length; _a++) {
                    var child = _b[_a];
                    if (compareFn(child)) {
                        // 找到目标节点，返回其父节点
                        return node;
                    }
                }
                // 递归检查子节点的子节点
                var parent_1 = this.getTreeParent(compareFn, node.children);
                if (parent_1) {
                    // 在子节点中找到目标节点，返回其父节点
                    return parent_1;
                }
            }
        }
        return null; // 未找到目标节点
    },
    /** 树遍历 */
    treeErgodic: function (treeChildren, callFn, options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        var depth = (_a = options.depth) !== null && _a !== void 0 ? _a : 0;
        var ancestors = (_b = options.ancestors) !== null && _b !== void 0 ? _b : [];
        (Array.isArray(treeChildren) ? treeChildren : [treeChildren]).forEach(function (linkTreeObject) {
            var _a;
            if (typeof callFn === 'function') {
                callFn(linkTreeObject, { depth: depth, ancestors: ancestors });
            }
            if ((_a = linkTreeObject.children) === null || _a === void 0 ? void 0 : _a.length) {
                basicUtil.treeErgodic(linkTreeObject.children, callFn, { depth: depth + 1, ancestors: tslib_1.__spreadArray(tslib_1.__spreadArray([], ancestors, true), [linkTreeObject], false) });
            }
        });
    },
    /** 过滤html标签 */
    escapeHTML: function (str) {
        var escapeChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return str.replace(/[&<>"']/g, function (char) { return escapeChars[char]; });
    },
    /** 将css样式对象转为字符串 */
    cssObjectToString: function (style) {
        var styles = [];
        (0, lodash_es_1.each)(style, function (value, key) {
            if (value !== null && value !== false) {
                styles.push("".concat(key, ": ").concat(value));
            }
        });
        return styles.join('; ');
    },
    /** 文本复制: 暂支持h5端网页版 */
    setClipboardData: function (options) {
        var data = (options || {}).data || '';
        var isOk = false;
        if (typeof document !== 'undefined' && typeof document.createElement !== 'undefined') {
            var textarea = document.createElement('textarea');
            try {
                textarea.value = data;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('Copy');
                document.body.removeChild(textarea);
                if (options && typeof options.success === 'function') {
                    options.success({
                        data: data,
                        errMsg: 'setClipboardData:ok',
                    });
                    isOk = true;
                }
            }
            catch (error) {
                if (options && typeof options.fail === 'function') {
                    options.fail({
                        data: data,
                        errMsg: 'setClipboardData:fail',
                    });
                }
            }
            finally {
                if (options && typeof options.complete === 'function') {
                    if (isOk) {
                        options.complete({
                            data: data,
                            errMsg: 'setClipboardData:ok',
                        });
                    }
                    else {
                        options.complete({
                            data: data,
                            errMsg: 'setClipboardData:fail',
                        });
                    }
                }
            }
        }
        else {
            if (typeof options !== 'undefined' && typeof options.fail === 'function') {
                options.fail({
                    data: data,
                    errMsg: 'setClipboardData:fail',
                });
            }
            if (typeof options !== 'undefined' && typeof options.complete === 'function') {
                options.complete({
                    data: data,
                    errMsg: 'setClipboardData:fail',
                });
            }
        }
    },
    /** 根据baseUrl and queryString构造URL */
    buildUrl: function (url, query) {
        if (query === void 0) { query = {}; }
        var queryString = typeof query === 'string' ? query : qs_1.default.stringify(query);
        if (queryString) {
            if (url.includes('?')) {
                if (url.endsWith('&')) {
                    return "".concat(url).concat(queryString);
                }
                else {
                    return "".concat(url, "&").concat(queryString);
                }
            }
            else {
                return "".concat(url, "?").concat(queryString);
            }
        }
        return url;
    },
    base64Encode: function (value) {
        return base64_js_1.default.fromByteArray(new TextEncoder().encode(value));
    },
    base64Decode: function (value) {
        var decodedBytes = base64_js_1.default.toByteArray(value);
        return new TextDecoder().decode(decodedBytes);
    },
    /** 将一个对象转为查询参数 */
    encodeQuery: function (query) {
        return encodeURIComponent(basicUtil.base64Encode(JSON.stringify(query)));
    },
    /** 将编码后的查询参数解开 */
    decodeQuery: function (str) {
        return JSON.parse(basicUtil.base64Decode(decodeURIComponent(str)));
    },
    /** 睡眠等待毫秒 */
    sleep: function (timeout) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, timeout);
        });
    },
    /** 异步forEach */
    forEachAsync: function (arr, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var length, objectArr, k;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        length = arr.length;
                        objectArr = Object(arr);
                        k = 0;
                        _a.label = 1;
                    case 1:
                        if (!(k < length)) return [3 /*break*/, 4];
                        if (!(k in objectArr)) return [3 /*break*/, 3];
                        return [4 /*yield*/, callback(objectArr[k], k, objectArr)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        k++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     *
     * 给一个对象数组进行去重
     *
     * @param objs
     * @param key
     */
    objectsUniqueByKey: function (objs, key) {
        var newObjs = [];
        var cacheObjs = {};
        objs.forEach(function (obj) {
            var value = Reflect.get(obj, key);
            if (typeof Reflect.get(cacheObjs, value) === 'undefined') {
                newObjs.push(obj);
                Reflect.set(cacheObjs, value, obj);
            }
        });
        return newObjs;
    },
    /**
     *
     * 给一个对象数组按照key来索引
     *
     * @param objs
     * @param key
     */
    objectsIndexByKey: function (objs, key) {
        var newObjs = {};
        objs.forEach(function (obj) {
            Reflect.set(newObjs, Reflect.get(obj, key), obj);
        });
        return newObjs;
    },
    /**
     *
     * 给一个对象数组fn进行索引，返回对象
     *
     * @param objs
     * @param fn
     */
    objectsIndexByFn: function (objs, fn) {
        var newObjs = {};
        objs.forEach(function (obj) {
            Reflect.set(newObjs, fn(obj), obj);
        });
        return newObjs;
    },
    /**
     *
     * 给一个对象数组按照key来分组
     *
     * @param objs
     * @param key
     */
    objectsGroupByKey: function (objs, key) {
        var newObjs = {};
        objs.forEach(function (obj) {
            var value = obj[key];
            var pairObjs = Reflect.get(newObjs, value);
            if (typeof pairObjs === 'undefined') {
                pairObjs = [];
                Reflect.set(newObjs, value, pairObjs);
            }
            pairObjs.push(obj);
        });
        return newObjs;
    },
    /**
     *
     * 给一个对象数组按照fn来分组
     *
     * @param objs
     * @param fn
     */
    objectsGroupByFn: function (objs, fn) {
        var newObjs = {};
        objs.forEach(function (obj) {
            var value = fn(obj);
            var pairObjs = Reflect.get(newObjs, value);
            if (typeof pairObjs === 'undefined') {
                pairObjs = [];
                Reflect.set(newObjs, value, pairObjs);
            }
            pairObjs.push(obj);
        });
        return newObjs;
    },
    /** 将对象按照特定的key进行排序 */
    sortKeys: function (obj, options) {
        if (options === void 0) { options = {}; }
        if (!(0, is_what_1.isPlainObject)(obj) && !Array.isArray(obj)) {
            throw new TypeError('Expected a plain object or array');
        }
        var deep = options.deep, compare = options.compare;
        var seenInput = [];
        var seenOutput = [];
        var deepSortArray = function (array) {
            var seenIndex = seenInput.indexOf(array);
            if (seenIndex !== -1) {
                return seenOutput[seenIndex];
            }
            var result = [];
            seenInput.push(array);
            seenOutput.push(result);
            array.forEach(function (item) {
                if (Array.isArray(item)) {
                    array.push(deepSortArray(item));
                }
                if ((0, is_what_1.isPlainObject)(item)) {
                    array.push(_sortKeys(item));
                }
                array.push(item);
            });
            return result;
        };
        var _sortKeys = function (object) {
            var seenIndex = seenInput.indexOf(object);
            if (seenIndex !== -1) {
                return seenOutput[seenIndex];
            }
            var result = {};
            var keys = Object.keys(object).sort(compare);
            seenInput.push(object);
            seenOutput.push(result);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var value = object[key];
                var newValue = void 0;
                if (deep && Array.isArray(value)) {
                    newValue = deepSortArray(value);
                }
                else {
                    newValue = deep && (0, is_what_1.isPlainObject)(value) ? _sortKeys(value) : value;
                }
                Object.defineProperty(result, key, tslib_1.__assign(tslib_1.__assign({}, Object.getOwnPropertyDescriptor(object, key)), { value: newValue }));
            }
            return result;
        };
        if (Array.isArray(obj)) {
            return deep ? deepSortArray(obj) : obj.slice();
        }
        return _sortKeys(obj);
    },
    /** 获取两个对象的差异 */
    getDifferences: function (obj1, obj2, options) {
        if (options === void 0) { options = {}; }
        function areEqual(value1, value2) {
            if (options.noStrict) {
                if (typeof value1 === 'number' || typeof value2 === 'number') {
                    return String(value1) === String(value2);
                }
                if (typeof value1 === 'boolean' || typeof value2 === 'boolean') {
                    return String(value1) === String(value2);
                }
                if (typeof value1 === 'string' || typeof value2 === 'string') {
                    return String(value1) === String(value2);
                }
            }
            if (typeof value1 !== typeof value2) {
                return false;
            }
            return value1 === value2;
        }
        function implGetDifferences(obj1, obj2, path) {
            if (path === void 0) { path = []; }
            var differences = [];
            if (Array.isArray(obj1) && Array.isArray(obj2)) {
                var maxLength = Math.max(obj1.length, obj2.length);
                for (var i = 0; i < maxLength; i++) {
                    if (i >= obj1.length || i >= obj2.length || !areEqual(obj1[i], obj2[i])) {
                        differences = differences.concat(implGetDifferences(obj1[i], obj2[i], tslib_1.__spreadArray(tslib_1.__spreadArray([], path, true), [i.toString()], false)));
                    }
                }
            }
            else if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
                var keys = new Set(tslib_1.__spreadArray(tslib_1.__spreadArray([], Object.keys(obj1), true), Object.keys(obj2), true));
                for (var _i = 0, _a = Array.from(keys); _i < _a.length; _i++) {
                    var key = _a[_i];
                    differences = differences.concat(implGetDifferences(obj1[key], obj2[key], tslib_1.__spreadArray(tslib_1.__spreadArray([], path, true), [key], false)));
                }
            }
            else if (!areEqual(obj1, obj2)) {
                differences.push(path.join('.'));
            }
            return differences;
        }
        return implGetDifferences(obj1, obj2, []);
    },
    getTextWidth: function (text) {
        if (!text) {
            return 0;
        }
        // ES5 兼容的正则表达式（使用代理对匹配 Emoji 和全角字符）
        var regex = 
        // eslint-disable-next-line no-control-regex, no-misleading-character-class
        /[^\u0000-\u00FF]|[\uD83C-\uD83D][\uDC00-\uDFFF]|[\u20D0-\u20FF\uFE00-\uFE0F]|[\u2600-\u27BF]|[\uD83E\uD83C][\uDD00-\uDDFF]/g;
        return text.replace(regex, 'aa').length;
    },
    /** 空值合并 */
    nullCoalesce: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
            var arg = args_1[_a];
            if (arg !== null && arg !== undefined) {
                return arg;
            }
        }
        return args[args.length - 1]; // 兜底返回最后一个参数（需断言为 T）
    },
};
exports.default = basicUtil;
//# sourceMappingURL=basic.util.js.map