import assert from 'assert';
import accurateUtil from '../../../src/utils/accurate-util';

describe('AccurateUtil.add()', () => {
  test('ok', async () => {
    assert.strictEqual(accurateUtil.add(1, 2), 3);

    assert.strictEqual(accurateUtil.add(1.0000001, 0.0000009), 1.000001);
    assert.notStrictEqual(1.0000001 + 0.0000009, 1.000001);

    assert.strictEqual(accurateUtil.add(1.1, 0.3), 1.4);
    assert.notStrictEqual(1.1 + 0.3, 1.4);
  });
});

describe('AccurateUtil.sub()', () => {
  test('ok', async () => {
    assert.strictEqual(accurateUtil.sub(1.1, 0.2), 0.9);
    assert.notStrictEqual(1.1 - 0.2, 0.9);
  });
});

describe('AccurateUtil.mul()', () => {
  test('ok', async () => {
    assert.strictEqual(accurateUtil.mul(0.333333333333, 3), 0.999999999999);
    assert.strictEqual(accurateUtil.mul(1.1, 0.1), 0.11);
    assert.notStrictEqual(1.1 * 0.1, 0.11);
  });
});

describe('AccurateUtil.div()', () => {
  test('ok', async () => {
    assert.strictEqual(accurateUtil.div(1.1, 10), 0.11);
    assert.notStrictEqual(1.1 / 10, 0.11);

    assert.strictEqual(accurateUtil.div(1, 3), 0.3333333333333333);
  });
});
