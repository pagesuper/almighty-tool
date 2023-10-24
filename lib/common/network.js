"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
var qs_1 = (0, tslib_1.__importDefault)(require("qs"));
// http://axios-js.com/docs/
var axios_1 = (0, tslib_1.__importDefault)(require("axios"));
var deepmerge_1 = (0, tslib_1.__importDefault)(require("deepmerge"));
var lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
var basic_util_1 = (0, tslib_1.__importDefault)(require("../utils/basic.util"));
var general_1 = (0, tslib_1.__importDefault)(require("./general"));
var merge = require('deepmerge');
var DEFAULT_TIMEOUT = 60 * 1000;
var DEFAULT_MAX_REDIRECTS = 5;
var DEFAULT_REQUESTER_KEY = 'tuitui-lib/common/network#DefaultRequester';
var DEFAULT_HEADERS_KEY = 'tuitui-lib/common/network#DefaultHeaders';
var DEFAULT_INTERCEPT_KEY = 'tuitui-lib/common/network#DefaultIntercept';
var DEFAULT_CATCHES_KEY = 'tuitui-lib/common/network#DefaultCatchesKey';
var doReject = function (options, result, reject) {
    if (options.name) {
        result.name = options.name;
    }
    if (typeof options.fail === 'function') {
        options.fail(result);
    }
    if (typeof options.complete === 'function') {
        options.complete(result);
    }
    reject(result);
};
var doRequest = function (newOptions, options, resolve, reject) {
    if (typeof options.beforeFilter === 'function') {
        if (options.beforeFilter(options.options || options)) {
            return doRequestWithCache(newOptions, options, resolve, reject);
        }
    }
    else {
        return doRequestWithCache(newOptions, options, resolve, reject);
    }
};
var getCacheKey = function (cacheKey) {
    return "network.cache.".concat(cacheKey);
};
var doRequestWithCache = function (newOptions, options, resolve, reject) {
    var cached = false;
    /** 默认为false */
    var cachedCancel = options.cachedCancel === true;
    if (options.cacheable === true && options.cacher && options.cacheKey) {
        var cacheKey = getCacheKey(options.cacheKey);
        var cacheInfo = options.cacher.getStorageInfo(cacheKey);
        // 没有过期
        if (!cacheInfo.expired && cacheInfo.value !== null) {
            cached = true;
            if (cachedCancel && cached) {
                doResolve(cacheInfo.value, options, resolve);
            }
            else {
                doNormalize(cacheInfo.value, options);
            }
            if (typeof options.cached === 'function') {
                options.cached(cacheInfo.value);
            }
        }
    }
    if (!cachedCancel || !cached) {
        justDoRequest(newOptions, options, resolve, reject);
    }
};
var doNormalize = function (result, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof options.normalize === 'function')) return [3 /*break*/, 1];
                    result.ndata = result.ndata || {};
                    options.normalize(result);
                    return [3 /*break*/, 4];
                case 1:
                    if (!(typeof options.asyncNormalize === 'function')) return [3 /*break*/, 3];
                    result.ndata = result.ndata || {};
                    return [4 /*yield*/, options.asyncNormalize(result)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    result.ndata = result.data;
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var doResolve = function (result, options, resolve) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var cacheOptions, cacheKey;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!network.getIntercept().normalize(result, options)) return [3 /*break*/, 2];
                    return [4 /*yield*/, doNormalize(result, options)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    resolve(result);
                    if (options.cacheable === true && options.cacher && options.cacheKey) {
                        cacheOptions = options.cacheOptions || { expiresIn: -1 };
                        cacheKey = getCacheKey(options.cacheKey);
                        options.cacher.setStorage(cacheKey, result, cacheOptions);
                    }
                    if (typeof options.success === 'function') {
                        options.success(result);
                    }
                    if (typeof options.complete === 'function') {
                        options.complete(result);
                    }
                    return [2 /*return*/];
            }
        });
    });
};
var justDoRequest = function (newOptions, options, resolve, reject) {
    var _this = this;
    var startAt = new Date().valueOf();
    if (typeof options.beforeRequest === 'function') {
        options.beforeRequest();
    }
    (general_1.default.getDefault(DEFAULT_REQUESTER_KEY) || axios_1.default)
        .request(newOptions)
        .then(function (originRes) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
        var res, statusCode, result, messages, duration;
        var _a, _b;
        return (0, tslib_1.__generator)(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (typeof options.afterRequest === 'function') {
                        options.afterRequest();
                    }
                    res = (Array.isArray(originRes) ? originRes.find(function (r) { return r; }) : originRes);
                    statusCode = (_a = res.status) !== null && _a !== void 0 ? _a : Reflect.get(res, 'statusCode');
                    if (!(statusCode < 400)) return [3 /*break*/, 2];
                    result = {
                        name: options.name,
                        mark: options.mark,
                        errors: [],
                        options: options,
                        errMsg: 'request:ok',
                        statusCode: statusCode,
                        header: (_b = res.headers) !== null && _b !== void 0 ? _b : Reflect.get(res, 'header'),
                        data: res.data,
                        // cookies: res.cookies,
                    };
                    return [4 /*yield*/, doResolve(result, options, resolve)];
                case 1:
                    _c.sent();
                    if (options.printLog !== false) {
                        messages = [];
                        duration = new Date().valueOf() - startAt;
                        messages.push("==> network ok, [".concat(duration, "ms] (").concat(options.method, ") ").concat(options.url));
                        // messages.push(`\n - options is: `, JSON.stringify(options));
                        // messages.push(`\n - result is: `, JSON.stringify(result));
                        messages.push("\n - options is: ", options);
                        messages.push("\n - result is: ", result);
                        console.log.apply(console, messages);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    Reflect.set(res, 'errInfo', "Request failed with status code ".concat(statusCode));
                    // eslint-disable-next-line no-throw-literal
                    throw { response: res };
                case 3: return [2 /*return*/];
            }
        });
    }); })
        .catch(function (error) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        lodash_1.default.entries((general_1.default.getDefault(DEFAULT_CATCHES_KEY) || {})).forEach(function (_a) {
            var _key = _a[0], cacher = _a[1];
            try {
                cacher(error);
                // eslint-disable-next-line no-empty
            }
            catch (_err) { }
        });
        if (typeof options.afterRequest === 'function') {
            options.afterRequest();
        }
        var errInfo = (_j = (_h = (_g = (_f = (_d = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.errInfo) !== null && _b !== void 0 ? _b : (_c = error.response) === null || _c === void 0 ? void 0 : _c.errMsg) !== null && _d !== void 0 ? _d : (_e = error.response) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : error.errInfo) !== null && _g !== void 0 ? _g : error.errMsg) !== null && _h !== void 0 ? _h : error.message) !== null && _j !== void 0 ? _j : error.toString();
        if (options.printError !== false) {
            var messages = [];
            var duration = new Date().valueOf() - startAt;
            messages.push("==> network fail, [".concat(duration, "ms] ").concat(options.method, " ").concat(options.url));
            messages.push("\n - options is: ", options);
            if (error.response) {
                messages.push('\n - response is: ', error.response);
            }
            if (error.stack) {
                messages.push('\n - stack is: ', error.stack);
            }
            console.error.apply(console, messages);
        }
        /**
         * 失败的请求处理
         */
        if (error.response) {
            /**
             * 有响应的失败处理
             */
            var result = {
                errors: [
                    {
                        path: 'base.network',
                        message: errInfo,
                        info: 'request:fail',
                    },
                ],
                options: options,
                errMsg: 'request:fail',
                errInfo: errInfo,
                statusCode: (_k = error.response.status) !== null && _k !== void 0 ? _k : Reflect.get(error.response, 'statusCode'),
                header: (_l = error.response.headers) !== null && _l !== void 0 ? _l : Reflect.get(error.response, 'header'),
                data: error.response.data,
                cookies: error.response.cookies,
            };
            doReject(options, result, reject);
        }
        else {
            /** 无响应的失败处理 */
            var result = {
                errors: [
                    {
                        path: 'base.network',
                        message: errInfo,
                        info: 'request:fail',
                    },
                ],
                options: options,
                errMsg: 'request:fail',
                errInfo: errInfo,
            };
            doReject(options, result, reject);
        }
    });
};
var network = {
    /** 设置默认的请求器 */
    setDefaultRequester: function (requester) {
        general_1.default.setDefault(DEFAULT_REQUESTER_KEY, requester);
    },
    /** 设置默认的请求头 */
    setDefaultHeaders: function (headers) {
        var _a;
        general_1.default.setDefault(DEFAULT_HEADERS_KEY, lodash_1.default.merge((_a = general_1.default.getDefault(DEFAULT_HEADERS_KEY)) !== null && _a !== void 0 ? _a : {}, headers));
    },
    /** 移除默认的请求头 */
    removeDefaultHeaders: function (headerKeys) {
        var _a;
        general_1.default.setDefault(DEFAULT_HEADERS_KEY, lodash_1.default.omit((_a = general_1.default.getDefault(DEFAULT_HEADERS_KEY)) !== null && _a !== void 0 ? _a : {}, headerKeys));
    },
    addDefaultCatch: function (options) {
        var _a;
        general_1.default.setDefault(DEFAULT_CATCHES_KEY, lodash_1.default.merge((_a = general_1.default.getDefault(DEFAULT_CATCHES_KEY)) !== null && _a !== void 0 ? _a : {}, options));
    },
    removeDefaultCatch: function (keys) {
        var _a;
        general_1.default.setDefault(DEFAULT_CATCHES_KEY, lodash_1.default.omit((_a = general_1.default.getDefault(DEFAULT_CATCHES_KEY)) !== null && _a !== void 0 ? _a : {}, keys));
    },
    /** 设置拦截功能 */
    setIntercept: function (interceptOptions) {
        general_1.default.setDefault(DEFAULT_INTERCEPT_KEY, interceptOptions);
    },
    /** 获取拦截功能 */
    getIntercept: function () {
        return (general_1.default.getDefault(DEFAULT_INTERCEPT_KEY) || {
            normalize: function (_result, _options) {
                return false;
            },
        });
    },
    /** 格式化请求参数 */
    normalizeRequestOptions: function (options) {
        var _a;
        var maxRedirects = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'maxRedirects'), DEFAULT_MAX_REDIRECTS);
        var defaultLocale = typeof navigator !== 'undefined' && navigator.language ? navigator.language : undefined;
        var locale = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'locale'), defaultLocale);
        var method = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'method'), 'GET');
        var timeout = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'timeout'), DEFAULT_TIMEOUT);
        var dataType = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'dataType'), null);
        var headers = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'header'), {});
        var data = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'data'), null);
        var newData;
        if (options && options.options) {
            Reflect.set(options, 'options', lodash_1.default.cloneDeep(options.options));
        }
        var params = lodash_1.default.omit(merge(options.fixedParams || {}, options.params || {}), options.omitParamKeys || []);
        switch (dataType) {
            case 'form-urlencoded':
                newData = data;
                Reflect.set(headers, 'Content-Type', 'application/x-www-form-urlencoded');
                break;
            default:
                newData = data;
                break;
        }
        if (options.ijt !== false) {
            Reflect.set(params, '_ijt', general_1.default.generateIjt());
        }
        if (typeof options.before === 'function') {
            options.before();
        }
        var url = "".concat(options.baseUrl || '').concat(options.url || '');
        if (basic_util_1.default.isPresent(params)) {
            var queryString = qs_1.default.stringify(params, {
                arrayFormat: options.paramsArrayFormat || 'brackets',
            });
            url = basic_util_1.default.buildUrl(url, queryString);
        }
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, lodash_1.default.pick(options, [
            'dataType',
            'responseType',
            'transformRequest',
            'transformResponse',
            'timeout',
            'timeoutErrorMessage',
            'withCredentials',
            'auth',
            'xsrfCookieName',
            'xsrfHeaderName',
            'onUploadProgress',
            'onDownloadProgress',
            'maxContentLength',
            'validateStatus',
            'socketPath',
            'httpAgent',
            'httpsAgent',
            'proxy',
            'cancelToken',
        ])), { locale: locale, url: url, method: method, headers: (0, deepmerge_1.default)((_a = general_1.default.getDefault(DEFAULT_HEADERS_KEY)) !== null && _a !== void 0 ? _a : {}, headers), data: newData, timeout: timeout, maxRedirects: maxRedirects });
    },
    /**
     * 发起请求
     */
    request: function (options) {
        var newOptions = network.normalizeRequestOptions(options);
        return new Promise(function (resolve, reject) {
            if (options.skipValidate !== true && typeof options.validate === 'function') {
                var result = options.validate(options.options || options);
                if (result.errors.length === 0) {
                    doRequest(newOptions, options, resolve, reject);
                }
                else {
                    doReject(options, result, reject);
                }
            }
            else {
                doRequest(newOptions, options, resolve, reject);
            }
        });
    },
    /**
     * 发起GraphQL请求
     */
    requestGraphQL: function (options) {
        var data = {
            operationName: basic_util_1.default.ifUndefinedThen(options.operationName, null),
            query: options.query,
            variables: options.variables,
        };
        return this.request((0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { data: data }));
    },
};
exports.default = network;
//# sourceMappingURL=network.js.map