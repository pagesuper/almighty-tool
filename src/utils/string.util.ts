/**
 * 字符串截断配置选项
 */
export type StringTruncateOptions = {
  /** 截断后字符串的最大长度 */
  length: number;
  /** 截断位置：'end'(默认)|'start'|'middle' */
  position?: 'end' | 'start' | 'middle';
  /** 当position='middle'时，末尾保留的字符数 */
  endChars?: number;
  /** 省略符号，默认为'...' */
  omission?: string;
  /** 是否保留完整单词（不切断单词） */
  preserveWord?: boolean;
};

/**
 * 字节长度计算选项
 */
export type ByteLengthOptions = {
  /**
   * 计算模式：
   * - 'display': 中文=1, 英文/半角=0.5 (2个英文=1个中文，适合显示宽度计算)
   * - 'utf8': 实际UTF-8字节数 (中文=3, 英文=1)
   * - 'gbk': 实际GBK字节数 (中文=2, 英文=1)
   */
  mode?: 'display' | 'utf8' | 'gbk';
};

const stringUtil = {
  /**
   * 计算字符串的字节长度
   * @param str - 原始字符串
   * @param options - 计算选项
   * @returns 字节长度
   *
   * @example
   * // 显示模式（默认）：中文=1, 英文=0.5
   * stringUtil.byteLength('你好ab') // 3 (2 + 0.5 + 0.5)
   * stringUtil.byteLength('你好ab', { mode: 'display' }) // 3
   *
   * // UTF-8模式：中文=3, 英文=1
   * stringUtil.byteLength('你好ab', { mode: 'utf8' }) // 8 (3*2 + 1*2)
   *
   * // GBK模式：中文=2, 英文=1
   * stringUtil.byteLength('你好ab', { mode: 'gbk' }) // 6 (2*2 + 1*2)
   */
  byteLength: (str: string | undefined | null, options?: ByteLengthOptions): number => {
    if (typeof str === 'undefined' || str === null || str === '') {
      return 0;
    }

    const mode = options?.mode ?? 'display';

    switch (mode) {
      case 'utf8':
        return stringUtil.utf8ByteLength(str);
      case 'gbk':
        return stringUtil.gbkByteLength(str);
      case 'display':
      default:
        return stringUtil.displayByteLength(str);
    }
  },

  /**
   * 显示宽度计算：中文=1, 英文/半角=0.5
   * 适用于UI显示场景，2个英文字符宽度约等于1个中文字符
   */
  displayByteLength: (str: string): number => {
    let length = 0;

    for (const char of str) {
      const codePoint = char.codePointAt(0) ?? 0;

      if (stringUtil.isFullWidth(codePoint)) {
        length += 1;
      } else {
        length += 0.5;
      }
    }

    return length;
  },

  /**
   * UTF-8字节长度计算
   * 中文=3字节, 英文=1字节
   */
  utf8ByteLength: (str: string): number => {
    return new TextEncoder().encode(str).length;
  },

  /**
   * GBK字节长度计算
   * 中文=2字节, 英文=1字节
   * 注：纯前端环境无法精确计算GBK字节，此为近似实现
   */
  gbkByteLength: (str: string): number => {
    let length = 0;

    for (const char of str) {
      const codePoint = char.codePointAt(0) ?? 0;

      if (stringUtil.isFullWidth(codePoint)) {
        length += 2;
      } else {
        length += 1;
      }
    }

    return length;
  },

  /**
   * 判断字符是否为全角字符
   * 包括：中文、日文、韩文、全角标点、全角字母数字等
   */
  isFullWidth: (codePoint: number): boolean => {
    return (
      (codePoint >= 0x4e00 && codePoint <= 0x9fff) ||
      (codePoint >= 0x3400 && codePoint <= 0x4dbf) ||
      (codePoint >= 0x20000 && codePoint <= 0x2a6df) ||
      (codePoint >= 0x2a700 && codePoint <= 0x2b73f) ||
      (codePoint >= 0x2b740 && codePoint <= 0x2b81f) ||
      (codePoint >= 0x2b820 && codePoint <= 0x2ceaf) ||
      (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
      (codePoint >= 0x2f800 && codePoint <= 0x2fa1f) ||
      (codePoint >= 0x3000 && codePoint <= 0x303f) ||
      (codePoint >= 0xff00 && codePoint <= 0xffef) ||
      (codePoint >= 0xac00 && codePoint <= 0xd7af) ||
      (codePoint >= 0x3040 && codePoint <= 0x309f) ||
      (codePoint >= 0x30a0 && codePoint <= 0x30ff)
    );
  },
  /**
   * 高性能字符串截断函数
   * @param str - 原始字符串
   * @param options - 截断配置
   * @returns 截断后的字符串
   *
   * 性能优化点：
   * 1. 快速路径：直接返回满足条件的字符串
   * 2. 避免不必要的计算：提前计算关键变量
   * 3. 最小化字符串操作：使用slice替代substring
   * 4. 优化单词保留逻辑：使用indexOf替代split
   */
  truncate: (str: string | undefined | null, options: StringTruncateOptions): string => {
    const length = options.length;

    if (typeof str === 'undefined' || str === null) {
      return '';
    }

    // 快速返回路径：字符串本身已满足长度要求
    if (str.length <= length) {
      return str;
    }

    const position = options.position ?? 'end';
    const endChars = options.endChars ?? 4;
    const omission = options.omission ?? '...';
    const preserveWord = options.preserveWord ?? false;

    // 计算实际可保留的最大长度（减去省略符长度）
    const omissionLength = omission.length;
    const maxLength = length - omissionLength;

    // 根据是否保留单词选择处理路径
    return preserveWord
      ? stringUtil.preserveWordTruncate(str, { position, omission, maxLength })
      : stringUtil.simpleTruncate(str, { position, omission, maxLength, endChars });
  },

  /**
   * 简单截断处理（不保留单词）
   */
  simpleTruncate: (
    str: string,
    options: Pick<StringTruncateOptions, 'position' | 'omission'> & { maxLength: number; endChars: number },
  ): string => {
    const { position, omission, maxLength, endChars } = options;

    // 使用switch语句优化分支预测
    switch (position) {
      case 'start':
        // 开头截断：保留结尾部分
        return omission + str.slice(-maxLength);

      case 'middle':
        // 中间截断：计算保留的起始和结束位置
        return str.slice(0, Math.max(0, maxLength - endChars)) + omission + str.slice(-endChars);

      case 'end':
      default:
        // 默认结尾截断
        return str.slice(0, maxLength) + omission;
    }
  },

  /**
   * 保留单词的截断处理
   */
  preserveWordTruncate: (
    str: string,
    options: Pick<StringTruncateOptions, 'position' | 'omission'> & { maxLength: number },
  ): string => {
    const { position, omission, maxLength } = options;

    // 查找最近的空格位置（单词边界）
    const spaceIndex = str.lastIndexOf(' ', maxLength);

    // 根据截断位置选择处理方式
    if (position === 'end') {
      // 结尾截断：找到最近的空格位置截断
      return spaceIndex === -1
        ? str.slice(0, maxLength) + omission // 没有空格则强制截断
        : str.slice(0, spaceIndex) + omission;
    }

    if (position === 'start') {
      // 开头截断：从末尾向前找第一个空格
      const spaceIndexFromEnd = str.indexOf(' ', str.length - maxLength);
      return spaceIndexFromEnd === -1
        ? omission + str.slice(-maxLength) // 没有空格则强制截断
        : omission + str.slice(spaceIndexFromEnd + 1);
    }

    // 中间截断（最复杂的情况）
    const half = Math.floor(maxLength / 2);

    // 查找前半部分的最后一个空格
    const firstSpace = str.lastIndexOf(' ', half);
    // 查找后半部分的第一个空格
    const lastSpace = str.indexOf(' ', str.length - half);

    // 处理找不到空格的情况
    if (firstSpace === -1 || lastSpace === -1) {
      return str.slice(0, half) + omission + str.slice(-half);
    }

    // 组合结果：前半部分+省略符+后半部分
    return str.slice(0, firstSpace) + omission + str.slice(lastSpace + 1);
  },
};

export default stringUtil;
export { stringUtil };
