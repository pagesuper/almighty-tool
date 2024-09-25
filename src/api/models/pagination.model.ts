import { LOADMORE_STATUS } from '../../interfaces/common/general';
import { IPagination } from '../interfaces/models/pagination.model';
import { BasicModel } from './basic.model';

export const DEFAULT_PER_PAGE = 20;

export interface ILoadOptions {
  /** 默认是push */
  action?: 'append' | 'replace';
}

export class Pagination<T extends BasicModel> extends BasicModel implements IPagination {
  __typename = Pagination.name;

  public page = 1;
  public total: number | null = null;
  public list: T[] = [];
  public limit: number = DEFAULT_PER_PAGE;
  public paginationType: 'page' | 'slice' = 'page';
  public nextCursor = '';
  public backCursor = '';

  constructor(obj?: IPagination) {
    super(obj);
    Object.assign(this, obj);
  }

  /** 是否最后一页 */
  get isLastPage(): boolean {
    if (this.paginationType === 'slice') {
      return this.loadMoreStatus === 'noMore';
    }

    if (this.totalPage !== null && this.page !== null) {
      return this.page >= this.totalPage;
    }

    return false;
  }

  /** 总页数 */
  get totalPage(): number | null {
    if (this.limit !== null && this.total !== null) {
      return Pagination.getTotalPage({
        limit: this.limit,
        total: this.total,
      });
    }

    return null;
  }

  /** 加载更多的状态 */
  get loadMoreStatus(): LOADMORE_STATUS {
    if (this.isLastPage && this.total !== null) {
      if (this.total) {
        return 'noMore';
      } else {
        return 'empty';
      }
    }

    if (this.paginationType === 'slice') {
      return 'noMore';
    }

    return 'more';
  }

  /** 加载数据 */
  load(data: Pagination<T>, options: ILoadOptions = {}): Pagination<T> {
    const action = options.action || 'append';

    // 分片建在或者大于1页的时候，往里推
    if (this.paginationType === 'slice' || (action === 'append' && data.page > 1)) {
      this.list.push(...data.list);

      Object.assign(this, {
        ...data,
        list: this.list,
      });

      return this;
    }

    Object.assign(this, { ...data });

    return this;
  }

  /** 还原 */
  reset(): Pagination<T> {
    return Object.assign(this, {
      list: [],
      page: 1,
      nextCursor: '',
      backCursor: '',
      total: null,
    });
  }

  /** 获取总页数 */
  static getTotalPage(options: { total: number | null; limit: number | null }): number | null {
    if (options.total !== null && options.limit !== null && options.limit > 0) {
      return parseInt(`${(options.total - 1) / options.limit + 1}`, 10);
    } else if (options.total !== null && options.total <= 0) {
      return 0;
    }

    return null;
  }

  public toJSON(): object {
    return Object.assign({}, this, {
      isLastPage: this.isLastPage,
      totalPage: this.totalPage,
      loadMoreStatus: this.loadMoreStatus,
    });
  }
}
