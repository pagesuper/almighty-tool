/* eslint-disable @typescript-eslint/no-empty-function */
import general from '../../../src/common/general';

describe('general.generateRandomString()', () => {
  test('成功', async () => {
    for (let i = 0; i < 100; i++) {
      const string = general.generateRandomString({
        timeType: 'char',
        length: 24,
      });

      expect(string.length).toEqual(24);
    }
  });
});

// describe('general.md5()', () => {
//   test('成功', async () => {
//     expect(general.md5('1.0.0')).toEqual('47cd76e43f74bbc2e1baaf194d07e1fa');
//     expect(general.md5(Buffer.from('1.0.0'))).toEqual('47cd76e43f74bbc2e1baaf194d07e1fa');
//   });
// });
