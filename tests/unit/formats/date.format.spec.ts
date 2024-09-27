import assert from 'assert';
import dateFormat from '../../../src/formats/date.format';
import MockDate from 'mockdate';

describe('dateFormat', () => {
  test('ok', async () => {
    MockDate.set(new Date('2020-02-28T13:29:10.000+08:00'));
    const now = new Date();

    assert.strictEqual(dateFormat.format(now, { formatter: 'fromNow' }), '');

    // assert.strictEqual(accurateUtil.add(1, 2), 3);
    // assert.strictEqual(accurateUtil.add(1.0000001, 0.0000009), 1.000001);
    // assert.strictEqual(accurateUtil.add(1.1, 0.3), 1.4);

    // assert.notStrictEqual(1.0000001 + 0.0000009, 1.000001);
    // assert.notStrictEqual(1.1 + 0.3, 1.4);

    MockDate.reset();
  });
});
