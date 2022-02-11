import assert from 'power-assert';
import basicUtil from '../../../src/utils/basic-util';

describe('basicUtil.isBlank', () => {
  test('成功', async () => {
    assert.equal(basicUtil.isBlank('  '), true);
    assert.equal(basicUtil.isBlank(''), true);
    assert.equal(basicUtil.isBlank({}), true);
    assert.equal(basicUtil.isBlank([]), true);
    assert.equal(basicUtil.isBlank(false), false);
    assert.equal(basicUtil.isBlank(true), false);
    assert.equal(basicUtil.isBlank(0), false);
    assert.equal(basicUtil.isBlank(NaN), true);
  });
});
