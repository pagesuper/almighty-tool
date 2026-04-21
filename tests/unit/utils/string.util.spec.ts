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

describe('stringUtil.byteLength()', () => {
  // 1. display 模式测试（默认）
  describe('mode: display (默认)', () => {
    test('纯中文', () => {
      expect(stringUtil.byteLength('你好世界')).toBe(4);
    });

    test('纯英文', () => {
      expect(stringUtil.byteLength('abcd')).toBe(2);
    });

    test('中英混合', () => {
      expect(stringUtil.byteLength('你好ab')).toBe(3);
    });

    test('混合数字和中文', () => {
      expect(stringUtil.byteLength('测试123')).toBe(3.5);
    });

    test('全角标点', () => {
      expect(stringUtil.byteLength('你好，世界')).toBe(5);
    });

    test('半角标点', () => {
      expect(stringUtil.byteLength('hello,world')).toBe(5.5);
    });

    test('显式指定 display 模式', () => {
      expect(stringUtil.byteLength('你好ab', { mode: 'display' })).toBe(3);
    });
  });

  // 2. utf8 模式测试
  describe('mode: utf8', () => {
    test('纯中文', () => {
      expect(stringUtil.byteLength('你好', { mode: 'utf8' })).toBe(6);
    });

    test('纯英文', () => {
      expect(stringUtil.byteLength('ab', { mode: 'utf8' })).toBe(2);
    });

    test('中英混合', () => {
      expect(stringUtil.byteLength('你好ab', { mode: 'utf8' })).toBe(8);
    });

    test('包含 emoji', () => {
      expect(stringUtil.byteLength('👍', { mode: 'utf8' })).toBe(4);
    });

    test('混合 emoji 和中文', () => {
      expect(stringUtil.byteLength('你好👍', { mode: 'utf8' })).toBe(10);
    });
  });

  // 3. gbk 模式测试
  describe('mode: gbk', () => {
    test('纯中文', () => {
      expect(stringUtil.byteLength('你好', { mode: 'gbk' })).toBe(4);
    });

    test('纯英文', () => {
      expect(stringUtil.byteLength('ab', { mode: 'gbk' })).toBe(2);
    });

    test('中英混合', () => {
      expect(stringUtil.byteLength('你好ab', { mode: 'gbk' })).toBe(6);
    });
  });

  // 4. 边界条件测试
  describe('边界条件', () => {
    test('空字符串', () => {
      expect(stringUtil.byteLength('')).toBe(0);
    });

    test('null', () => {
      expect(stringUtil.byteLength(null)).toBe(0);
    });

    test('undefined', () => {
      expect(stringUtil.byteLength(undefined)).toBe(0);
    });

    test('单个中文字符', () => {
      expect(stringUtil.byteLength('中')).toBe(1);
    });

    test('单个英文字符', () => {
      expect(stringUtil.byteLength('a')).toBe(0.5);
    });

    test('空格字符', () => {
      expect(stringUtil.byteLength('  ')).toBe(1);
    });
  });
});

describe('stringUtil.displayByteLength()', () => {
  test('纯中文', () => {
    expect(stringUtil.displayByteLength('中文测试')).toBe(4);
  });

  test('纯英文小写', () => {
    expect(stringUtil.displayByteLength('hello')).toBe(2.5);
  });

  test('纯英文大写', () => {
    expect(stringUtil.displayByteLength('HELLO')).toBe(2.5);
  });

  test('纯数字', () => {
    expect(stringUtil.displayByteLength('12345')).toBe(2.5);
  });

  test('中英混合', () => {
    expect(stringUtil.displayByteLength('测试test')).toBe(4);
  });

  test('全角数字', () => {
    expect(stringUtil.displayByteLength('１２３')).toBe(3);
  });

  test('全角字母', () => {
    expect(stringUtil.displayByteLength('ＡＢＣ')).toBe(3);
  });
});

describe('stringUtil.utf8ByteLength()', () => {
  test('纯 ASCII', () => {
    expect(stringUtil.utf8ByteLength('hello')).toBe(5);
  });

  test('纯中文', () => {
    expect(stringUtil.utf8ByteLength('你好')).toBe(6);
  });

  test('中英混合', () => {
    expect(stringUtil.utf8ByteLength('你好ab')).toBe(8);
  });

  test('包含换行符', () => {
    expect(stringUtil.utf8ByteLength('a\nb')).toBe(3);
  });

  test('包含 Tab', () => {
    expect(stringUtil.utf8ByteLength('a\tb')).toBe(3);
  });
});

describe('stringUtil.gbkByteLength()', () => {
  test('纯 ASCII', () => {
    expect(stringUtil.gbkByteLength('hello')).toBe(5);
  });

  test('纯中文', () => {
    expect(stringUtil.gbkByteLength('你好')).toBe(4);
  });

  test('中英混合', () => {
    expect(stringUtil.gbkByteLength('你好ab')).toBe(6);
  });
});

describe('stringUtil.isFullWidth()', () => {
  // 1. 中文字符测试
  describe('中文字符', () => {
    test('常用汉字', () => {
      expect(stringUtil.isFullWidth('中'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('文'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('测'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('试'.codePointAt(0)!)).toBe(true);
    });

    test('生僻字', () => {
      expect(stringUtil.isFullWidth('龘'.codePointAt(0)!)).toBe(true);
    });
  });

  // 2. 英文字符测试
  describe('英文字符', () => {
    test('小写字母', () => {
      expect(stringUtil.isFullWidth('a'.codePointAt(0)!)).toBe(false);
      expect(stringUtil.isFullWidth('z'.codePointAt(0)!)).toBe(false);
    });

    test('大写字母', () => {
      expect(stringUtil.isFullWidth('A'.codePointAt(0)!)).toBe(false);
      expect(stringUtil.isFullWidth('Z'.codePointAt(0)!)).toBe(false);
    });
  });

  // 3. 数字测试
  describe('数字', () => {
    test('半角数字', () => {
      expect(stringUtil.isFullWidth('0'.codePointAt(0)!)).toBe(false);
      expect(stringUtil.isFullWidth('9'.codePointAt(0)!)).toBe(false);
    });

    test('全角数字', () => {
      expect(stringUtil.isFullWidth('０'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('９'.codePointAt(0)!)).toBe(true);
    });
  });

  // 4. 标点符号测试
  describe('标点符号', () => {
    test('半角标点', () => {
      expect(stringUtil.isFullWidth(','.codePointAt(0)!)).toBe(false);
      expect(stringUtil.isFullWidth('.'.codePointAt(0)!)).toBe(false);
      expect(stringUtil.isFullWidth('!'.codePointAt(0)!)).toBe(false);
    });

    test('全角标点', () => {
      expect(stringUtil.isFullWidth('，'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('。'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('！'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('、'.codePointAt(0)!)).toBe(true);
    });

    test('中文引号', () => {
      expect(stringUtil.isFullWidth('「'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('」'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('『'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('』'.codePointAt(0)!)).toBe(true);
    });
  });

  // 5. 日文字符测试
  describe('日文字符', () => {
    test('平假名', () => {
      expect(stringUtil.isFullWidth('あ'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('ん'.codePointAt(0)!)).toBe(true);
    });

    test('片假名', () => {
      expect(stringUtil.isFullWidth('ア'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('ン'.codePointAt(0)!)).toBe(true);
    });
  });

  // 6. 韩文字符测试
  describe('韩文字符', () => {
    test('韩文字母', () => {
      expect(stringUtil.isFullWidth('한'.codePointAt(0)!)).toBe(true);
      expect(stringUtil.isFullWidth('국'.codePointAt(0)!)).toBe(true);
    });
  });

  // 7. 特殊字符测试
  describe('特殊字符', () => {
    test('空格', () => {
      expect(stringUtil.isFullWidth(' '.codePointAt(0)!)).toBe(false);
    });

    test('全角空格', () => {
      expect(stringUtil.isFullWidth('　'.codePointAt(0)!)).toBe(true);
    });

    test('换行符', () => {
      expect(stringUtil.isFullWidth('\n'.codePointAt(0)!)).toBe(false);
    });

    test('Tab', () => {
      expect(stringUtil.isFullWidth('\t'.codePointAt(0)!)).toBe(false);
    });
  });
});
