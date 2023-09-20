"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var is_what_1 = require("is-what");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var qs_1 = tslib_1.__importDefault(require("qs"));
exports.default = {
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
    /** 如果未定义则转为null */
    undefinedToNull: function (value) {
        return typeof value === 'undefined' ? null : value;
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
     * 判断对象是否为空
     */
    isBlank: function (object) {
        switch (typeof object) {
            case 'boolean':
                return false;
            case 'function':
                return false;
            case 'number':
                return isNaN(object);
            case 'string':
                return object.trim().length === 0;
            default:
                return lodash_1.default.isEmpty(object);
        }
    },
    /**
     * 判断对象是否不为空
     */
    isPresent: function (object) {
        return !this.isBlank(object);
    },
    /**
     * 判断对象是否为空: 如果为空则取默认值
     */
    ifBlankElse: function (object, defaultValue) {
        return this.isBlank(object) ? object : defaultValue;
    },
    /**
     * 判断对象是否不为空: 如果为空则取默认值
     */
    ifPresentElse: function (object, defaultValue) {
        return this.isPresent(object) ? object : defaultValue;
    },
    /**
     * 如果对象未定义则为默认值
     */
    ifUndefinedThen: function (object, defaultValue) {
        return typeof object !== 'undefined' ? object : defaultValue;
    },
    /** 深拷贝 */
    deepCopy: function (value) {
        return lodash_1.default.cloneDeep(value);
    },
    /**
     *
     * 给一个对象数组进行去重
     *
     * @param objects
     * @param key
     */
    objectsUniqueByKey: function (objects, key) {
        var newObjects = [];
        var cacheObjects = {};
        objects.forEach(function (object) {
            var value = object[key];
            if (typeof Reflect.get(cacheObjects, value) === 'undefined') {
                newObjects.push(object);
                Reflect.set(cacheObjects, value, object);
            }
        });
        return newObjects;
    },
    /**
     *
     * 给一个对象数组按照key来索引
     *
     * @param objects
     * @param key
     */
    objectsIndexByKey: function (objects, key) {
        var newObjects = {};
        objects.forEach(function (object) {
            Reflect.set(newObjects, object[key], object);
        });
        return newObjects;
    },
    /**
     *
     * 给一个对象数组fn进行索引，返回对象
     *
     * @param objects
     * @param fn
     */
    objectsIndexByFn: function (objects, fn) {
        var newObjects = {};
        objects.forEach(function (object) {
            Reflect.set(newObjects, fn(object), object);
        });
        return newObjects;
    },
    /**
     *
     * 给一个对象数组按照key来分组
     *
     * @param objects
     * @param key
     */
    objectsGroupByKey: function (objects, key) {
        var newObjects = {};
        objects.forEach(function (object) {
            var value = object[key];
            var pairObjects = Reflect.get(newObjects, value);
            if (typeof pairObjects === 'undefined') {
                pairObjects = [];
                Reflect.set(newObjects, value, pairObjects);
            }
            pairObjects.push(object);
        });
        return newObjects;
    },
    /**
     *
     * 给一个对象数组按照fn来分组
     *
     * @param objects
     * @param fn
     */
    objectsGroupByFn: function (objects, fn) {
        var newObjects = {};
        objects.forEach(function (object) {
            var value = fn(object);
            var pairObjects = Reflect.get(newObjects, value);
            if (typeof pairObjects === 'undefined') {
                pairObjects = [];
                Reflect.set(newObjects, value, pairObjects);
            }
            pairObjects.push(object);
        });
        return newObjects;
    },
    /** 打乱一个数组 */
    shuffle: function (array) {
        return lodash_1.default.shuffle(array);
    },
    /** 将对象按照特定的key进行排序 */
    sortKeys: function (object, options) {
        if (options === void 0) { options = {}; }
        if (!(0, is_what_1.isPlainObject)(object) && !Array.isArray(object)) {
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
        if (Array.isArray(object)) {
            return deep ? deepSortArray(object) : object.slice();
        }
        return _sortKeys(object);
    },
};
//# sourceMappingURL=basic.util.js.map