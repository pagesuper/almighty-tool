"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var qs_1 = tslib_1.__importDefault(require("qs"));
// http://axios-js.com/docs/
var axios_1 = tslib_1.__importDefault(require("axios"));
var basic_util_1 = tslib_1.__importDefault(require("../utils/basic-util"));
var general_1 = tslib_1.__importDefault(require("./general"));
var deepmerge = require('deepmerge');
var _ = require('lodash');
var DEFAULT_TIMEOUT = 60 * 1000;
var DEFAULT_MAX_REDIRECTS = 5;
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
    return "network.cache." + cacheKey;
};
var doRequestWithCache = function (newOptions, options, resolve, reject) {
    if (options.cacheable === true && options.cacher && options.cacheKey) {
        var cacheKey = getCacheKey(options.cacheKey);
        var cacheInfo = options.cacher.getStorageInfo(cacheKey);
        // 没有过期
        if (!cacheInfo.expired && cacheInfo.value !== null) {
            doNormalize(cacheInfo.value, options);
            if (typeof options.cached === 'function') {
                options.cached(cacheInfo.value);
            }
        }
    }
    justDoRequest(newOptions, options, resolve, reject);
};
var doNormalize = function (result, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var normalized;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    normalized = false;
                    if (typeof options.superNormalize === 'function') {
                        normalized = true;
                        result.ndata = result.ndata || {};
                        options.superNormalize(result);
                    }
                    if (!(typeof options.asyncSuperNormalize === 'function')) return [3 /*break*/, 2];
                    normalized = true;
                    result.ndata = result.ndata || {};
                    return [4 /*yield*/, options.asyncSuperNormalize(result)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (typeof options.normalize === 'function') {
                        normalized = true;
                        result.ndata = result.ndata || {};
                        options.normalize(result);
                    }
                    if (!(typeof options.asyncNormalize === 'function')) return [3 /*break*/, 4];
                    normalized = true;
                    result.ndata = result.ndata || {};
                    return [4 /*yield*/, options.asyncNormalize(result)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!normalized) {
                        result.ndata = result.data;
                    }
                    return [2 /*return*/];
            }
        });
    });
};
var doResolve = function (result, options, resolve) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var cacheOptions, cacheKey;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doNormalize(result, options)];
                case 1:
                    _a.sent();
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
    axios_1.default
        .request(newOptions)
        .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = {
                        name: options.name,
                        mark: options.mark,
                        errors: [],
                        options: options,
                        errMsg: 'request:ok',
                        statusCode: res.status,
                        header: res.headers,
                        data: res.data,
                        cookies: res.cookies,
                    };
                    return [4 /*yield*/, doResolve(result, options, resolve)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(function (error) {
        // 默认为true
        if (options.printError !== false) {
            console.error('network.request fail, options is: ', options, 'error is: ', error);
            if (error.response) {
                console.error('network.request fail, error response is: ', error.response);
            }
            if (error.stack) {
                console.error('network.request fail, error stack is: ', error.stack);
            }
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
                        message: error.toString(),
                        info: 'request:fail',
                    },
                ],
                options: options,
                errMsg: 'request:fail',
                errInfo: error.toString(),
                statusCode: error.response.status,
                header: error.response.headers,
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
                        message: error.toString(),
                        info: 'request:fail',
                    },
                ],
                options: options,
                errMsg: 'request:fail',
                errInfo: error.toString(),
            };
            doReject(options, result, reject);
        }
    });
};
var network = {
    /** 格式化请求参数 */
    normalizeRequestOptions: function (options) {
        var maxRedirects = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'maxRedirects'), DEFAULT_MAX_REDIRECTS);
        var locale = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'locale'), 'zh-CN');
        var method = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'method'), 'GET');
        var timeout = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'timeout'), DEFAULT_TIMEOUT);
        var dataType = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'dataType'), null);
        var headers = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'header'), {});
        var data = basic_util_1.default.ifUndefinedThen(Reflect.get(options, 'data'), null);
        var newData;
        var params = _.omit(deepmerge(options.fixedParams || {}, options.params || {}), options.omitParamKeys || []);
        switch (dataType) {
            case 'form-urlencoded':
                newData = qs_1.default.stringify(data);
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
        var url = "" + (options.baseUrl || '') + (options.url || '');
        if (basic_util_1.default.isPresent(params)) {
            var queryString = qs_1.default.stringify(params, {
                arrayFormat: options.paramsArrayFormat || 'brackets',
            });
            url = basic_util_1.default.buildUrl(url, queryString);
        }
        return tslib_1.__assign(tslib_1.__assign({}, _.pick(options, [
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
        ])), { locale: locale, url: url, method: method, headers: headers, data: newData, timeout: timeout, maxRedirects: maxRedirects });
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
        return this.request(tslib_1.__assign(tslib_1.__assign({}, options), { data: data }));
    },
};
exports.default = network;
//# sourceMappingURL=network.js.map