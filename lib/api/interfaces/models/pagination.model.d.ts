import { LOADMORE_STATUS } from '../../../interfaces/common/general';
import { IBasicModel } from './basic.model';
/**
 * 翻页方向
 *
 * - Next=向上滑动
 * - Back=下拉加载
 */
export type SLICE_PAGINATION_MOVE = 'Next' | 'Back';
/** 标准分页器 */
export interface IPagination extends IBasicModel {
    /** 每页条数 */
    limit?: number;
    /** 数据列表 */
    list?: object[];
    /** 加载更多的状态 */
    loadMoreStatus?: LOADMORE_STATUS;
    /** 页数 */
    page?: number;
    /** 总条数 */
    total?: number | null;
    /** 向上的指针 */
    nextCursor?: string;
    /** 向下的指针 */
    backCursor?: string;
}
