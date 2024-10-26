import crypto, { RSAKeyPairKeyObjectOptions } from 'crypto';
import deepmerge from 'deepmerge';

const shortRsaUtil = {
  // 私钥加密
  privateEncrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    const key = typeof privateKey === 'string' ? Buffer.from(privateKey) : privateKey;
    return crypto.privateEncrypt(key, Buffer.from(buffer)).toString('base64');
  },

  // 公钥解密
  publicDecrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    const key = typeof publicKey === 'string' ? Buffer.from(publicKey) : publicKey;
    return crypto.publicDecrypt(key, Buffer.from(buffer.toString(), 'base64')).toString();
  },

  // 公钥加密
  publicEncrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    const key = typeof publicKey === 'string' ? Buffer.from(publicKey) : publicKey;
    return crypto.publicEncrypt(key, Buffer.from(buffer)).toString('base64');
  },

  // 私钥解密
  privateDecrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    const key = typeof privateKey === 'string' ? Buffer.from(privateKey) : privateKey;
    return crypto.privateDecrypt(key, Buffer.from(buffer.toString(), 'base64')).toString();
  },

  // 生成 RSA 密钥对
  generateRsaKeyPair(options: Partial<RSAKeyPairKeyObjectOptions> = {}) {
    const defaultOptions = {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    };
    const mergedOptions = deepmerge(defaultOptions, options);
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', mergedOptions);
    return { publicKey: `${publicKey}`, privateKey: `${privateKey}` };
  },
};

export default shortRsaUtil;
