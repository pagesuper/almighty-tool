/* eslint-disable prettier/prettier */
import assert from 'assert';
import dateFormat from '../../../src/formats/date.format';
import MockDate from 'mockdate';

describe('dateFormat', () => {
  test('ok', async () => {
    MockDate.set(new Date('2020-02-28T13:29:10.000+08:00'));
    const now = new Date();
    assert.strictEqual(dateFormat.format(now, { formatter: 'fromNow' }), '几秒前');
    assert.strictEqual(dateFormat.format(now, { formatter: 'step' }), '下午1:29');
    assert.strictEqual(dateFormat.format('2020-02-27T03:29:10.000+08:00', { formatter: 'step' }), '昨天 凌晨3:29');
    assert.strictEqual(dateFormat.format('2020-02-27T13:29:10.000+08:00', { formatter: 'step' }), '昨天 下午1:29');
    assert.strictEqual(dateFormat.format('2020-01-28T13:29:10.000+08:00', { formatter: 'step' }), '1月28日 下午1:29');
    assert.strictEqual(dateFormat.format('2019-12-28T13:29:10.000+08:00', { formatter: 'step' }), '2019年12月28日 下午1:29');
    assert.strictEqual(dateFormat.format('2020-12-28T13:29:10.000+08:00', { formatter: 'step' }), '12月28日 下午1:29');
    assert.strictEqual(dateFormat.format('2020-12-08T13:29:10.000+08:00', { formatter: 'step' }), '12月8日 下午1:29');
    assert.strictEqual(dateFormat.format('2021-02-28T13:29:10.000+08:00', { formatter: 'step' }), '2021年2月28日 下午1:29');
    assert.strictEqual(dateFormat.format('2020-02-29T13:29:10.000+08:00', { formatter: 'step' }), '明天 下午1:29');
    assert.strictEqual(dateFormat.format('2020-03-01T13:29:10.000+08:00', { formatter: 'step' }), '3月1日 下午1:29');
    assert.strictEqual(dateFormat.format('2020-02-29T23:29:10.000+08:00', { formatter: 'step' }), '明天 晚上11:29');

    assert.strictEqual(dateFormat.format(now, { formatter: 'fromNow' }), '几秒前');
    assert.strictEqual(dateFormat.format(now, { formatter: 'shortStep' }), '13:29');
    assert.strictEqual(dateFormat.format('2020-02-27T03:29:10.000+08:00', { formatter: 'shortStep' }), '昨天 03:29');
    assert.strictEqual(dateFormat.format('2020-02-27T13:29:10.000+08:00', { formatter: 'shortStep' }), '昨天 13:29');
    assert.strictEqual(dateFormat.format('2020-01-28T13:29:10.000+08:00', { formatter: 'shortStep' }), '1月28日 13:29');
    assert.strictEqual(dateFormat.format('2019-12-28T13:29:10.000+08:00', { formatter: 'shortStep' }), '2019年12月28日 13:29');
    assert.strictEqual(dateFormat.format('2020-12-28T13:29:10.000+08:00', { formatter: 'shortStep' }), '12月28日 13:29');
    assert.strictEqual(dateFormat.format('2020-12-08T13:29:10.000+08:00', { formatter: 'shortStep' }), '12月8日 13:29');
    assert.strictEqual(dateFormat.format('2021-02-28T13:29:10.000+08:00', { formatter: 'shortStep' }), '2021年2月28日 13:29');
    assert.strictEqual(dateFormat.format('2020-02-29T13:29:10.000+08:00', { formatter: 'shortStep' }), '明天 13:29');
    assert.strictEqual(dateFormat.format('2020-03-01T13:29:10.000+08:00', { formatter: 'shortStep' }), '3月1日 13:29');
    assert.strictEqual(dateFormat.format('2020-02-29T23:29:10.000+08:00', { formatter: 'shortStep' }), '明天 23:29');

    assert.strictEqual(dateFormat.format(now, { formatter: 'fromNow', locale: 'en' }), 'a few seconds ago');
    assert.strictEqual(dateFormat.format(now, { formatter: 'step', locale: 'en' }), '1:29 PM');
    assert.strictEqual(dateFormat.format('2020-02-27T03:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Yesterday 3:29 AM');
    assert.strictEqual(dateFormat.format('2020-02-27T13:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Yesterday 1:29 PM');
    assert.strictEqual(dateFormat.format('2020-01-28T13:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Jan 28 1:29 PM');
    assert.strictEqual(dateFormat.format('2019-12-28T13:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Dec 28, 2019 1:29 PM');
    assert.strictEqual(dateFormat.format('2020-12-28T13:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Dec 28 1:29 PM');
    assert.strictEqual(dateFormat.format('2020-12-08T13:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Dec 8 1:29 PM');
    assert.strictEqual(dateFormat.format('2021-02-28T13:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Feb 28, 2021 1:29 PM');
    assert.strictEqual(dateFormat.format('2020-02-29T13:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Tomorrow 1:29 PM');
    assert.strictEqual(dateFormat.format('2020-03-01T13:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Mar 1 1:29 PM');
    assert.strictEqual(dateFormat.format('2020-02-29T23:29:10.000+08:00', { formatter: 'step', locale: 'en' }), 'Tomorrow 11:29 PM');

    assert.strictEqual(dateFormat.format(now, { formatter: 'fromNow', locale: 'en' }), 'a few seconds ago');
    assert.strictEqual(dateFormat.format(now, { formatter: 'shortStep', locale: 'en' }), '13:29');
    assert.strictEqual(dateFormat.format('2020-02-27T03:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Yesterday 03:29');
    assert.strictEqual(dateFormat.format('2020-02-27T13:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Yesterday 13:29');
    assert.strictEqual(dateFormat.format('2020-01-28T13:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Jan 28 13:29');
    assert.strictEqual(dateFormat.format('2019-12-28T13:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Dec 28, 2019 13:29');
    assert.strictEqual(dateFormat.format('2020-12-28T13:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Dec 28 13:29');
    assert.strictEqual(dateFormat.format('2020-12-08T13:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Dec 8 13:29');
    assert.strictEqual(dateFormat.format('2021-02-28T13:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Feb 28, 2021 13:29');
    assert.strictEqual(dateFormat.format('2020-02-29T13:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Tomorrow 13:29');
    assert.strictEqual(dateFormat.format('2020-03-01T13:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Mar 1 13:29');
    assert.strictEqual(dateFormat.format('2020-02-29T23:29:10.000+08:00', { formatter: 'shortStep', locale: 'en' }), 'Tomorrow 23:29');

    MockDate.reset();
  });
});
