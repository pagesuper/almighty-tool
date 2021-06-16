/* eslint-disable */
export interface IBasicUtil {
  /** 是否为空 */
  isBlank(object: any): boolean;
  /** 是否不为空 */
  isPresent(object: any): boolean;
  /** 判断对象是否为空: 如果为空则取默认值 */
  ifBlankElse(object: any, defaultValue: any): any;
  /** 判断对象是否不为空: 如果为空则取默认值 */
  ifPresentElse(object: any, defaultValue: any): any;
  /** 对象 */
  deepCopy(value: any): any;
  /** 补齐位数 */
  pad(n: string | number, width: number, z: string): string;
  /** 去重 */
  objectsUniqueByKey(objects: object[], key: any): object;
  /** 给一个对象数组按照key来索引  */
  objectsIndexByKey(objects: object[], key: any): object;
  /** 分组 */
  objectsGroupByKey(objects: object[], key: any): object[];
  /** 打散 */
  shuffle(arr: any[]): string[];
}
