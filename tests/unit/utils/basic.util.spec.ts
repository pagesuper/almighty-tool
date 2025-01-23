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
});
