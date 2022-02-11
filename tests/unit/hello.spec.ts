import assert from 'power-assert';

// describe('Reflect.get', () => {
//   test('get by default value', () => {
//     expect(Reflect.get({}, 'x')).toEqual('age');
//   });
// });

describe('increment', () => {
  test('get 1 at initial', () => {
    const count = 0 + 1;
    assert.equal(count, 1);
  });
});

// describe('jest.mock', () => {
//   test('test jest.fn()', () => {
//     let mockFn = jest.fn();
//     let result = mockFn(1, 2, 3);

//     // 断言mockFn的执行后返回undefined
//     expect(result).toBeUndefined();
//     // 断言mockFn被调用
//     expect(mockFn).toBeCalled();
//     // 断言mockFn被调用了一次
//     expect(mockFn).toBeCalledTimes(1);
//     // 断言mockFn传入的参数为1, 2, 3
//     expect(mockFn).toHaveBeenCalledWith(1, 2, 3);
//   });

//   test('测试jest.fn()返回固定值', () => {
//     let mockFn = jest.fn().mockReturnValue('default');
//     // 断言mockFn执行后返回值为default
//     expect(mockFn()).toBe('default');
//   });

//   test('测试jest.fn()内部实现', () => {
//     let mockFn = jest.fn((num1, num2) => {
//       return num1 * num2;
//     });
//     // 断言mockFn执行后返回100
//     expect(mockFn(10, 10)).toBe(100);
//   });

//   test('测试jest.fn()返回Promise', async () => {
//     let mockFn = jest.fn().mockResolvedValue('default');
//     let result = await mockFn();
//     // 断言mockFn通过await关键字执行后返回值为default
//     expect(result).toBe('default');
//     // 断言mockFn调用后返回的是Promise对象
//     expect(Object.prototype.toString.call(mockFn())).toBe('[object Promise]');
//   });
// });

// import axios from 'axios';

// async function fetchPostsList(callback) {
//   return axios.get('https://jsonplaceholder.typicode.com/posts').then((res) => {
//     return callback(res.data);
//   });
// }

// describe('jest.mock', () => {
//   test('fetchPostsList中的回调函数应该能够被调用', async () => {
//     expect.assertions(1);
//     let mockFn = jest.fn();
//     await fetchPostsList(mockFn);
//     // 断言mockFn被调用
//     expect(mockFn).toBeCalled();
//   });
// });
