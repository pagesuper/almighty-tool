/* eslint-disable no-irregular-whitespace */
import htmlUtil from '../../../src/utils/html.util'; // 根据实际文件路径调整

const htmlToPlainText = htmlUtil.htmlToPlainText;

describe('htmlToPlainText', () => {
  describe('基本功能测试', () => {
    test('空HTML返回空字符串', () => {
      const result = htmlToPlainText('');
      expect(result).toBe('');
    });

    test('纯文本保持不变', () => {
      const html = '这是一段纯文本内容';
      const result = htmlToPlainText(html);
      expect(result).toBe('这是一段纯文本内容');
    });

    test('移除简单标签', () => {
      const html = '<p>段落文本</p>';
      const result = htmlToPlainText(html);
      expect(result).toBe('段落文本');
    });
  });

  describe('换行符处理', () => {
    test('默认保留换行符', () => {
      const html = '<div>第一段</div><div>第二段</div>';
      const result = htmlToPlainText(html);
      expect(result).toBe('第一段\n\n第二段');
    });

    test('single-space模式将换行转为空格', () => {
      const html = '<div>第一段</div><div>第二段</div>';
      const result = htmlToPlainText(html, { newlines: 'single-space' });
      expect(result).toBe('第一段 第二段');
    });

    test('remove模式移除所有换行', () => {
      const html = '<div>第一段</div><div>第二段</div>';
      const result = htmlToPlainText(html, { newlines: 'remove' });
      expect(result).toBe('第一段第二段');
    });
  });

  describe('块级元素处理', () => {
    test('div标签转换为换行', () => {
      const html = '<div>内容1</div><div>内容2</div>';
      const result = htmlToPlainText(html);
      expect(result).toBe('内容1\n\n内容2');
    });

    test('p标签转换为换行', () => {
      const html = '<p>段落1</p><p>段落2</p>';
      const result = htmlToPlainText(html);
      expect(result).toBe('段落1\n\n段落2');
    });

    test('标题标签转换为换行', () => {
      const html = '<h1>标题1</h1><h2>标题2</h2><p>段落</p>';
      const result = htmlToPlainText(html);
      expect(result).toBe('标题1\n\n标题2\n\n段落');
    });

    test('br标签转换为换行', () => {
      const html = '第一行<br>第二行<br/>第三行';
      const result = htmlToPlainText(html);
      expect(result).toBe('第一行\n第二行\n第三行');
    });

    test('hr标签转换为分隔线', () => {
      const html = '上面内容<hr>下面内容';
      const result = htmlToPlainText(html);
      expect(result).toBe('上面内容\n---\n下面内容');
    });
  });

  describe('内联语义处理', () => {
    test('默认移除内联标签', () => {
      const html = '这是<strong>加粗</strong>和<em>斜体</em>文本';
      const result = htmlToPlainText(html);
      expect(result).toBe('这是加粗和斜体文本');
    });

    test('preserveInlineSemantics保留语义标记', () => {
      const html = '这是<strong>加粗</strong>和<em>斜体</em>文本';
      const result = htmlToPlainText(html, { preserveInlineSemantics: true });
      expect(result).toBe('这是**加粗**和*斜体*文本');
    });

    test('代码标签处理', () => {
      const html = '代码: <code>console.log</code>';
      const result = htmlToPlainText(html, { codeBlocks: 'preserve' });
      expect(result).toBe('代码: `console.log`');
    });
  });

  describe('链接处理', () => {
    test('默认移除链接', () => {
      const html = '<a href="https://example.com">链接文本</a>';
      const result = htmlToPlainText(html);
      expect(result).toBe('');
    });

    test('preserve-text模式保留链接文本', () => {
      const html = '<a href="https://example.com">链接文本</a>';
      const result = htmlToPlainText(html, { links: 'preserve-text' });
      expect(result).toBe('链接文本');
    });

    test('markdown模式转换为Markdown链接', () => {
      const html = '<a href="https://example.com">链接文本</a>';
      const result = htmlToPlainText(html, { links: 'markdown' });
      expect(result).toBe('[链接文本](https://example.com)');
    });
  });

  describe('图片处理', () => {
    test('默认移除图片', () => {
      const html = '<img src="image.jpg" alt="图片描述">';
      const result = htmlToPlainText(html);
      expect(result).toBe('');
    });

    test('preserve-alt模式保留alt文本', () => {
      const html = '<img src="image.jpg" alt="图片描述">';
      const result = htmlToPlainText(html, { images: 'preserve-alt' });
      expect(result).toBe('[图片: 图片描述]');
    });
  });

  describe('特殊字符处理', () => {
    test('处理HTML实体', () => {
      const html = '<p>特殊字符: &lt;&gt;&amp;&quot;</p>';
      const result = htmlToPlainText(html);
      expect(result).toBe('特殊字符: <>&"');
    });
  });

  describe('复杂HTML结构测试', () => {
    test('完整的文章HTML结构', () => {
      const html = `
        <article class="article">
          <header>
            <h1>文章标题</h1>
            <div class="meta">
              <span class="author">作者：张三</span>
              <time datetime="2023-01-01">2023年1月1日</time>
            </div>
          </header>
          <section class="content">
            <p>这是文章的<strong>第一段</strong>内容，包含<em>斜体文本</em>和<a href="https://example.com">外部链接</a>。</p>
            <p>这是第二段内容，包含<code>代码片段</code>和数学公式：E = mc<sup>2</sup>。</p>
            
            <h2>二级标题</h2>
            <p>下面是<mark>高亮文本</mark>和<small>小号文本</small>。</p>
            
            <blockquote>
              <p>这是一个引用块，包含重要的引用内容。</p>
              <footer>— 引用来源</footer>
            </blockquote>
            
            <h3>三级标题</h3>
            <ul>
              <li>无序列表项一</li>
              <li>无序列表项二
                <ul>
                  <li>嵌套列表项一</li>
                  <li>嵌套列表项二</li>
                </ul>
              </li>
              <li>无序列表项三</li>
            </ul>
            
            <ol>
              <li>有序列表项一</li>
              <li>有序列表项二
                <ol>
                  <li>嵌套有序列表一</li>
                  <li>嵌套有序列表二</li>
                </ol>
              </li>
              <li>有序列表项三</li>
            </ol>
            
            <pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>
            
            <table>
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>年龄</th>
                  <th>职业</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>张三</td>
                  <td>25</td>
                  <td>工程师</td>
                </tr>
                <tr>
                  <td>李四</td>
                  <td>30</td>
                  <td>设计师</td>
                </tr>
              </tbody>
            </table>
            
            <div class="image-gallery">
              <img src="image1.jpg" alt="图片一描述">
              <img src="image2.jpg" alt="图片二描述">
            </div>
            
            <p>最后一段包含<br>换行和<hr>水平线。</p>
          </section>
          <footer>
            <p>文章结束</p>
          </footer>
        </article>
      `;

      const result = htmlToPlainText(html);

      // 验证关键内容存在
      expect(result).toContain('文章标题');
      expect(result).toContain('作者：张三');
      expect(result).toContain('2023年1月1日');
      expect(result).toContain('第一段');
      expect(result).toContain('二级标题');
      expect(result).toContain('三级标题');
      expect(result).toContain('文章结束');
      expect(result).toContain('引用来源');

      // 验证换行处理
      expect(result).toEqual(
        `文章标题\n\n 作者：张三\n 2023年1月1日\n\n这是文章的第一段内容，包含斜体文本和。\n\n这是第二段内容，包含代码片段和数学公式：E = mc2。\n\n二级标题\n\n下面是高亮文本和小号文本。\n\n这是一个引用块，包含重要的引用内容。\n\n— 引用来源\n\n三级标题\n\n无序列表项一\n\n无序列表项二\n\n嵌套列表项一\n\n嵌套列表项二\n\n无序列表项三\n\n有序列表项一\n\n有序列表项二\n\n嵌套有序列表一\n\n嵌套有序列表二\n\n有序列表项三\n\nfunction hello() {\n console.log("Hello, World!");\n}\n\n 姓名\n 年龄\n 职业\n\n 张三\n 25\n 工程师\n\n 李四\n 30\n 设计师\n\n最后一段包含\n换行和\n---\n水平线。\n\n文章结束`,
      );
    });

    test('表单和交互元素', () => {
      const html = `
        <form>
          <fieldset>
            <legend>个人信息</legend>
            <label for="name">姓名：</label>
            <input type="text" id="name" value="张三" readonly>
            <br>
            <label for="email">邮箱：</label>
            <input type="email" id="email" value="zhangsan@example.com">
            <br>
            <select>
              <option selected>选项一</option>
              <option>选项二</option>
            </select>
            <br>
            <textarea>多行文本内容</textarea>
            <br>
            <button type="submit">提交</button>
          </fieldset>
        </form>
      `;

      const result = htmlToPlainText(html);

      // 验证关键内容存在
      expect(result).toContain('个人信息');
      expect(result).toContain('姓名：');
      expect(result).toContain('邮箱：');
      expect(result).toContain('提交');

      // 验证表单元素被移除
      expect(result).not.toContain('<input');
      expect(result).not.toContain('<select');
      expect(result).not.toContain('<button');

      expect(result).toEqual(`个人信息\n 姓名：\n\n 邮箱：\n\n 提交`);
    });

    test('多媒体和嵌入内容', () => {
      const html = `
        <div>
          <audio controls>
            <source src="audio.mp3" type="audio/mpeg">
            您的浏览器不支持音频播放
          </audio>
          <video controls width="250">
            <source src="video.mp4" type="video/mp4">
            您的浏览器不支持视频播放
          </video>
          <iframe src="https://example.com/embed"></iframe>
          <canvas width="200" height="100"></canvas>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
          </svg>
        </div>
      `;

      const result = htmlToPlainText(html);

      // 验证多媒体元素被移除，但文本内容保留
      expect(result).toContain('您的浏览器不支持音频播放');
      expect(result).toContain('您的浏览器不支持视频播放');

      // 验证多媒体标签被移除
      expect(result).not.toContain('audio');
      expect(result).not.toContain('video');
      expect(result).not.toContain('iframe');
      expect(result).not.toContain('canvas');
      expect(result).not.toContain('svg');

      expect(result).toEqual(`您的浏览器不支持音频播放\n\n 您的浏览器不支持视频播放`);
    });

    test('特殊字符和实体编码', () => {
      const html = `
      <div>
        <p>特殊字符：&lt;&gt;&amp;&quot; &apos; &copy; &reg; &trade;</p>
        <p>数学符号：&alpha; &beta; &gamma; &sum; &infin;</p>
        <p>货币符号：&euro; &pound; &yen; &cent;</p>
        <p>箭头：&larr; &rarr; &uarr; &darr;</p>
      </div>
    `;

      // <p>空格处理：前面&nbsp;后面&ensp;中间&emsp;结束</p>
      const result = htmlToPlainText(html);
      expect(result).toEqual(`特殊字符：<>&" ' © ® ™\n\n数学符号：α β γ ∑ ∞\n\n货币符号：€ £ ¥ ¢\n\n箭头：← → ↑ ↓`);
    });

    test('复杂的表格结构', () => {
      const html = `
        <table border="1">
          <caption>员工信息表</caption>
          <colgroup>
            <col span="2" style="background-color:red">
            <col style="background-color:yellow">
          </colgroup>
          <thead>
            <tr>
              <th rowspan="2">部门</th>
              <th colspan="2">基本信息</th>
              <th rowspan="2">薪资</th>
            </tr>
            <tr>
              <th>姓名</th>
              <th>职位</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="2">技术部</td>
              <td>张三</td>
              <td>前端工程师</td>
              <td>10000</td>
            </tr>
            <tr>
              <td>李四</td>
              <td>后端工程师</td>
              <td>12000</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">平均薪资</td>
              <td>11000</td>
            </tr>
          </tfoot>
        </table>
      `;

      const result = htmlToPlainText(html);

      // 验证表格内容
      expect(result).toContain('员工信息表');
      expect(result).toContain('部门');
      expect(result).toContain('姓名');
      expect(result).toContain('职位');
      expect(result).toContain('技术部');
      expect(result).toContain('张三');
      expect(result).toContain('李四');
      expect(result).toContain('平均薪资');

      expect(result).toEqual(
        '员工信息表\n\n 部门\n 基本信息\n 薪资\n\n 姓名\n 职位\n\n 技术部\n 张三\n 前端工程师\n 10000\n\n 李四\n 后端工程师\n 12000\n\n 平均薪资\n 11000',
      );
    });

    test('嵌套列表和复杂结构', () => {
      const html = `
        <div>
          <ul>
            <li>一级项目一
              <ol>
                <li>二级项目A</li>
                <li>二级项目B
                  <ul>
                    <li>三级项目i</li>
                    <li>三级项目ii</li>
                  </ul>
                </li>
              </ol>
            </li>
            <li>一级项目二
              <dl>
                <dt>术语一</dt>
                <dd>定义一</dd>
                <dt>术语二</dt>
                <dd>定义二</dd>
              </dl>
            </li>
          </ul>
        </div>
      `;

      const result = htmlToPlainText(html, { lists: 'preserve' });

      // 验证列表结构
      expect(result).toContain('一级项目一');
      expect(result).toContain('二级项目A');
      expect(result).toContain('二级项目B');
      expect(result).toContain('三级项目i');
      expect(result).toContain('三级项目ii');
      expect(result).toContain('一级项目二');
      expect(result).toContain('术语一');
      expect(result).toContain('定义一');
      expect(result).toContain('术语二');
      expect(result).toContain('定义二');

      expect(result).toEqual(
        `• 一级项目一\n\n 1. 二级项目A\n\n 2. 二级项目B\n\n • 三级项目i\n\n • 三级项目ii\n\n• 一级项目二\n\n 术语一\n 定义一\n 术语二\n 定义二`,
      );
    });

    test('Markdown兼容模式', () => {
      const html = `
        <div>
          <h1>标题</h1>
          <p>段落包含<strong>加粗</strong>和<em>斜体</em>。</p>
          <ul>
            <li>列表项一</li>
            <li>列表项二</li>
          </ul>
          <blockquote>引用内容</blockquote>
          <pre><code>代码块</code></pre>
          <a href="https://example.com">链接文本</a>
          <img src="image.jpg" alt="图片描述">
        </div>
      `;

      const result = htmlToPlainText(html, {
        preserveInlineSemantics: true,
        lists: 'markdown',
        links: 'markdown',
        images: 'markdown',
        codeBlocks: 'preserve',
      });

      // 验证Markdown元素
      expect(result).toContain('标题');
      expect(result).toContain('**加粗**');
      expect(result).toContain('*斜体*');
      expect(result).toContain('* 列表项一');
      expect(result).toContain('* 列表项二');
      expect(result).toContain('引用内容');
      expect(result).toContain('`代码块`');
      expect(result).toContain('[链接文本](https://example.com)');
      expect(result).toContain('![图片描述]');

      expect(result).toEqual(
        `标题\n\n段落包含**加粗**和*斜体*。\n\n* 列表项一\n\n* 列表项二\n\n引用内容\n\n\`代码块\`\n\n [链接文本](https://example.com)\n ![图片描述]`,
      );
    });

    test('边界情况：自闭合标签和空标签', () => {
      const html = `
        <div>
          <input type="text">
          <br>
          <hr>
          <img src="test.jpg" alt="">
          <meta charset="UTF-8">
          <link rel="stylesheet" href="style.css">
          <div></div>
          <span></span>
          <p> </p>
          <!-- 注释内容 -->
        </div>
        正常文本
      `;

      const result = htmlToPlainText(html);

      // 验证空标签被移除，正常文本保留
      expect(result).toContain('正常文本');
      expect(result).not.toContain('<input');
      expect(result).not.toContain('<meta');
      expect(result).not.toContain('<link');
      expect(result).not.toContain('<!--');

      expect(result).toEqual(`---\n\n 正常文本`);
    });

    test('XSS安全测试', () => {
      const maliciousHtml = `
        <div>
          <script>alert('XSS')</script>
          <img src="x" onerror="alert('XSS')">
          <a href="javascript:alert('XSS')">恶意链接</a>
          <iframe src="javascript:alert('XSS')"></iframe>
          <div onclick="alert('XSS')">点击我</div>
          <style>body { background: url("javascript:alert('XSS')"); }</style>
        </div>
        安全文本
      `;

      const result = htmlToPlainText(maliciousHtml);

      // 验证恶意代码被移除
      expect(result).not.toContain('script');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('onclick');
      expect(result).toContain('安全文本');

      expect(result).toEqual(`点击我\n\n 安全文本`);
    });
  });

  describe('配置选项组合测试', () => {
    test('保留所有语义', () => {
      const html = `
        <div>
          <h1>主标题</h1>
          <p>正文<strong>重要</strong>内容</p>
          <a href="https://example.com">了解更多</a>
          <img src="test.jpg" alt="示例图片">
          <ul>
            <li>要点一</li>
            <li>要点二</li>
          </ul>
        </div>
      `;

      const result = htmlToPlainText(html, {
        preserveInlineSemantics: true,
        links: 'markdown',
        images: 'preserve-alt',
        lists: 'preserve',
      });

      // 验证语义标记
      expect(result).toContain('主标题');
      expect(result).toContain('**重要**');
      expect(result).toContain('[了解更多](https://example.com)');
      expect(result).toContain('[图片: 示例图片]');
      expect(result).toContain('• 要点一');
      expect(result).toContain('• 要点二');

      expect(result).toEqual(
        `主标题\n\n正文**重要**内容\n\n [了解更多](https://example.com)\n [图片: 示例图片]\n\n• 要点一\n\n• 要点二`,
      );
    });
  });
});
