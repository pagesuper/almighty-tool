import { IBasicModel } from '../../../../src/api/interfaces/models/basic.model';
import { BasicModel } from '../../../../src/api/models/basic.model';

export interface IUser extends IBasicModel {
  /** 用户ID */
  id?: string | null;
  /** 用户名 */
  name?: string | null;
}

/** 用户 */
export class User extends BasicModel implements IUser {
  __typename = User.name;
  __classname = User.name;

  public id: string | null = null;
  public name: string | null = null;

  constructor(obj?: IUser) {
    super(obj);
    BasicModel.assign(this, obj);
  }
}

describe('new User()', () => {
  test('成功', async () => {
    const user = new User({
      id: '1024',
      name: 'Hello World',
    });

    expect(user.id).toBe('1024');
    expect(user.name).toBe('Hello World');
  });

  test('成功: 过滤undefined', async () => {
    const user = new User({
      id: '1024',
      name: undefined,
    });

    expect(user.id).toBe('1024');
    expect(user.name).toBe(null);
  });
});
