/// <reference types="node" />
import crypto from 'crypto';
interface IGenerateRsaKeyPairOptions {
    modulusLength?: number;
    publicExponent?: number;
}
declare const _default: {
    /** 私钥加密: 对长文字进行 */
    longPrivateEncrypt(privateKey: string | Buffer, buffer: string | Buffer): {
        encryptedAesKey: string;
        encryptedData: string;
    };
    /** 公钥解密: 对长文字进行 */
    longPublicDecrypt(publicKey: string | Buffer, encryptedAesKey: string, encryptedData: string): string;
    /** 公钥加密: 对长文字进行 */
    longPublicEncrypt(publicKey: string | Buffer, buffer: string | Buffer): {
        encryptedAesKey: string;
        encryptedData: string;
    };
    /** 私钥解密: 对长文字进行 */
    longPrivatgeDecrypt(privateKey: string | Buffer, encryptedAesKey: string, encryptedData: string): string;
    /** 私钥加密 */
    privateEncrypt(privateKey: string | Buffer, buffer: string | Buffer): string;
    /** 公钥解密 */
    publicDecrypt(publicKey: string | Buffer, buffer: string | Buffer): Buffer;
    /** 公钥加密 */
    publicEncrypt(publicKey: string | Buffer, buffer: string | Buffer): string;
    /** 私钥解密 */
    privateDecrypt(privateKey: string | Buffer, buffer: string | Buffer): Buffer;
    /** 生成RSA的钥匙对 */
    generateRsaKeyPair(options?: IGenerateRsaKeyPairOptions): {
        publicKey: string;
        privateKey: string;
    };
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
