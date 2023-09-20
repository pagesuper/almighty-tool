import numberUtil from '../../../src/utils/number.util';

describe('numberUtil.splitFloat()', () => {
  test('ok: 整数 + 2位小数', async () => {
    expect(numberUtil.splitFloat(1293.45)).toEqual({
      float: '45',
      integer: '1293',
      point: '.',
    });
  });

  test('ok: 整数 + 无小数', async () => {
    expect(numberUtil.splitFloat(1293.45, { maxTailsCount: 4, ignoreTailZeros: false })).toEqual({
      float: '4500',
      integer: '1293',
      point: '.',
    });

    expect(numberUtil.splitFloat(1293.45, { maxTailsCount: 4 })).toEqual({
      float: '45',
      integer: '1293',
      point: '.',
    });

    expect(numberUtil.splitFloat(1293)).toEqual({
      float: '',
      integer: '1293',
      point: '',
    });

    expect(numberUtil.splitFloat(1293, { ignoreTailZeros: false })).toEqual({
      float: '00',
      integer: '1293',
      point: '.',
    });

    expect(numberUtil.splitFloat(1293, { ignoreTailZeros: false, maxTailsCount: 1 })).toEqual({
      float: '0',
      integer: '1293',
      point: '.',
    });

    expect(numberUtil.splitFloat('', { ignoreTailZeros: false, maxTailsCount: 1 })).toEqual({
      float: '0',
      integer: '0',
      point: '.',
    });

    expect(numberUtil.splitFloat(' ', { ignoreTailZeros: false, maxTailsCount: 1 })).toEqual({
      float: '0',
      integer: '0',
      point: '.',
    });
  });
});

describe('numberUtil.formatFloat()', () => {
  test('ok: formatFloat', async () => {
    expect(numberUtil.formatFloat(1293.4522, { maxTailsCount: 2 })).toEqual('1293.45');
    expect(numberUtil.formatFloat(1293, { maxTailsCount: 2 })).toEqual('1293');
    expect(numberUtil.formatFloat(1293, { maxTailsCount: 2, ignoreTailZeros: false })).toEqual('1293.00');
    expect(numberUtil.formatFloat(1293.63745, { maxTailsCount: 0 })).toEqual('1293');
    expect(numberUtil.formatFloat(1293.63745, { maxTailsCount: 2 })).toEqual('1293.63');
    expect(numberUtil.formatFloat(1293.6)).toEqual('1293.6');
    expect(numberUtil.formatFloat(1293.6, { ignoreTailZeros: false })).toEqual('1293.60');
    expect(numberUtil.formatFloat(1293.6034, { ignoreTailZeros: false })).toEqual('1293.60');
    expect(numberUtil.formatFloat(1293.6034)).toEqual('1293.60');
    expect(numberUtil.formatFloat(1293.6, { maxTailsCount: 2 })).toEqual('1293.6');
    expect(numberUtil.formatFloat(1293.6, { maxTailsCount: 2, ignoreTailZeros: false })).toEqual('1293.60');
  });
});
