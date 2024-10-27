/// <reference types="node" />
import crypto from 'crypto';
/**
 * 这个heavyCryptoUtil与cryptoUtil的区别是: heavyCryptoUtil 用到了node 里的crypto, 并且heavyCryptoUtil 有 rsa 非对称加密算法。
 * 两个 util 不要同时引入，heavyCryptoUtil 的体积要比cryptoUtil 大很多。如果不需要 rsa 加密，就用cryptoUtil 就好了。
 */
declare const heavyCryptoUtil: {
    /** 获取 uuid */
    uuid(): string;
    /** 获取md5摘要 */
    md5(value: string, encoding?: crypto.BinaryToTextEncoding): string;
    /** 获取hmac摘要 */
    hmac(key: string, bytes: string, algorithm?: string): string;
    /** 获取sha1摘要 */
    sha1(value: string, encoding?: crypto.BinaryToTextEncoding): string;
    /** 获取sha384摘要 */
    sha384(value: string, encoding?: crypto.BinaryToTextEncoding): string;
    /** 获取sha256摘要 */
    sha256(value: string, encoding?: crypto.BinaryToTextEncoding): string;
    /** 获取sha512摘要 */
    sha512(value: string, encoding?: crypto.BinaryToTextEncoding): string;
    /** 生成密钥对 */
    generateAesKeyAndIV(algorithm?: string): {
        key: string;
        iv: string;
    };
    /** 生成随机的字符串 */
    generateRandomString(length: number): string;
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
    base64Encode(value: string): string;
    base64Decode(value: string): string;
    privateEncrypt(privateKey: string | Buffer, buffer: string | Buffer): string;
    publicDecrypt(publicKey: string | Buffer, buffer: string | Buffer): string;
    publicEncrypt(publicKey: string | Buffer, buffer: string | Buffer): string;
    privateDecrypt(privateKey: string | Buffer, buffer: string | Buffer): string;
    generateRsaKeyPair(bits?: number): {
        publicKey: string;
        privateKey: string;
    };
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
    joinStrings(txt1: string, txt2: string): string;
    splitJoinedStrings(joinedString: string): string[];
};
export default heavyCryptoUtil;
