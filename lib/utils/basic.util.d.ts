export interface AnyObject {
    [key: string]: any;
}
export interface SetClipboardDataOptions {
    /**
     * 需要设置的内容
     */
    data: string;
    /**
     * 成功返回的回调函数
     */
    success?: (result: any) => void;
    /**
     * 失败的回调函数
     */
    fail?: (result: any) => void;
    /**
     * 结束的回调函数（调用成功、失败都会执行）
     */
    complete?: (result: any) => void;
}
export interface LikeTreeObject<T> {
    children?: T[] | null;
}
declare const basicUtil: {
    /** 树遍历 */
    treeErgodic<T extends LikeTreeObject<T>>(treeChildren: T[], callFn?: ((linkTreeObject: T) => void) | undefined): void;
    /** 过滤html标签 */
    escapeHTML(str: string): string;
    /** 将css样式对象转为字符串 */
    cssObjectToString(style: Record<string, string | boolean>): string;
    /** 文本复制: 暂支持h5端网页版 */
    setClipboardData(options: SetClipboardDataOptions): void;
    /** 根据baseUrl and queryString构造URL */
    buildUrl(url: string, query?: string | object): string;
    base64Encode(value: string): string;
    base64Decode(value: string): string;
    /** 将一个对象转为查询参数 */
    encodeQuery(query: object): string;
    /** 将编码后的查询参数解开 */
    decodeQuery(str: string): object;
    /** 睡眠等待毫秒 */
    sleep(timeout: number): Promise<void>;
    /** 异步forEach */
    forEachAsync(arr: AnyObject[], callback: (obj: AnyObject, index: number, objs: AnyObject[]) => Promise<void>): Promise<void>;
    /**
     *
     * 给一个对象数组进行去重
     *
     * @param objs
     * @param key
     */
    objectsUniqueByKey(objs: AnyObject[], key: string): AnyObject[];
    /**
     *
     * 给一个对象数组按照key来索引
     *
     * @param objs
     * @param key
     */
    objectsIndexByKey(objs: AnyObject[], key: string): {};
    /**
     *
     * 给一个对象数组fn进行索引，返回对象
     *
     * @param objs
     * @param fn
     */
    objectsIndexByFn(objs: AnyObject[], fn: (obj: AnyObject) => string): AnyObject;
    /**
     *
     * 给一个对象数组按照key来分组
     *
     * @param objs
     * @param key
     */
    objectsGroupByKey(objs: AnyObject[], key: string): {};
    /**
     *
     * 给一个对象数组按照fn来分组
     *
     * @param objs
     * @param fn
     */
    objectsGroupByFn(objs: AnyObject[], fn: (obj: AnyObject) => string): {};
    /** 将对象按照特定的key进行排序 */
    sortKeys(obj: AnyObject, options?: {
        deep?: boolean | undefined;
        compare?: ((a: string, b: string) => number) | undefined;
    }): AnyObject;
};
export default basicUtil;
