/* eslint-disable @typescript-eslint/no-empty-function */
import general from '../../../src/common/general';

describe('general.generateRandomString()', () => {
  test('成功', async () => {
    for (let i = 0; i < 100; i++) {
      console.log(general.generateRandomString({
        timeLength: 17,
        length: 24,
      }));
    }
  });
});
