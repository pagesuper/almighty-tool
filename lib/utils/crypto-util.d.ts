/// <reference types="node" />
import crypto from 'crypto';
declare const _default: {
    /** 获取md5摘要 */
    md5(value: string, encoding?: crypto.BinaryToTextEncoding): string;
    /** 获取sha256摘要 */
    sha256(value: string, encoding?: crypto.BinaryToTextEncoding): string;
    /** 获取sha512摘要 */
    sha512(value: string, encoding?: crypto.BinaryToTextEncoding): string;
    /** base64编码 */
    base64Encode(value: string): string;
    /** base64解码 */
    base64Decode(value: string): string;
    /** 生成随机的aes iv */
    generateAesIv(algorithm?: string): string;
    /** 生成随机的aes key */
    generateAesKey(algorithm?: string): string;
    /** 生成随机的字节 */
    generateRandomBytes(bytes?: number): Buffer;
    /**
     * 加密
     *
     * iv-length: 192/8
     */
    aesEncrypt(data: string, key: string, iv: string, algorithm?: string): string;
    /**
     * 解密
     */
    aesDecrypt(data: string, key: string, iv: string, algorithm?: string): string;
};
/**
 * http://nodejs.cn/api/crypto.html
 */
export default _default;
