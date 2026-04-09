import assert from 'assert';
import durationFormat from '../../../src/formats/duration.format';

describe('durationFormat', () => {
  test('ok', async () => {
    // 测试中文格式
    assert.strictEqual(durationFormat.format(0), '0秒');
    assert.strictEqual(durationFormat.format(34), '34秒');
    assert.strictEqual(durationFormat.format(180), '3分0秒');
    assert.strictEqual(durationFormat.format(14400), '4小时0分0秒');
    assert.strictEqual(durationFormat.format(129600), '1天12小时0分0秒');
    assert.strictEqual(durationFormat.format(31536000 + 7200 + 180 + 3), '1年0天2小时3分3秒');
    
    // 测试英文格式
    assert.strictEqual(durationFormat.format(0, { locale: 'en' }), '0s');
    assert.strictEqual(durationFormat.format(34, { locale: 'en' }), '34s');
    assert.strictEqual(durationFormat.format(180, { locale: 'en' }), '3m0s');
    assert.strictEqual(durationFormat.format(14400, { locale: 'en' }), '4h0m0s');
    assert.strictEqual(durationFormat.format(129600, { locale: 'en' }), '1d12h0m0s');
    assert.strictEqual(durationFormat.format(31536000 + 7200 + 180 + 3, { locale: 'en' }), '1y0d2h3m3s');
    
    // 测试负数情况
    assert.strictEqual(durationFormat.format(-1), '');
    
    // 测试short格式化
    assert.strictEqual(durationFormat.format(34, { formatter: 'short' }), '34s');
    assert.strictEqual(durationFormat.format(180, { formatter: 'short' }), '3m0s');
    assert.strictEqual(durationFormat.format(14400, { formatter: 'short' }), '4h0m0s');
  });
});