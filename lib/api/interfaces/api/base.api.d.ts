export interface ICommonResult<T> {
    /** 是否成功 */
    success?: boolean;
    /** 标识 */
    code?: string;
    /** 信息 */
    message?: string;
    /** 数据 */
    data?: T;
}
/** 分页方式 */
export declare type PAGINATION_TYPE = 'page' | 'slice' | 'all';
/** 分页方向 */
export declare type PAGINATION_MOVE = 'Next' | 'Back';
export interface IPaginationQuery {
    /** 类型: 默认page */
    paginationType?: PAGINATION_TYPE;
    /** 指针: 翻页指针 */
    paginationCursor?: string;
    /** 翻页方向: 默认Next */
    paginationMove?: PAGINATION_MOVE;
    /** 当前页数: 默认1 */
    page?: number;
    /** 每页条数: 默认20 */
    limit?: number;
    /** 总个数: 第2页就不用重新count */
    total?: number;
}
export interface IPaginationData<T> {
    /** 数据列表 */
    list: T[];
    /** 类型 */
    type?: PAGINATION_TYPE;
    /** 总页数 */
    totalPage?: number | null;
    /** 总数量 */
    total?: number | null;
    /** 返回条数 */
    limit?: number;
    /** 当前页数 */
    page?: number;
    /** 向下的游标 */
    nextCursor?: string;
    /** 向上的游标 */
    backCursor?: string;
    /** 游标方向 */
    move?: PAGINATION_MOVE;
}
