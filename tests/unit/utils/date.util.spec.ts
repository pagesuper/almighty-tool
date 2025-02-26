import assert from 'power-assert';
import dateUtil from '../../../src/utils/date.util';

function getDate(str: string): Date {
  return new Date(Date.parse(str));
}

describe('dateUtil.subtract', () => {
  test('unit is year', async () => {
    const date = getDate('2020/09/16 10:28:41');

    assert.deepEqual(dateUtil.subtract(date, 1, 'years'), getDate('2019/09/16 10:28:41'));
    assert.deepEqual(dateUtil.subtract(date, -1, 'years'), getDate('2021/09/16 10:28:41'));
  });

  test('unit is month', async () => {
    const date = getDate('2020/09/16 10:28:41');

    assert.deepEqual(dateUtil.subtract(date, 1, 'months'), getDate('2020/08/16 10:28:41'));
    assert.deepEqual(dateUtil.subtract(date, -1, 'months'), getDate('2020/10/16 10:28:41'));

    assert.deepEqual(dateUtil.subtract(date, 13, 'months'), getDate('2019/08/16 10:28:41'));
    assert.deepEqual(dateUtil.subtract(date, -13, 'months'), getDate('2021/10/16 10:28:41'));
  });

  test('unit is month: 目标月份超出当月的最后一天', async () => {
    const date = getDate('2020/10/31 10:28:41');

    assert.deepEqual(dateUtil.subtract(date, 1, 'months'), getDate('2020/09/30 10:28:41'));
    assert.deepEqual(dateUtil.subtract(date, -1, 'months'), getDate('2020/11/30 10:28:41'));

    assert.deepEqual(dateUtil.subtract(date, 13, 'months'), getDate('2019/09/30 10:28:41'));
    assert.deepEqual(dateUtil.subtract(date, -13, 'months'), getDate('2021/11/30 10:28:41'));
  });

  test('unit is month: 目标为2月', async () => {
    const date = getDate('2020/10/31 10:28:41');

    assert.deepEqual(dateUtil.subtract(date, 8, 'months'), getDate('2020/02/29 10:28:41'));
    assert.deepEqual(dateUtil.subtract(date, -4, 'months'), getDate('2021/02/28 10:28:41'));

    assert.deepEqual(dateUtil.subtract(date, 20, 'months'), getDate('2019/02/28 10:28:41'));
    assert.deepEqual(dateUtil.subtract(date, -16, 'months'), getDate('2022/02/28 10:28:41'));
  });
});

// describe('dateUtil.parse', () => {
//   test('转换成功', async () => {
//     const assertCall = (except: string, receive: string) => {
//       assert.deepEqual(dateUtil.parse(receive), new Date(Date.parse(except)));
//     };

//     assertCall('2020-02-28T05:29:10.000Z', '2020-02-28 13:29:10');
//     assertCall('2020-02-27T16:00:00.000Z', '2020-02-28');
//     assertCall('2020-02-27T16:00:00.000Z', '2020/02/28');
//     assertCall('2020-02-27T16:00:00.000Z', '2020/2/28');
//     assertCall('2020-02-07T16:00:00.000Z', '2020/2/8');
//     assertCall('2020-02-27T16:00:00.000Z', '2020年02月28日');
//     assertCall('2020-02-28T05:29:10.000Z', '2020年02月28日 13:29:10');
//     assertCall('2020-02-28T05:29:10.000Z', '2020年02月28日  13:29:10');
//     assertCall('2021-03-15T16:00:00.000Z', '2021-03-16 00:00:00.0');

//     assert.deepEqual(dateUtil.parse(new Date(1262304000000)), new Date(1262304000000));
//     assert.equal(dateUtil.parse(''), null);
//   });
// });

describe('dateUtil.isSameYear', () => {
  test('判断成功', async () => {
    const value = new Date(1262304000000);

    assert.equal(dateUtil.isSameYear(value), false);
    assert.equal(dateUtil.isSameYear(value, new Date(1262304001234)), true);
    assert.equal(dateUtil.isSameYear(new Date()), true);
  });
});

describe('dateUtil.isSameDate', () => {
  test('判断成功', async () => {
    const value = new Date(1262304000000);

    assert.equal(dateUtil.isSameDate(value), false);
    assert.equal(dateUtil.isSameDate(value, new Date(1262304001234)), true);
    assert.equal(dateUtil.isSameDate(new Date()), true);
  });
});
