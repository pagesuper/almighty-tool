/// <reference types="node" />
declare const rsaUtil: {
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
export default rsaUtil;
