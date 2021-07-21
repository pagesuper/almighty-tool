"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
exports.default = {
    styleToString: function (style) {
        var styles = [];
        lodash_1.default.each(style, function (value, key) {
            if (value !== null && value !== false) {
                styles.push(key + ": " + value);
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
                        errMsg: 'setClipboardData:ok'
                    });
                    isOk = true;
                }
            }
            catch (error) {
                if (options && typeof options.fail === 'function') {
                    options.fail({
                        data: data,
                        errMsg: 'setClipboardData:fail'
                    });
                }
            }
            finally {
                if (options && typeof options.complete === 'function') {
                    if (isOk) {
                        options.complete({
                            data: data,
                            errMsg: 'setClipboardData:ok'
                        });
                    }
                    else {
                        options.complete({
                            data: data,
                            errMsg: 'setClipboardData:fail'
                        });
                    }
                }
            }
        }
        else {
            if (typeof options !== 'undefined' && typeof options.fail === 'function') {
                options.fail({
                    data: data,
                    errMsg: 'setClipboardData:fail'
                });
            }
            if (typeof options !== 'undefined' && typeof options.complete === 'function') {
                options.complete({
                    data: data,
                    errMsg: 'setClipboardData:fail'
                });
            }
        }
    },
    /** 根据baseUrl and queryString构造URL */
    buildUrl: function (url, queryString) {
        if (queryString) {
            if (url.includes('?')) {
                if (url.endsWith('&')) {
                    return "" + url + queryString;
                }
                else {
                    return url + "&" + queryString;
                }
            }
            else {
                return url + "?" + queryString;
            }
        }
        else {
            return url;
        }
    },
    /** 如果未定义则转为null */
    undefinedToNull: function (value) {
        return typeof value === 'undefined' ? null : value;
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
};
//# sourceMappingURL=basic-util.js.map