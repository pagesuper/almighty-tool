import assert from 'power-assert';
import MockDate from 'mockdate';
import randomUtil, { DEFINED_RANDOM_CHARS, RANDOM_CHARS } from '../../../src/utils/random.util';

describe('randomUtil.generateRandomString()', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test('默认配置：生成32位字符串（小写+数字）', () => {
    const result = randomUtil.generateRandomString();
    assert.equal(typeof result, 'string');
    assert.equal(result.length, 32);
    // 验证只包含小写字母和数字
    const pattern = /^[a-z0-9]+$/;
    assert.ok(pattern.test(result));
  });

  test('自定义长度：生成指定长度的字符串', () => {
    const result1 = randomUtil.generateRandomString({ length: 10, timeType: 'none' });
    assert.equal(result1.length, 10);

    const result2 = randomUtil.generateRandomString({ length: 50, timeType: 'none' });
    assert.equal(result2.length, 50);

    const result3 = randomUtil.generateRandomString({ length: 1, timeType: 'none' });
    assert.equal(result3.length, 1);
  });

  test('使用 full 字符集：包含大小写字母和数字', () => {
    const result = randomUtil.generateRandomString({ group: 'full', length: 100 });
    assert.equal(result.length, 100);
    const pattern = /^[a-zA-Z0-9]+$/;
    assert.ok(pattern.test(result));
  });

  test('使用 downcase 字符集：小写字母+数字', () => {
    const result = randomUtil.generateRandomString({ group: 'downcase', length: 50 });
    assert.equal(result.length, 50);
    const pattern = /^[a-z0-9]+$/;
    assert.ok(pattern.test(result));
  });

  test('使用 lower 字符集：仅小写字母', () => {
    const result = randomUtil.generateRandomString({ group: 'lower', length: 50 });
    assert.equal(result.length, 50);
    const pattern = /^[a-z]+$/;
    assert.ok(pattern.test(result));
  });

  test('使用 upper 字符集：仅大写字母', () => {
    const result = randomUtil.generateRandomString({ group: 'upper', length: 50 });
    assert.equal(result.length, 50);
    const pattern = /^[A-Z]+$/;
    assert.ok(pattern.test(result));
  });

  test('使用 simple 字符集：不含0的简单字符', () => {
    const result = randomUtil.generateRandomString({ group: 'simple', length: 50 });
    assert.equal(result.length, 50);
    // simple 字符集不包含 0
    assert.ok(!result.includes('0'));
  });

  test('使用 number 字符集：仅数字', () => {
    const result = randomUtil.generateRandomString({ group: 'number', length: 50 });
    assert.equal(result.length, 50);
    const pattern = /^[0-9]+$/;
    assert.ok(pattern.test(result));
  });

  test('使用 symbol 字符集：仅符号', () => {
    const result = randomUtil.generateRandomString({ group: 'symbol', length: 50 });
    assert.equal(result.length, 50);
    const symbolPattern = /^[~!@#$%^&*()_+]+$/;
    assert.ok(symbolPattern.test(result));
  });

  test('自定义字符集：使用指定的字符', () => {
    const customChars = ['a', 'b', 'c', '1', '2', '3'];
    const result = randomUtil.generateRandomString({ characters: customChars, length: 50 });
    assert.equal(result.length, 50);
    // 验证只包含自定义字符
    for (const char of result) {
      assert.ok(customChars.includes(char));
    }
  });

  test('ranges 选项：单个范围', () => {
    const result = randomUtil.generateRandomString({ ranges: 'upper', length: 50 });
    assert.equal(result.length, 50);
    const pattern = /^[A-Z]+$/;
    assert.ok(pattern.test(result));
  });

  test('ranges 选项：多个范围', () => {
    const result = randomUtil.generateRandomString({ ranges: ['upper', 'symbol'], length: 100 });
    assert.equal(result.length, 100);
    // 验证只包含大写字母和符号
    const upperAndSymbol = [...DEFINED_RANDOM_CHARS.upper, ...DEFINED_RANDOM_CHARS.symbol];
    for (const char of result) {
      assert.ok(upperAndSymbol.includes(char));
    }
  });

  test('timeType=date：包含日期时间字符串', () => {
    MockDate.set('2024-01-15T10:30:45.123Z');
    const result = randomUtil.generateRandomString({
      length: 50,
      timeType: 'date',
      timeLength: 17,
    });
    assert.equal(result.length, 50);
    // 验证前17位是时间字符串
    assert.equal(result.substring(0, 17), '20240115103045123');
  });

  test('timeType=number：包含时间戳字符串', () => {
    MockDate.set('2024-01-15T10:30:45.123Z');
    const result = randomUtil.generateRandomString({
      length: 50,
      timeType: 'number',
      timeLength: 13,
    });
    assert.equal(result.length, 50);
    // 验证前13位是时间戳
    const timestamp = new Date('2024-01-15T10:30:45.123Z').valueOf().toString();
    assert.equal(result.substring(0, 13), timestamp);
  });

  test('timeType=char：包含36进制时间字符串', () => {
    MockDate.set('2024-01-15T10:30:45.123Z');
    const timestamp = new Date('2024-01-15T10:30:45.123Z').valueOf().toString(36);
    const result = randomUtil.generateRandomString({
      length: 50,
      timeType: 'char',
      timeLength: 10,
    });
    assert.equal(result.length, 50);
    // 验证结果包含36进制时间戳
    assert.ok(result.includes(timestamp));
  });

  test('timeType=none：不包含时间', () => {
    const result = randomUtil.generateRandomString({
      length: 20,
      timeType: 'none',
    });
    assert.equal(result.length, 20);
    const pattern = /^[a-z0-9]+$/;
    assert.ok(pattern.test(result));
  });

  test('自定义 time：使用指定时间', () => {
    const customTime = new Date('2023-06-01T08:00:00.000Z');
    const result = randomUtil.generateRandomString({
      length: 50,
      timeType: 'date',
      time: customTime,
      timeLength: 17,
    });
    assert.equal(result.length, 50);
    assert.equal(result.substring(0, 17), '20230601080000000');
  });

  test('timeLength 补零：时间字符串不足指定长度时补零', () => {
    MockDate.set('2024-01-01T00:00:00.001Z');
    const result = randomUtil.generateRandomString({
      length: 50,
      timeType: 'date',
      timeLength: 20,
    });
    assert.equal(result.length, 50);
    // 验证时间部分被补零到20位
    const timePart = result.substring(0, 20);
    assert.equal(timePart.length, 20);
    // 验证时间部分包含原始时间字符串
    assert.ok(timePart.includes('20240101000000001'));
  });

  test('随机性：多次生成结果不相同', () => {
    MockDate.set('2024-01-15T10:30:45.123Z');
    const results = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const result = randomUtil.generateRandomString({ length: 20, timeType: 'none' });
      results.add(result);
    }
    // 100次生成应该有大部分不同的结果
    assert.ok(results.size > 90);
  });

  test('边界值：length=0', () => {
    MockDate.set('2024-01-15T10:30:45.123Z');
    const result = randomUtil.generateRandomString({ length: 0, timeType: 'none' });
    assert.equal(result.length, 0);
    assert.equal(result, '');
  });

  test('边界值：length=1', () => {
    const result = randomUtil.generateRandomString({ length: 1, timeType: 'none' });
    assert.equal(result.length, 1);
    assert.ok(result.length === 1);
  });

  test('组合选项：group + timeType', () => {
    MockDate.set('2024-01-15T10:30:45.123Z');
    const result = randomUtil.generateRandomString({
      group: 'upper',
      length: 50,
      timeType: 'date',
      timeLength: 17,
    });
    assert.equal(result.length, 50);
    assert.equal(result.substring(0, 17), '20240115103045123');
    // 验证随机部分都是大写字母
    const randomPart = result.substring(17);
    const pattern = /^[A-Z]+$/;
    assert.ok(pattern.test(randomPart));
  });
});

describe('randomUtil.getUtcTimeString()', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test('无参数：使用当前时间', () => {
    MockDate.set('2024-01-15T10:30:45.123Z');
    const result = randomUtil.getUtcTimeString();
    assert.equal(result, '20240115103045123');
  });

  test('指定时间：使用传入的时间', () => {
    const date = new Date('2023-06-01T08:15:30.456Z');
    const result = randomUtil.getUtcTimeString(date);
    assert.equal(result, '20230601081530456');
  });

  test('null 参数：使用当前时间', () => {
    MockDate.set('2024-12-31T23:59:59.999Z');
    const result = randomUtil.getUtcTimeString(null);
    assert.equal(result, '20241231235959999');
  });

  test('时间格式：YYYYMMDDHHmmssSSS', () => {
    MockDate.set('2024-02-29T14:05:09.007Z');
    const result = randomUtil.getUtcTimeString();
    assert.equal(result.length, 17);
    assert.equal(result, '20240229140509007');
  });

  test('月份补零：单数月补零', () => {
    MockDate.set('2024-01-05T03:07:02.008Z');
    const result = randomUtil.getUtcTimeString();
    assert.equal(result, '20240105030702008');
  });

  test('日期补零：单日补零', () => {
    MockDate.set('2024-06-09T10:20:30.099Z');
    const result = randomUtil.getUtcTimeString();
    assert.equal(result, '20240609102030099');
  });

  test('毫秒补零：不足3位补零', () => {
    MockDate.set('2024-03-15T12:00:00.001Z');
    const result = randomUtil.getUtcTimeString();
    assert.equal(result, '20240315120000001');
  });

  test('毫秒补零：2位毫秒', () => {
    MockDate.set('2024-03-15T12:00:00.010Z');
    const result = randomUtil.getUtcTimeString();
    assert.equal(result, '20240315120000010');
  });

  test('UTC 时间：不受时区影响', () => {
    // 东八区时间 2024-01-15 18:30:45
    MockDate.set('2024-01-15T18:30:45.123+08:00');
    const result = randomUtil.getUtcTimeString();
    // UTC 时间应该是 10:30:45
    assert.equal(result, '20240115103045123');
  });
});

describe('DEFINED_RANDOM_CHARS', () => {
  test('lower：小写字母数组', () => {
    assert.equal(DEFINED_RANDOM_CHARS.lower.length, 26);
    assert.ok(DEFINED_RANDOM_CHARS.lower.includes('a'));
    assert.ok(DEFINED_RANDOM_CHARS.lower.includes('z'));
    assert.ok(!DEFINED_RANDOM_CHARS.lower.includes('A'));
  });

  test('upper：大写字母数组', () => {
    assert.equal(DEFINED_RANDOM_CHARS.upper.length, 26);
    assert.ok(DEFINED_RANDOM_CHARS.upper.includes('A'));
    assert.ok(DEFINED_RANDOM_CHARS.upper.includes('Z'));
    assert.ok(!DEFINED_RANDOM_CHARS.upper.includes('a'));
  });

  test('number：数字数组', () => {
    assert.equal(DEFINED_RANDOM_CHARS.number.length, 10);
    assert.ok(DEFINED_RANDOM_CHARS.number.includes('0'));
    assert.ok(DEFINED_RANDOM_CHARS.number.includes('9'));
  });

  test('symbol：符号数组', () => {
    assert.ok(DEFINED_RANDOM_CHARS.symbol.length > 0);
    assert.ok(DEFINED_RANDOM_CHARS.symbol.includes('~'));
    assert.ok(DEFINED_RANDOM_CHARS.symbol.includes('@'));
  });
});

describe('RANDOM_CHARS', () => {
  test('full：完整字符集', () => {
    assert.equal(RANDOM_CHARS.full.length, 62);
    assert.ok(RANDOM_CHARS.full.includes('0'));
    assert.ok(RANDOM_CHARS.full.includes('a'));
    assert.ok(RANDOM_CHARS.full.includes('A'));
  });

  test('downcase：小写+数字', () => {
    assert.equal(RANDOM_CHARS.downcase.length, 36);
    assert.ok(RANDOM_CHARS.downcase.includes('0'));
    assert.ok(RANDOM_CHARS.downcase.includes('z'));
    assert.ok(!RANDOM_CHARS.downcase.includes('A'));
  });

  test('lower：仅小写', () => {
    assert.equal(RANDOM_CHARS.lower.length, 26);
  });

  test('upper：仅大写', () => {
    assert.equal(RANDOM_CHARS.upper.length, 26);
  });

  test('simple：不含0的简单字符', () => {
    assert.ok(!RANDOM_CHARS.simple.includes('0'));
    assert.ok(RANDOM_CHARS.simple.includes('1'));
    assert.ok(RANDOM_CHARS.simple.includes('a'));
  });

  test('number：仅数字', () => {
    assert.equal(RANDOM_CHARS.number.length, 10);
  });

  test('symbol：符号', () => {
    assert.ok(RANDOM_CHARS.symbol.length > 0);
  });
});
