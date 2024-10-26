/// <reference types="node" />
import { RSAKeyPairKeyObjectOptions } from 'crypto';
declare const shortRsaUtil: {
    privateEncrypt(privateKey: string | Buffer, buffer: string | Buffer): string;
    publicDecrypt(publicKey: string | Buffer, buffer: string | Buffer): string;
    publicEncrypt(publicKey: string | Buffer, buffer: string | Buffer): string;
    privateDecrypt(privateKey: string | Buffer, buffer: string | Buffer): string;
    generateRsaKeyPair(options?: Partial<RSAKeyPairKeyObjectOptions>): {
        publicKey: string;
        privateKey: string;
    };
};
export default shortRsaUtil;
