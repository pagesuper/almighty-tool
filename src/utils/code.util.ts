import fs from 'fs';
import path from 'path';
import mustache from 'mustache';

export interface CodeUtilGenerateOptions {
  /** 模板变量 */
  data: any;
  /** 模板文件路径 */
  templatePath: string;
  /** 目标文件路径 */
  targetPath: string;
}

const codeUtil = {
  /**
   * 通过模板生成代码
   * @param options 生成选项
   */
  generate: (options: CodeUtilGenerateOptions) => {
    const { data: variables, templatePath, targetPath } = options;

    // 检查模板文件是否存在
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    // 确保目标目录存在
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 读取模板内容
    const template = fs.readFileSync(templatePath, 'utf-8');

    // 使用变量渲染模板
    const result = mustache.render(template, variables);

    // 写入目标文件
    fs.writeFileSync(targetPath, result, 'utf-8');
  },
};

export default codeUtil;
