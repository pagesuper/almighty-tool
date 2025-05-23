import forge from 'node-forge';
declare type KeyEncryptionScheme = 'RSAES-PKCS1-V1_5' | 'RSA-OAEP' | 'RAW' | 'NONE' | null;
declare type CipherAlgorithm = forge.cipher.Algorithm;
declare const cryptoUtil: {
    /** 获取 uuid */
    uuid(): string;
    /** 获取md5摘要 */
    md5(value: string): string;
    /** 获取hmac摘要 */
    hmac(key: string | forge.util.ByteBuffer | null, bytes: string, md?: forge.md.Algorithm): string;
    /** 获取sha1摘要 */
    sha1(value: string): string;
    /** 获取sha256摘要 */
    sha256(value: string): string;
    /** 获取sha384摘要 */
    sha384(value: string): string;
    /** 获取sha512摘要 */
    sha512(value: string): string;
    /** base64编码 */
    base64Encode(value: string): string;
    /** base64解码 */
    base64Decode(value: string): string;
    /** 生成密钥对 */
    generateAesKeyAndIV(): {
        key: string;
        iv: string;
    };
    /** 生成密钥Key */
    generateAesKey(length?: number): string;
    /** 生成密钥IV */
    generateAesIv(length?: number): string;
    /** 生成随机的字符串 */
    generateRandomString(length: number): string;
    /**
     * 加密
     *
     * iv-length: 192/8
     */
    aesEncrypt(data: string, key: string, iv: string, algorithm?: CipherAlgorithm): string;
    /**
     * 解密
     */
    aesDecrypt(data: string, key: string, iv: string, algorithm?: CipherAlgorithm): string;
    /** ========= RSA 实现部分 ========= */
    generateRsaKeyPair(bits?: number): {
        publicKey: string;
        privateKey: string;
    };
    publicEncrypt(publicKey: string, data: string, encryptAlgorithm?: KeyEncryptionScheme): string;
    privateDecrypt(privateKey: string, encrypted: string, decryptAlgorithm?: KeyEncryptionScheme): string;
    /** 长文本混合加密 */
    longPublicEncrypt(publicKey: string, data: string, encryptAlgorithm?: KeyEncryptionScheme): {
        encryptedAesKey: string;
        encryptedData: string;
    };
    longPrivateDecrypt(privateKey: string, encryptedAesKey: string, encryptedData: string, decryptAlgorithm?: KeyEncryptionScheme): string;
    /** 辅助方法 */
    joinStrings(txt1: string, txt2: string, separator?: string): string;
    splitJoinedStrings(str: string, separator?: string): string[];
};
export default cryptoUtil;
