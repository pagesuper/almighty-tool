import { Options } from 'franc';
export interface GetKeyByTypeOptions extends Options {
    /**
     * - CebabCase: zh-CN (默认)
     * - SnakeCase: zh_CN
     * - Code: cmn
     */
    style?: 'SnakeCase' | 'CebabCase' | 'Code';
    /** 默认语言标识: 默认 zh-CN */
    default?: string;
}
declare const languageUtil: {
    /** 通过文本获取语言标识 */
    getKeyByText(text?: string, options?: GetKeyByTypeOptions): string;
};
export default languageUtil;
