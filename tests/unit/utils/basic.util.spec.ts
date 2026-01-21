import assert from 'power-assert';
import basicUtil from '../../../src/utils/basic.util';

describe('basicUtil.buildUrl()', () => {
  test('无query', async () => {
    assert.equal(basicUtil.buildUrl('hello/world'), 'hello/world');
    assert.equal(basicUtil.buildUrl('hello/world?age=12&name=happy'), 'hello/world?age=12&name=happy');
  });

  test('query为字符串', async () => {
    assert.equal(basicUtil.buildUrl('hello/world', 'age=12&name=happy'), 'hello/world?age=12&name=happy');
  });

  test('query为对象', async () => {
    assert.equal(basicUtil.buildUrl('hello/world', { age: 12, name: 'happy' }), 'hello/world?age=12&name=happy');
    assert.equal(basicUtil.buildUrl('hello/world', { age: 12, name: '老王' }), 'hello/world?age=12&name=%E8%80%81%E7%8E%8B');
  });

  test('query为嵌套对象', async () => {
    assert.equal(
      basicUtil.buildUrl('hello/world', { age: 12, user: { name: 'happy' } }),
      'hello/world?age=12&user%5Bname%5D=happy',
    );
  });
});

describe('basicUtil.base64', () => {
  test('成功', async () => {
    assert.equal(basicUtil.base64Encode('hello world'), 'aGVsbG8gd29ybGQ=');
    assert.equal(basicUtil.base64Decode('aGVsbG8gd29ybGQ='), 'hello world');
  });
});

describe('basicUtil.sortKeys()', () => {
  test('成功', async () => {
    assert.equal(JSON.stringify({ b: 1, a: 2 }), '{"b":1,"a":2}');
    assert.equal(JSON.stringify(basicUtil.sortKeys({ b: 1, a: 2 })), '{"a":2,"b":1}');
  });
});

describe('basicUtil.getDifferences()', () => {
  test('basicUtil.getDifferences OK v1', async () => {
    expect(basicUtil.getDifferences({ a: 1, b: 2 }, { a: 1, b: 3 })).toEqual(['b']);
  });

  test('basicUtil.getDifferences OK v2', async () => {
    const value1 = {
      name: '',
      informations: ['Jack is a good boy'],
      address: '',
      region: [],
      date1: undefined,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
      school: {
        name: '',
        years: '2001',
      },
      users: [
        {
          name: '',
          address: '',
          age: '0',
        },
      ],
    };

    const value2 = {
      name: '',
      informations: ['Jack is a good boy'],
      address: '',
      region: [],
      date1: undefined,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
      school: {
        name: '',
        years: 2001,
      },
      users: [
        {
          name: '',
          address: '',
          age: 0,
        },
      ],
    };

    expect(basicUtil.getDifferences(value1, value2, { noStrict: true })).toEqual([]);
    expect(basicUtil.getDifferences(value1, value2, {})).toEqual(['school.years', 'users.0.age']);
  });

  test('基本类型比较', async () => {
    // 字符串比较
    expect(basicUtil.getDifferences('hello', 'world')).toEqual(['']);
    expect(basicUtil.getDifferences('hello', 'hello')).toEqual([]);

    // 数字比较
    expect(basicUtil.getDifferences(123, 456)).toEqual(['']);
    expect(basicUtil.getDifferences(123, 123)).toEqual([]);

    // 布尔值比较
    expect(basicUtil.getDifferences(true, false)).toEqual(['']);
    expect(basicUtil.getDifferences(true, true)).toEqual([]);

    // null/undefined比较
    expect(basicUtil.getDifferences(null, undefined)).toEqual(['']);
    expect(basicUtil.getDifferences(null, null)).toEqual([]);
    expect(basicUtil.getDifferences(undefined, undefined)).toEqual([]);
  });

  test('数组比较', async () => {
    // 相同数组
    expect(basicUtil.getDifferences([1, 2, 3], [1, 2, 3])).toEqual([]);

    // 不同长度数组
    expect(basicUtil.getDifferences([1, 2], [1, 2, 3])).toEqual(['2']);

    // 数组元素不同
    expect(basicUtil.getDifferences([1, 2, 3], [1, 4, 3])).toEqual(['1']);

    // 嵌套数组
    expect(basicUtil.getDifferences([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toEqual(['1.1']);

    // 混合类型数组
    expect(basicUtil.getDifferences([1, 'hello', true], [1, 'world', true])).toEqual(['1']);
  });

  test('对象比较', async () => {
    // 相同对象
    expect(basicUtil.getDifferences({ a: 1, b: 2 }, { a: 1, b: 2 })).toEqual([]);

    // 属性值不同
    expect(basicUtil.getDifferences({ a: 1, b: 2 }, { a: 1, b: 3 })).toEqual(['b']);

    // 属性数量不同
    expect(basicUtil.getDifferences({ a: 1 }, { a: 1, b: 2 })).toEqual(['b']);

    // 嵌套对象
    expect(basicUtil.getDifferences(
      { a: { x: 1, y: 2 }, b: 3 },
      { a: { x: 1, y: 4 }, b: 3 }
    )).toEqual(['a.y']);

    // 深层嵌套
    expect(basicUtil.getDifferences(
      { a: { b: { c: { d: 1 } } } },
      { a: { b: { c: { d: 2 } } } }
    )).toEqual(['a.b.c.d']);
  });

  test('noStrict选项测试', async () => {
    // 数字和字符串比较（非严格模式）
    expect(basicUtil.getDifferences({ a: 123 }, { a: '123' }, { noStrict: true })).toEqual([]);
    expect(basicUtil.getDifferences({ a: 123 }, { a: '123' }, {})).toEqual(['a']);

    // 布尔值和字符串比较（非严格模式）
    expect(basicUtil.getDifferences({ a: true }, { a: 'true' }, { noStrict: true })).toEqual([]);
    expect(basicUtil.getDifferences({ a: true }, { a: 'true' }, {})).toEqual(['a']);

    // 布尔值和数字比较（非严格模式）
    expect(basicUtil.getDifferences({ a: true }, { a: 1 }, { noStrict: true })).toEqual(['a']);
    expect(basicUtil.getDifferences({ a: true }, { a: 1 }, {})).toEqual(['a']);
  });

  test('复杂对象比较', async () => {
    const obj1 = {
      user: {
        id: 1,
        profile: {
          name: 'John',
          settings: {
            theme: 'dark',
            notifications: true
          }
        },
        hobbies: ['reading', 'swimming']
      },
      preferences: {
        language: 'en'
      }
    };

    const obj2 = {
      user: {
        id: 1,
        profile: {
          name: 'John',
          settings: {
            theme: 'light', // 不同
            notifications: true
          }
        },
        hobbies: ['reading', 'swimming', 'coding'] // 不同
      },
      preferences: {
        language: 'en'
      }
    };

    expect(basicUtil.getDifferences(obj1, obj2)).toEqual(['user.profile.settings.theme', 'user.hobbies.2']);
  });
});

// describe('textUtil.getTextWidth()', () => {
//   test('空字符串返回0', () => {
//     assert.equal(basicUtil.getTextWidth(''), 0);
//   });

//   test('ASCII字符计为1', () => {
//     assert.equal(basicUtil.getTextWidth('abc123'), 6);
//     assert.equal(basicUtil.getTextWidth('@#$'), 3);
//   });

//   test('全角字符计为2', () => {
//     assert.equal(basicUtil.getTextWidth('你好'), 4);
//     assert.equal(basicUtil.getTextWidth('ＡＢＣ'), 6);
//   });

//   test('Emoji计为2', () => {
//     assert.equal(basicUtil.getTextWidth('🌍'), 2);
//     assert.equal(basicUtil.getTextWidth('👍🏻'), 2);
//   });

//   test('混合字符计算', () => {
//     assert.equal(basicUtil.getTextWidth('a你好🌍'), 5);
//     assert.equal(basicUtil.getTextWidth('👨‍👩‍👧‍👦'), 4);
//   });

//   test('边界值测试', () => {
//     assert.equal(basicUtil.getTextWidth('\x00'), 1); // ASCII最小值
//     assert.equal(basicUtil.getTextWidth('\xFF'), 1); // ASCII最大值
//     assert.equal(basicUtil.getTextWidth('\uD83C\uDF00'), 2); // Emoji代理对
//   });
// });

describe('basicUtil.isEmpty()', () => {
  test('成功', async () => {
    expect(basicUtil.isEmpty(null)).toBe(true);
    expect(basicUtil.isEmpty(undefined)).toBe(true);
    expect(basicUtil.isEmpty('')).toBe(true);
    expect(basicUtil.isEmpty([])).toBe(true);
    expect(basicUtil.isEmpty({})).toBe(true);
    expect(basicUtil.isEmpty(new Set())).toBe(true);
    expect(basicUtil.isEmpty(new Map())).toBe(true);
    expect(basicUtil.isEmpty(new Set([1, 2, 3]))).toBe(false);
    expect(
      basicUtil.isEmpty(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      ),
    ).toBe(false);
    expect(basicUtil.isEmpty(0)).toBe(false);
    expect(basicUtil.isEmpty(false)).toBe(false);
    expect(basicUtil.isEmpty(NaN)).toBe(false);
    expect(basicUtil.isEmpty(function () {})).toBe(false);
    // eslint-disable-next-line symbol-description
    expect(basicUtil.isEmpty(Symbol())).toBe(false);
    expect(basicUtil.isEmpty(BigInt(0))).toBe(false);
  });
});

describe('basicUtil.isPresent()', () => {
  test('成功', async () => {
    expect(basicUtil.isPresent(null)).toBe(false);
    expect(basicUtil.isPresent(undefined)).toBe(false);
    expect(basicUtil.isPresent('')).toBe(false);
    expect(basicUtil.isPresent([])).toBe(false);
    expect(basicUtil.isPresent({})).toBe(false);
    expect(basicUtil.isPresent(new Set())).toBe(false);
    expect(basicUtil.isPresent(new Map())).toBe(false);
    expect(basicUtil.isPresent(new Set([1, 2, 3]))).toBe(true);
    expect(
      basicUtil.isPresent(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      ),
    ).toBe(true);
    expect(basicUtil.isPresent(0)).toBe(true);
    expect(basicUtil.isPresent(false)).toBe(true);
    expect(basicUtil.isPresent(NaN)).toBe(true);
    expect(basicUtil.isPresent(function () {})).toBe(true);
    // eslint-disable-next-line symbol-description
    expect(basicUtil.isPresent(Symbol())).toBe(true);
    expect(basicUtil.isPresent(BigInt(0))).toBe(true);
  });
});
