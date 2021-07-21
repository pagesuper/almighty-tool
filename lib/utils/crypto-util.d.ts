declare const _default: {
    /** base64编码 */
    base64Encode(value: string): string;
    /** base64解码 */
    base64Decode(value: string): string;
    /** 生成随机的aes iv */
    generateAesIv(algorithm?: string): string;
    /** 生成随机的aes key */
    generateAesKey(algorithm?: string): string;
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
export default _default;
