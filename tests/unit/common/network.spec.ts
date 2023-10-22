import network from '../../../src/common/network';

describe('network', () => {
  test('失败', async () => {
    try {
      await network.request({
        url: 'https://www.baidu.com/not-found.html',
        method: 'GET',
        printError: false,
        printLog: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(Reflect.get(error, 'errInfo')).toBe('Request failed with status code 404');
    }
  });
});
