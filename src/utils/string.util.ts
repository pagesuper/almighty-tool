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

const stringUtil = {
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
  truncate: (str: string, options: StringTruncateOptions): string => {
    const length = options.length;

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
