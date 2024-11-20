import forge from 'node-forge';
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
    aesEncrypt(data: string, key: string, iv: string, algorithm?: forge.cipher.Algorithm): string;
    /**
     * 解密
     */
    aesDecrypt(data: string, key: string, iv: string, algorithm?: forge.cipher.Algorithm): string;
};
export default cryptoUtil;
