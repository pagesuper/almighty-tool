import basicUtil from '../../../src/utils/basic-util';

describe('basicUtil.isBlank', () => {
  test('成功', async () => {
    expect(basicUtil.isBlank('  ')).toBe(true);
    expect(basicUtil.isBlank('')).toBe(true);
    expect(basicUtil.isBlank({})).toBe(true);
    expect(basicUtil.isBlank([])).toBe(true);
    expect(basicUtil.isBlank(false)).toBe(false);
    expect(basicUtil.isBlank(true)).toBe(false);
    expect(basicUtil.isBlank(0)).toBe(false);
    expect(basicUtil.isBlank(NaN)).toBe(true);
  });
});
