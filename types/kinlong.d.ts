/* eslint-disable no-unused-vars */
declare namespace tuitui {
  /**
   * 加载更多的状态值
   *
   * - loading 加载中
   * - more 有更多
   * - noMore 没有更多了
   * - empty 数据为空
   * - fail 加载失败
   */
  export type LOADMORE_STATUS = 'loading' | 'more' | 'noMore' | 'empty' | 'fail';

  export interface ILoadPaginateOptions {
    /**
     * 当前页数
     */
    page: number | 1;

    /**
     * 每页返回条数
     */
    pageSize?: number | 20;
  }

  export interface ILoadSliceOptions {
    /**
     * 偏移方式
     *
     * None: 不移动
     * Next: 向下翻页
     * Back: 向上翻页
     */
    move: 'None' | 'Next' | 'Back';

    /**
     * 开始值
     */
    start: string;

    /**
     * 每页条数
     */
    size: number;
  }
}
