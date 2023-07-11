"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = exports.DEFAULT_PER_PAGE = void 0;
var tslib_1 = require("tslib");
var basic_model_1 = require("./basic.model");
exports.DEFAULT_PER_PAGE = 20;
var Pagination = /** @class */ (function (_super) {
    tslib_1.__extends(Pagination, _super);
    function Pagination(obj) {
        var _this = _super.call(this, obj) || this;
        _this.__typename = Pagination.name;
        _this.__classname = Pagination.name;
        _this.page = 1;
        _this.total = null;
        _this.list = [];
        _this.limit = exports.DEFAULT_PER_PAGE;
        _this.paginationType = 'page';
        _this.nextCursor = '';
        _this.backCursor = '';
        Object.assign(_this, obj);
        return _this;
    }
    Object.defineProperty(Pagination.prototype, "isLastPage", {
        /** 是否最后一页 */
        get: function () {
            if (this.paginationType === 'slice') {
                return this.loadMoreStatus === 'noMore';
            }
            if (this.totalPage !== null && this.page !== null) {
                return this.page >= this.totalPage;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pagination.prototype, "totalPage", {
        /** 总页数 */
        get: function () {
            if (this.limit !== null && this.total !== null) {
                return Pagination.getTotalPage({
                    limit: this.limit,
                    total: this.total,
                });
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pagination.prototype, "loadMoreStatus", {
        /** 加载更多的状态 */
        get: function () {
            if (this.isLastPage && this.total !== null) {
                if (this.total) {
                    return 'noMore';
                }
                else {
                    return 'empty';
                }
            }
            if (this.paginationType === 'slice') {
                return 'noMore';
            }
            return 'more';
        },
        enumerable: false,
        configurable: true
    });
    /** 加载数据 */
    Pagination.prototype.load = function (data, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var action = options.action || 'append';
        // 分片建在或者大于1页的时候，往里推
        if (this.paginationType === 'slice' || (action === 'append' && data.page > 1)) {
            (_a = this.list).push.apply(_a, data.list);
            Object.assign(this, tslib_1.__assign(tslib_1.__assign({}, data), { list: this.list }));
            return this;
        }
        Object.assign(this, tslib_1.__assign({}, data));
        return this;
    };
    /** 还原 */
    Pagination.prototype.reset = function () {
        return Object.assign(this, {
            list: [],
            page: 1,
            nextCursor: '',
            backCursor: '',
            total: null,
        });
    };
    /** 获取总页数 */
    Pagination.getTotalPage = function (options) {
        if (options.total !== null && options.limit !== null && options.limit > 0) {
            return parseInt("".concat((options.total - 1) / options.limit + 1), 10);
        }
        else if (options.total !== null && options.total <= 0) {
            return 0;
        }
        return null;
    };
    Pagination.prototype.toJSON = function () {
        return Object.assign({}, this, {
            isLastPage: this.isLastPage,
            totalPage: this.totalPage,
            loadMoreStatus: this.loadMoreStatus,
        });
    };
    return Pagination;
}(basic_model_1.BasicModel));
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.model.js.map