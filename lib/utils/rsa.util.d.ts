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
};
export default rsaUtil;
