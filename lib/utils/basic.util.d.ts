export interface ISetClipboardDataOptions {
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
declare const _default: {
    /** 将css样式对象转为字符串 */
    cssObjectToString(style: Record<string, string | boolean>): string;
    /** 文本复制: 暂支持h5端网页版 */
    setClipboardData(options: ISetClipboardDataOptions): void;
    /** 根据baseUrl and queryString构造URL */
    buildUrl(url: string, query?: string | object): string;
    /** 如果未定义则转为null */
    undefinedToNull(value: any): any;
    /** 睡眠等待毫秒 */
    sleep(timeout: number): Promise<unknown>;
    /** 异步forEach */
    forEachAsync(arr: any[], callback: (obj: any, index: number, objectArr: any[]) => Promise<void>): Promise<void>;
    /**
     * 判断对象是否为空
     */
    isBlank(object: any): boolean;
    /**
     * 判断对象是否不为空
     */
    isPresent(object: any): boolean;
    /**
     * 判断对象是否为空: 如果为空则取默认值
     */
    ifBlankElse(object: any, defaultValue: any): any;
    /**
     * 判断对象是否不为空: 如果为空则取默认值
     */
    ifPresentElse(object: any, defaultValue: any): any;
    /**
     * 如果对象未定义则为默认值
     */
    ifUndefinedThen(object: any, defaultValue: any): any;
    /** 深拷贝 */
    deepCopy(value: any): any;
    /**
     *
     * 给一个对象数组进行去重
     *
     * @param objects
     * @param key
     */
    objectsUniqueByKey(objects: any, key: any): any[];
    /**
     *
     * 给一个对象数组按照key来索引
     *
     * @param objects
     * @param key
     */
    objectsIndexByKey(objects: any, key: any): {};
    /**
     *
     * 给一个对象数组fn进行索引，返回对象
     *
     * @param objects
     * @param fn
     */
    objectsIndexByFn(objects: any, fn: Function): {};
    /**
     *
     * 给一个对象数组按照key来分组
     *
     * @param objects
     * @param key
     */
    objectsGroupByKey(objects: any, key: any): {};
    /**
     *
     * 给一个对象数组按照fn来分组
     *
     * @param objects
     * @param fn
     */
    objectsGroupByFn(objects: any, fn: Function): {};
    /** 打乱一个数组 */
    shuffle(array: any[]): any[];
    /** 将对象按照特定的key进行排序 */
    sortKeys(object: any, options?: {
        deep?: boolean | undefined;
        compare?: ((a: string, b: string) => number) | undefined;
    }): any;
};
export default _default;
