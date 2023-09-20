import { LOADMORE_STATUS } from '../../interfaces/common/general';
import { IPagination } from '../interfaces/models/pagination.model';
import { BasicModel } from './basic.model';
export declare const DEFAULT_PER_PAGE = 20;
export interface ILoadOptions {
    /** 默认是push */
    action?: 'append' | 'replace';
}
export declare class Pagination<T extends BasicModel> extends BasicModel implements IPagination {
    __typename: string;
    __classname: string;
    page: number;
    total: number | null;
    list: T[];
    limit: number;
    paginationType: 'page' | 'slice';
    nextCursor: string;
    backCursor: string;
    constructor(obj?: IPagination);
    /** 是否最后一页 */
    get isLastPage(): boolean;
    /** 总页数 */
    get totalPage(): number | null;
    /** 加载更多的状态 */
    get loadMoreStatus(): LOADMORE_STATUS;
    /** 加载数据 */
    load(data: Pagination<T>, options?: ILoadOptions): Pagination<T>;
    /** 还原 */
    reset(): Pagination<T>;
    /** 获取总页数 */
    static getTotalPage(options: {
        total: number | null;
        limit: number | null;
    }): number | null;
    toJSON(): object;
}
