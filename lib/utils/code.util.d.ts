export interface CodeUtilGenerateOptions {
    /** 模板变量 */
    data: any;
    /** 模板文件路径 */
    templatePath: string;
    /** 目标文件路径 */
    targetPath: string;
}
declare const codeUtil: {
    /**
     * 通过模板生成代码
     * @param options 生成选项
     */
    generate: (options: CodeUtilGenerateOptions) => void;
};
export default codeUtil;
