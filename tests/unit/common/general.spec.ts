/* eslint-disable @typescript-eslint/no-empty-function */
import general from '../../../src/common/general';

describe('general.generateRandomString()', () => {
  test('成功', async () => {
    for (let i = 0; i < 100; i++) {
      const string = general.generateRandomString({
        timeType: 'char',
        length: 24,
      });

      console.log(`${i}: ${string}`);

      expect(string.length).toEqual(24);
    }
  });
});

describe('general.compareVersion()', () => {
  test('成功', async () => {
    expect(general.compareVersion('1.0.0', '2.0.0')).toEqual(-1);
    expect(general.compareVersion('1.0.0', '1.0.1')).toEqual(-1);
    expect(general.compareVersion('2.0.0', '1.9.1')).toEqual(1);
    expect(general.compareVersion('2.0.0', '1.9.1.2')).toEqual(1);
    expect(general.compareVersion('2.0.0', '2.9.1.2')).toEqual(-1);
    expect(general.compareVersion('2.3.0', '2.3.0.2')).toEqual(-1);
    expect(general.compareVersion('2.3.0.1', '2.4.0.1')).toEqual(-1);
  });
});

describe('general.md5()', () => {
  test('成功', async () => {
    expect(general.md5('1.0.0')).toEqual('47cd76e43f74bbc2e1baaf194d07e1fa');
    expect(general.md5(Buffer.from('1.0.0'))).toEqual('47cd76e43f74bbc2e1baaf194d07e1fa');
  });
});
