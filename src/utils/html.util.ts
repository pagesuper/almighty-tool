import sanitizeHtml from 'sanitize-html';

/**
 * HTML转纯文本的配置选项
 */
export interface HtmlToTextOptions {
  /**
   * 换行符处理方式
   * - 'preserve': 保留换行符（默认）
   * - 'single-space': 将所有换行替换为单个空格
   * - 'remove': 完全移除换行符
   */
  newlines?: 'preserve' | 'single-space' | 'remove';

  /**
   * 是否保留内联标签的语义
   * - true: 为strong、em等标签添加标记（如**加粗**、*斜体*）
   * - false: 完全移除所有标签（默认）
   */
  preserveInlineSemantics?: boolean;

  /**
   * 链接处理方式
   * - 'remove': 完全移除链接，只保留文本
   * - 'preserve-text': 保留链接文本（默认）
   * - 'markdown': 转换为Markdown格式 [文本](URL)
   * - 'with-url': 在文本后添加URL (文本 [URL])
   */
  links?: 'remove' | 'preserve-text' | 'markdown' | 'with-url';

  /**
   * 图片处理方式
   * - 'remove': 完全移除图片（默认）
   * - 'preserve-alt': 保留alt文本 [图片: alt文本]
   * - 'markdown': 转换为Markdown格式 ![alt文本]
   * - 'with-src': 保留alt和src [图片: alt文本 (URL)]
   */
  images?: 'remove' | 'preserve-alt' | 'markdown' | 'with-src';

  /**
   * 列表处理方式
   * - 'remove': 移除列表标记，只保留文本（默认）
   * - 'preserve': 保留列表标记（• 用于无序列表，1. 用于有序列表）
   * - 'markdown': 转换为Markdown列表标记（* 用于无序列表，1. 用于有序列表）
   */
  lists?: 'remove' | 'preserve' | 'markdown';

  /**
   * 代码块处理方式
   * - 'remove': 移除代码格式（默认）
   * - 'preserve': 保留代码标记（`代码`）
   * - 'newlines': 将代码块转换为换行
   */
  codeBlocks?: 'remove' | 'preserve' | 'newlines';

  /**
   * 表格处理方式
   * - 'remove': 移除表格格式（默认）
   * - 'newlines': 将表格单元格转换为换行
   * - 'tabs': 用制表符分隔单元格
   */
  tables?: 'remove' | 'newlines' | 'tabs';

  /**
   * 水平线（<hr>）处理方式
   * - 'line': 转换为分隔线 "---"（默认）
   * - 'newline': 转换为单个换行符
   * - 'space': 转换为单个空格
   * - 'remove': 完全移除
   */
  horizontalRule?: 'line' | 'newline' | 'space' | 'remove';

  /**
   * 最大连续换行数
   * - 默认值：2
   */
  maxNewlines?: number;

  /**
   * 是否修剪首尾空格
   * - 默认值：true
   */
  trim?: boolean;

  /**
   * 是否保留空白文本节点
   * - true: 保留所有文本节点
   * - false: 移除空文本节点（默认）
   */
  keepWhitespace?: boolean;
}

/**
 * 默认配置
 */
const defaultOptions: Required<HtmlToTextOptions> = {
  newlines: 'preserve',
  preserveInlineSemantics: false,
  links: 'preserve-text',
  images: 'remove',
  lists: 'remove',
  codeBlocks: 'remove',
  tables: 'remove',
  horizontalRule: 'newline',
  maxNewlines: 2,
  trim: true,
  keepWhitespace: false,
};

// 列表状态跟踪
interface ListState {
  isOrdered: boolean;
  itemCount: number;
  level: number;
}

/**
 * 将HTML转换为纯文本
 * @param html 输入的HTML字符串
 * @param options 配置选项
 * @returns 清洗后的纯文本
 */
function htmlToPlainText(html: string, options: HtmlToTextOptions = {}): string {
  const opts: Required<HtmlToTextOptions> = { ...defaultOptions, ...options };

  // 第一步：预处理HTML，处理块级元素和列表
  let processed = preprocessHtml(html, opts);

  // 第二步：使用sanitize-html清理，但保留文本内容
  processed = basicSanitize(processed);

  // 第三步：后处理，清理文本格式
  return postprocessText(processed, opts);
}

/**
 * 预处理HTML，处理块级元素和特殊标签
 */
function preprocessHtml(html: string, options: Required<HtmlToTextOptions>): string {
  let processed = html;

  // 首先处理内联语义（在标签被移除前）
  if (options.preserveInlineSemantics) {
    processed = processed
      .replace(/<strong\b[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b\b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em\b[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i\b[^>]*>(.*?)<\/i>/gi, '*$1*');
  }

  // 处理代码块
  if (options.codeBlocks === 'preserve') {
    processed = processed.replace(/<code\b[^>]*>(.*?)<\/code>/gi, '`$1`');
  }

  // 处理链接
  processed = processLinks(processed, options.links);

  // 处理图片
  processed = processImages(processed, options.images);

  // 处理水平线
  processed = processHorizontalRules(processed, options.horizontalRule);

  // 定义块级元素
  const blockElements = [
    'div',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'section',
    'article',
    'header',
    'footer',
    'nav',
    'aside',
    'main',
    'figure',
    'figcaption',
    'form',
    'fieldset',
    'address',
  ];

  // 处理块级元素的开始和结束标签 - 替换为换行符
  blockElements.forEach((tag) => {
    const openTagRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
    const closeTagRegex = new RegExp(`</${tag}>`, 'gi');

    processed = processed.replace(openTagRegex, '\n');
    processed = processed.replace(closeTagRegex, '\n');
  });

  // 处理br标签 - 替换为换行符
  processed = processed.replace(/<br\s*\/?>/gi, '\n');

  // 处理列表
  if (options.lists !== 'remove') {
    processed = processLists(processed, options.lists);
  } else {
    processed = processed.replace(/<(ul|ol|li)[^>]*>/gi, '\n').replace(/<\/(ul|ol|li)>/gi, '\n');
  }

  // 处理pre标签（代码块）
  if (options.codeBlocks === 'newlines') {
    processed = processed.replace(/<pre[^>]*>/gi, '\n```\n').replace(/<\/pre>/gi, '\n```\n');
  }

  // 处理表格
  if (options.tables !== 'remove') {
    const tableSeparator = options.tables === 'tabs' ? '\t' : '\n';

    processed = processed
      .replace(/<table[^>]*>/gi, '\n')
      .replace(/<\/table>/gi, '\n')
      .replace(/<tr[^>]*>/gi, '\n')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<(td|th)[^>]*>/gi, tableSeparator)
      .replace(/<\/(td|th)>/gi, tableSeparator);
  }

  return processed;
}

/**
 * 处理水平线标签
 */
function processHorizontalRules(html: string, hrOption: string): string {
  return html.replace(/<hr\s*\/?>/gi, () => {
    switch (hrOption) {
      case 'line':
        return '\n---\n';
      case 'newline':
        return '\n';
      case 'space':
        return ' ';
      case 'remove':
      default:
        return '';
    }
  });
}

/**
 * 处理链接: 默认保留文字
 */
function processLinks(html: string, linkOption: string): string {
  return html.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, (match, href, text) => {
    switch (linkOption) {
      case 'markdown':
        return `[${text}](${href})`;
      case 'with-url':
        return href ? `${text} [${href}]` : text;
      case 'remove':
        return '';
      case 'preserve-text':
      default:
        return text;
    }
  });
}

/**
 * 处理图片
 */
function processImages(html: string, imageOption: string): string {
  return html.replace(/<img\b[^>]*alt=["']([^"']*)["'][^>]*>/gi, (match, alt) => {
    const srcMatch = match.match(/src=["']([^"']*)["']/i);
    const src = srcMatch ? srcMatch[1] : '';

    switch (imageOption) {
      case 'preserve-alt':
        return `[图片: ${alt}]`;
      case 'markdown':
        return `![${alt}]`;
      case 'with-src':
        return src ? `[图片: ${alt} (${src})]` : `[图片: ${alt}]`;
      case 'remove':
      default:
        return '';
    }
  });
}

/**
 * 处理列表，添加列表标记
 */
function processLists(html: string, listStyle: 'remove' | 'preserve' | 'markdown'): string {
  const listStack: ListState[] = [];
  let result = '';
  let i = 0;

  while (i < html.length) {
    const ulMatch = html.substring(i).match(/^<ul[^>]*>/i);
    const olMatch = html.substring(i).match(/^<ol[^>]*>/i);
    const liMatch = html.substring(i).match(/^<li[^>]*>/i);
    const ulCloseMatch = html.substring(i).match(/^<\/ul>/i);
    const olCloseMatch = html.substring(i).match(/^<\/ol>/i);
    const liCloseMatch = html.substring(i).match(/^<\/li>/i);

    if (ulMatch) {
      listStack.push({ isOrdered: false, itemCount: 0, level: listStack.length });
      result += '\n';
      i += ulMatch[0].length;
    } else if (olMatch) {
      listStack.push({ isOrdered: true, itemCount: 0, level: listStack.length });
      result += '\n';
      i += olMatch[0].length;
    } else if (liMatch) {
      if (listStack.length > 0) {
        const currentList = listStack[listStack.length - 1];
        currentList.itemCount++;

        const indent = '  '.repeat(currentList.level);
        let marker = '';

        if (listStyle === 'markdown') {
          marker = currentList.isOrdered ? `${currentList.itemCount}. ` : '* ';
        } else {
          marker = currentList.isOrdered ? `${currentList.itemCount}. ` : '• ';
        }

        result += `\n${indent}${marker}`;
      } else {
        result += '\n';
      }
      i += liMatch[0].length;
    } else if (ulCloseMatch || olCloseMatch) {
      if (listStack.length > 0) {
        listStack.pop();
      }
      result += '\n';
      i += ulCloseMatch ? ulCloseMatch[0].length : olCloseMatch?.[0].length ?? 0;
    } else if (liCloseMatch) {
      result += '\n';
      i += liCloseMatch[0].length;
    } else {
      result += html[i];
      i++;
    }
  }

  return result;
}

/**
 * 基础清理HTML，移除所有标签但保留文本内容
 */
function basicSanitize(html: string): string {
  const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: [], // 移除所有标签
    allowedAttributes: {}, // 不允许任何属性
    textFilter: (text: string) => text,
  };

  return sanitizeHtml(html, sanitizeOptions);
}

/**
 * 后处理文本，清理格式
 */
function postprocessText(text: string, options: Required<HtmlToTextOptions>): string {
  let cleaned = text;

  // 首先清理HTML实体
  cleaned = cleaned
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // 处理换行符
  switch (options.newlines) {
    case 'single-space':
      cleaned = cleaned.replace(/\s*\n\s*/g, ' ');
      break;
    case 'remove':
      cleaned = cleaned.replace(/\s*\n\s*/g, '');
      break;
    case 'preserve':
    default:
      // 合并多个连续换行，但不将换行转换为空格
      cleaned = cleaned
        .replace(/\n\s*\n/g, '\n'.repeat(options.maxNewlines + 1))
        .replace(/\n{3,}/g, '\n'.repeat(options.maxNewlines));
    // 移除了这行有问题的代码：.replace(/(\S)\n(\S)/g, '$1 $2');
  }

  // 清理多余空格（但不影响换行）
  cleaned = cleaned.replace(/[ \t]+/g, ' ');

  // 修剪首尾空格
  if (options.trim) {
    cleaned = cleaned.trim();
  }

  return cleaned;
}

const htmlUtil = {
  htmlToPlainText,
};

export default htmlUtil;
