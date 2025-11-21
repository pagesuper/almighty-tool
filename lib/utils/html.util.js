"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sanitize_html_1 = tslib_1.__importDefault(require("sanitize-html"));
/**
 * 默认配置
 */
var defaultOptions = {
    newlines: 'preserve',
    preserveInlineSemantics: false,
    links: 'remove',
    images: 'remove',
    lists: 'remove',
    codeBlocks: 'remove',
    tables: 'remove',
    maxNewlines: 2,
    trim: true,
    keepWhitespace: false,
};
/**
 * 将HTML转换为纯文本
 * @param html 输入的HTML字符串
 * @param options 配置选项
 * @returns 清洗后的纯文本
 */
function htmlToPlainText(html, options) {
    if (options === void 0) { options = {}; }
    var opts = tslib_1.__assign(tslib_1.__assign({}, defaultOptions), options);
    // 第一步：预处理HTML，处理块级元素和列表
    var processed = preprocessHtml(html, opts);
    // 第二步：使用sanitize-html清理，但保留文本内容
    processed = basicSanitize(processed);
    // 第三步：后处理，清理文本格式
    return postprocessText(processed, opts);
}
/**
 * 预处理HTML，处理块级元素和特殊标签
 */
function preprocessHtml(html, options) {
    var processed = html;
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
    // 定义块级元素
    var blockElements = [
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
    blockElements.forEach(function (tag) {
        var openTagRegex = new RegExp("<".concat(tag, "[^>]*>"), 'gi');
        var closeTagRegex = new RegExp("</".concat(tag, ">"), 'gi');
        processed = processed.replace(openTagRegex, '\n');
        processed = processed.replace(closeTagRegex, '\n');
    });
    // 处理hr标签
    processed = processed.replace(/<hr\s*\/?>/gi, '\n---\n');
    // 处理br标签 - 替换为换行符
    processed = processed.replace(/<br\s*\/?>/gi, '\n');
    // 处理列表
    if (options.lists !== 'remove') {
        processed = processLists(processed, options.lists);
    }
    else {
        processed = processed.replace(/<(ul|ol|li)[^>]*>/gi, '\n').replace(/<\/(ul|ol|li)>/gi, '\n');
    }
    // 处理pre标签（代码块）
    if (options.codeBlocks === 'newlines') {
        processed = processed.replace(/<pre[^>]*>/gi, '\n```\n').replace(/<\/pre>/gi, '\n```\n');
    }
    // 处理表格
    if (options.tables !== 'remove') {
        var tableSeparator = options.tables === 'tabs' ? '\t' : '\n';
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
 * 处理链接
 */
function processLinks(html, linkOption) {
    return html.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, function (match, href, text) {
        switch (linkOption) {
            case 'markdown':
                return "[".concat(text, "](").concat(href, ")");
            case 'with-url':
                return href ? "".concat(text, " [").concat(href, "]") : text;
            case 'preserve-text':
                return text;
            case 'remove':
            default:
                return '';
        }
    });
}
/**
 * 处理图片
 */
function processImages(html, imageOption) {
    return html.replace(/<img\b[^>]*alt=["']([^"']*)["'][^>]*>/gi, function (match, alt) {
        var srcMatch = match.match(/src=["']([^"']*)["']/i);
        var src = srcMatch ? srcMatch[1] : '';
        switch (imageOption) {
            case 'preserve-alt':
                return "[\u56FE\u7247: ".concat(alt, "]");
            case 'markdown':
                return "![".concat(alt, "]");
            case 'with-src':
                return src ? "[\u56FE\u7247: ".concat(alt, " (").concat(src, ")]") : "[\u56FE\u7247: ".concat(alt, "]");
            case 'remove':
            default:
                return '';
        }
    });
}
/**
 * 处理列表，添加列表标记
 */
function processLists(html, listStyle) {
    var _a;
    var listStack = [];
    var result = '';
    var i = 0;
    while (i < html.length) {
        var ulMatch = html.substring(i).match(/^<ul[^>]*>/i);
        var olMatch = html.substring(i).match(/^<ol[^>]*>/i);
        var liMatch = html.substring(i).match(/^<li[^>]*>/i);
        var ulCloseMatch = html.substring(i).match(/^<\/ul>/i);
        var olCloseMatch = html.substring(i).match(/^<\/ol>/i);
        var liCloseMatch = html.substring(i).match(/^<\/li>/i);
        if (ulMatch) {
            listStack.push({ isOrdered: false, itemCount: 0, level: listStack.length });
            result += '\n';
            i += ulMatch[0].length;
        }
        else if (olMatch) {
            listStack.push({ isOrdered: true, itemCount: 0, level: listStack.length });
            result += '\n';
            i += olMatch[0].length;
        }
        else if (liMatch) {
            if (listStack.length > 0) {
                var currentList = listStack[listStack.length - 1];
                currentList.itemCount++;
                var indent = '  '.repeat(currentList.level);
                var marker = '';
                if (listStyle === 'markdown') {
                    marker = currentList.isOrdered ? "".concat(currentList.itemCount, ". ") : '* ';
                }
                else {
                    marker = currentList.isOrdered ? "".concat(currentList.itemCount, ". ") : '• ';
                }
                result += "\n".concat(indent).concat(marker);
            }
            else {
                result += '\n';
            }
            i += liMatch[0].length;
        }
        else if (ulCloseMatch || olCloseMatch) {
            if (listStack.length > 0) {
                listStack.pop();
            }
            result += '\n';
            i += ulCloseMatch ? ulCloseMatch[0].length : (_a = olCloseMatch === null || olCloseMatch === void 0 ? void 0 : olCloseMatch[0].length) !== null && _a !== void 0 ? _a : 0;
        }
        else if (liCloseMatch) {
            result += '\n';
            i += liCloseMatch[0].length;
        }
        else {
            result += html[i];
            i++;
        }
    }
    return result;
}
/**
 * 基础清理HTML，移除所有标签但保留文本内容
 */
function basicSanitize(html) {
    var sanitizeOptions = {
        allowedTags: [], // 移除所有标签
        allowedAttributes: {}, // 不允许任何属性
        textFilter: function (text) { return text; },
    };
    return (0, sanitize_html_1.default)(html, sanitizeOptions);
}
/**
 * 后处理文本，清理格式
 */
function postprocessText(text, options) {
    var cleaned = text;
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
var htmlUtil = {
    htmlToPlainText: htmlToPlainText,
};
exports.default = htmlUtil;
//# sourceMappingURL=html.util.js.map