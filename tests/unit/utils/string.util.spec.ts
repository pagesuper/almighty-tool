import stringUtil from '../../../src/utils/string.util';

describe('stringUtil.truncate()', () => {
  const longText = 'This is a very long string that needs to be truncated';

  // 1. 基础功能测试
  test('default: 结尾截断', () => {
    expect(stringUtil.truncate(longText, { length: 20 })).toBe('This is a very lo...');
  });

  test('start: 开头截断', () => {
    expect(
      stringUtil.truncate(longText, {
        length: 20,
        position: 'start',
      }),
    ).toBe('...s to be truncated');
  });

  test('middle: 中间截断', () => {
    expect(
      stringUtil.truncate(longText, {
        length: 20,
        position: 'middle',
        endChars: 5,
      }),
    ).toBe('This is a ve...cated');
  });

  // 2. 保留单词测试
  test('preserveWord: 保留单词的结尾截断', () => {
    expect(
      stringUtil.truncate(longText, {
        length: 20,
        preserveWord: true,
      }),
    ).toBe('This is a very...');
  });

  test('preserveWord: 保留单词的开头截断', () => {
    expect(
      stringUtil.truncate(longText, {
        length: 20,
        position: 'start',
        preserveWord: true,
      }),
    ).toBe('...to be truncated');
  });

  test('preserveWord: 保留单词的中间截断', () => {
    expect(
      stringUtil.truncate(longText, {
        length: 20,
        position: 'middle',
        preserveWord: true,
      }),
    ).toBe('This is ...runcated');
  });

  // 3. 自定义省略符测试
  test('custom omission: 自定义省略符', () => {
    expect(
      stringUtil.truncate(longText, {
        length: 20,
        omission: '~~~',
      }),
    ).toBe('This is a very lo~~~');
  });

  // 4. 边界条件测试
  test('edge: 空字符串', () => {
    expect(stringUtil.truncate('', { length: 10 })).toBe('');
  });

  test('edge: 短于截断长度', () => {
    expect(stringUtil.truncate('short', { length: 10 })).toBe('short');
  });

  test('edge: 等于截断长度', () => {
    const exactLengthStr = 'exact length';
    expect(
      stringUtil.truncate(exactLengthStr, {
        length: exactLengthStr.length,
      }),
    ).toBe(exactLengthStr);
  });

  // 5. 特殊字符测试
  test('special: 包含换行符', () => {
    expect(
      stringUtil.truncate('line1\nline2', {
        length: 5,
      }),
    ).toBe('li...');
  });

  test('special: 多字节字符(中文)', () => {
    expect(
      stringUtil.truncate('这是一个很长的中文句子', {
        length: 10,
        position: 'middle',
      }),
    ).toBe('这是一...中文句子');
  });

  // 6. 配置覆盖测试
  test('config: 指定endChars', () => {
    expect(
      stringUtil.truncate(longText, {
        length: 20,
        position: 'middle',
        endChars: 8,
      }),
    ).toBe('This is a...runcated');
  });
});
