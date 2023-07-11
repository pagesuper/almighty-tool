import { Pagination } from '../../../../src/api/models/pagination.model';
import { User } from './basic.model.spec';

export class UsersPagination extends Pagination<User> {}

describe('new User()', () => {
  let user1: User;
  let user2: User;
  let user3: User;

  beforeEach(() => {
    user1 = new User({
      id: 'u001',
      name: 'User 001',
    });

    user2 = new User({
      id: 'u002',
      name: 'User 002',
    });

    user3 = new User({
      id: 'u003',
      name: 'User 003',
    });
  });

  test('成功: 只有1页/当前第1页/每页20个', async () => {
    const users = new UsersPagination({
      limit: 20,
      total: 2,
      page: 1,
      list: [user1, user2],
    });

    expect(users.total).toBe(2);
    expect(users.totalPage).toBe(1);
    expect(users.limit).toBe(20);
    expect(users.page).toBe(1);
    expect(users.isLastPage).toBe(true);
  });

  test('成功: 共3页/当前第2页/每页3个', async () => {
    const users = new UsersPagination({
      limit: 3,
      total: 8,
      page: 2,
      list: [user1, user2, user3],
    });

    expect(users.total).toBe(8);
    expect(users.totalPage).toBe(3);
    expect(users.limit).toBe(3);
    expect(users.page).toBe(2);
    expect(users.isLastPage).toBe(false);
  });

  test('成功: 共3页/当前第3页/每页3个', async () => {
    const users = new UsersPagination({
      limit: 3,
      total: 8,
      page: 3,
      list: [user1, user2],
    });

    expect(users.total).toBe(8);
    expect(users.totalPage).toBe(3);
    expect(users.limit).toBe(3);
    expect(users.page).toBe(3);
    expect(users.isLastPage).toBe(true);
  });
});
