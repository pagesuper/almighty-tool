import dateUtil from '../../../src/utils/date-util';

function getDate(str: string): Date {
  return new Date(Date.parse(str));
}

describe('dateUtil.subtract', () => {
  test('unit is year', async () => {
    const date = getDate('2020/09/16 10:28:41');

    expect(dateUtil.subtract(date, 1, 'years')).toEqual(getDate('2019/09/16 10:28:41'));
    expect(dateUtil.subtract(date, -1, 'years')).toEqual(getDate('2021/09/16 10:28:41'));
  });

  test('unit is month', async () => {
    const date = getDate('2020/09/16 10:28:41');

    expect(dateUtil.subtract(date, 1, 'months')).toEqual(getDate('2020/08/16 10:28:41'));
    expect(dateUtil.subtract(date, -1, 'months')).toEqual(getDate('2020/10/16 10:28:41'));

    expect(dateUtil.subtract(date, 13, 'months')).toEqual(getDate('2019/08/16 10:28:41'));
    expect(dateUtil.subtract(date, -13, 'months')).toEqual(getDate('2021/10/16 10:28:41'));
  });

  test('unit is month: 目标月份超出当月的最后一天', async () => {
    const date = getDate('2020/10/31 10:28:41');

    expect(dateUtil.subtract(date, 1, 'months')).toEqual(getDate('2020/09/30 10:28:41'));
    expect(dateUtil.subtract(date, -1, 'months')).toEqual(getDate('2020/11/30 10:28:41'));

    expect(dateUtil.subtract(date, 13, 'months')).toEqual(getDate('2019/09/30 10:28:41'));
    expect(dateUtil.subtract(date, -13, 'months')).toEqual(getDate('2021/11/30 10:28:41'));
  });

  test('unit is month: 目标为2月', async () => {
    const date = getDate('2020/10/31 10:28:41');

    expect(dateUtil.subtract(date, 8, 'months')).toEqual(getDate('2020/02/29 10:28:41'));
    expect(dateUtil.subtract(date, -4, 'months')).toEqual(getDate('2021/02/28 10:28:41'));

    expect(dateUtil.subtract(date, 20, 'months')).toEqual(getDate('2019/02/28 10:28:41'));
    expect(dateUtil.subtract(date, -16, 'months')).toEqual(getDate('2022/02/28 10:28:41'));
  });
});

describe('dateUtil.parse', () => {
  test('转换成功', async () => {
    const expectFn = function (except: string, receive: string) {
      expect(dateUtil.parse(receive)).toEqual(new Date(Date.parse(except)));
    };

    expect(dateUtil.parse(new Date(1262304000000))).toEqual(new Date(1262304000000));
    expectFn('2020-02-28T05:29:10.000Z', '2020-02-28 13:29:10');
    expectFn('2020-02-27T16:00:00.000Z', '2020-02-28');
    expectFn('2020-02-27T16:00:00.000Z', '2020/02/28');
    expectFn('2020-02-27T16:00:00.000Z', '2020/2/28');
    expectFn('2020-02-07T16:00:00.000Z', '2020/2/8');
    expectFn('2020-02-27T16:00:00.000Z', '2020年02月28日');
    expectFn('2020-02-28T05:29:10.000Z', '2020年02月28日 13:29:10');
    expectFn('2020-02-28T05:29:10.000Z', '2020年02月28日  13:29:10');
    expectFn('2021-03-15T16:00:00.000Z', '2021-03-16 00:00:00.0');

    expect(dateUtil.parse('')).toEqual(null);
  });
});

describe('dateUtil.isSameYear', () => {
  test('判断成功', async () => {
    const value = new Date(1262304000000);

    expect(dateUtil.isSameYear(value)).toBe(false);
    expect(dateUtil.isSameYear(value, new Date(1262304001234))).toBe(true);
    expect(dateUtil.isSameYear(new Date())).toBe(true);
  });
});

describe('dateUtil.isSameDate', () => {
  test('判断成功', async () => {
    const value = new Date(1262304000000);

    expect(dateUtil.isSameDate(value)).toBe(false);
    expect(dateUtil.isSameDate(value, new Date(1262304001234))).toBe(true);
    expect(dateUtil.isSameDate(new Date())).toBe(true);
  });
});
