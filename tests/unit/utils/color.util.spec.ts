import assert from 'power-assert';
import colorUtil from '../../../src/utils/color.util';

describe('colorUtil.hexToRgba()', () => {
  test('成功', async () => {
    assert.equal(colorUtil.hexToRgba('#ffffff'), 'rgba(255,255,255,1)');
    assert.equal(colorUtil.hexToRgba('#000000'), 'rgba(0,0,0,1)');
    assert.equal(colorUtil.hexToRgba('#ffffff66'), 'rgba(255,255,255,0.4)');
    assert.equal(colorUtil.hexToRgba('#00000066'), 'rgba(0,0,0,0.4)');
  });
});

describe('colorUtil.rgbaToHex()', () => {
  test('成功', async () => {
    assert.equal(colorUtil.rgbaToHex('rgba(255,255,255,1)'), '#ffffff');
    assert.equal(colorUtil.rgbaToHex('rgba(0,0,0,1)'), '#000000');
    assert.equal(colorUtil.rgbaToHex('rgba(255,255,255,0.4)'), '#ffffff66');
    assert.equal(colorUtil.rgbaToHex('rgba(0,0,0,0.4)'), '#00000066');
  });
});

describe('colorUtil.toRgbaArray()', () => {
  test('成功', async () => {
    assert.deepEqual(colorUtil.toRgbaArray('rgba(255,255,255,1)'), [255, 255, 255, 1]);
    assert.deepEqual(colorUtil.toRgbaArray('#ffffff'), [255, 255, 255, 1]);
    assert.deepEqual(colorUtil.toRgbaArray('rgba(255,255,255,0.34)'), [255, 255, 255, 0.34]);
    assert.deepEqual(colorUtil.toRgbaArray('#ffffff79'), [255, 255, 255, 0.4745098039215686]);
  });
});

describe('colorUtil.mixColor()', () => {
  test('成功', async () => {
    assert.equal(colorUtil.mixColor('red', 'green', 0.5), 'rgba(128,64,0,1)');
    assert.equal(colorUtil.mixColor('#ffffff', '#000000', 0.5), 'rgba(128,128,128,1)');
    assert.equal(colorUtil.mixColor('#ffffff', '#000000', 1.0), 'rgba(255,255,255,1)');
    assert.equal(colorUtil.mixColor('#ffffffff', '#00000066', 0.5), 'rgba(128,128,128,0.7)');
  });
});
