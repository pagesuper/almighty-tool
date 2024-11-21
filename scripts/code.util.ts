import fs from 'fs';
import path from 'path';
import mustache from 'mustache';
import * as inflection from 'inflection';
import yargs from 'yargs';

/** 生成代码选项 */
export interface CodeUtilGenerateOptions {
  /** 模板变量 */
  data: any;
  /** 模板文件路径 */
  templatePath: string;
  /** 目标文件路径 */
  targetPath: string;
}

/** 获取生成数据选项 */
export interface CodeUtilGetGenerateDataOptions {
  /** 模型名称 */
  modelName: string;
  /** 模块路径 */
  modulePath: string;
}

export interface CodeUtilGetGenerateData {
  /* 小驼峰 eg. authCollection */
  FirstLowerModelName: string;
  /* 小驼峰复数 eg. authCollections */
  FirstLowerModelsName: string;
  /* 模块路径 eg. service-forum/src/modules/auth */
  ModulePath: string;
  /* 大驼峰 eg. AuthCollection */
  ModelName: string;
  /* 大驼峰复数 eg. AuthCollections */
  ModelsName: string;
  /* 连字符 eg. auth-collection */
  KebabCaseModelName: string;
  /* 连字符复数 eg. auth-collections */
  KebabCaseModelsName: string;
  /* 下划线 eg. auth_collection */
  UnderscoreModelName: string;
  /* 下划线复数 eg. auth_collections */
  UnderscoreModelsName: string;
  /** 其他值 */
  [key: string]: string;
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

  /** 获取布尔值 */
  getBooleanValue: (value: string | boolean) => {
    return ['true', true].includes(value);
  },

  /**
   * 获取生成数据
   * @param options 获取生成数据选项
   */
  getGenerateData: (options: CodeUtilGetGenerateDataOptions) => {
    if (!options.modelName) {
      throw new Error('modelName is required');
    }

    if (!options.modulePath) {
      throw new Error('modulePath is required');
    }

    const ModulePath = options.modulePath;
    const ModelName = inflection.camelize(options.modelName);
    const ModelsName = inflection.pluralize(ModelName);
    const UnderscoreModelName = inflection.underscore(ModelName);
    const UnderscoreModelsName = inflection.underscore(ModelsName);
    const KebabCaseModelName = inflection.dasherize(UnderscoreModelName);
    const KebabCaseModelsName = inflection.dasherize(UnderscoreModelsName);
    const FirstLowerModelName = inflection.camelize(ModelName, true);
    const FirstLowerModelsName = inflection.camelize(ModelsName, true);

    const data: CodeUtilGetGenerateData = {
      FirstLowerModelName,
      FirstLowerModelsName,
      ModulePath,
      ModelName,
      ModelsName,
      KebabCaseModelName,
      KebabCaseModelsName,
      UnderscoreModelName,
      UnderscoreModelsName,
    };

    return data;
  },

  /** 获取命令行参数 */
  getArgv: () => {
    return yargs(process.argv).argv as Record<string, any>;
  },
};

export default codeUtil;
