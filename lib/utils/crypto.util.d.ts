type KeyEncryptionScheme = 'RSAES-PKCS1-V1_5' | 'RSA-OAEP' | 'RAW' | 'NONE' | null;
type CipherAlgorithm = 'AES-CBC' | 'AES-CTR' | 'AES-GCM' | 'AES-ECB';
interface AesEncryptDecryptOptions {
    algorithm?: CipherAlgorithm;
}
interface EncryptDecryptOptions {
    algorithm?: KeyEncryptionScheme;
}
interface LongEncryptDecryptOptions extends EncryptDecryptOptions {
    aesAlgorithm?: CipherAlgorithm;
    joinSeparator?: string;
}
declare const cryptoUtil: {
    uuid(): string;
    md5(value: string): string;
    hmac(key: string | null, bytes: string, md?: "sha1" | "sha256" | "sha512"): string;
    sha1(value: string): string;
    sha256(value: string): string;
    sha384(value: string): string;
    sha512(value: string): string;
    base64Encode(value: string): string;
    base64Decode(value: string): string;
    generateAesKeyAndIV(): {
        key: string;
        iv: string;
    };
    generateAesKey(length?: number): string;
    generateAesIv(length?: number): string;
    generateRandomString(length: number): string;
    aesEncrypt(data: string, key: string, iv: string, options?: AesEncryptDecryptOptions): string;
    aesDecrypt(data: string, key: string, iv: string, options?: AesEncryptDecryptOptions): string;
    generateRsaKeyPair(bits?: number): {
        publicKey: string;
        privateKey: string;
    };
    publicEncrypt(publicKey: string, data: string, options?: EncryptDecryptOptions): string;
    privateDecrypt(privateKey: string, encrypted: string, options?: EncryptDecryptOptions): string;
    longPublicEncrypt(publicKey: string, data: string, options?: LongEncryptDecryptOptions): {
        encryptedAesKey: string;
        encryptedData: string;
    };
    longPrivateDecrypt(privateKey: string, encryptedAesKey: string, encryptedData: string, options?: LongEncryptDecryptOptions): string;
    joinStrings(txt1: string, txt2: string, separator: string): string;
    splitJoinedStrings(str: string, separator: string): string[];
};
export default cryptoUtil;
export { cryptoUtil };
