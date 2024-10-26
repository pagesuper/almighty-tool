import crypto from 'crypto';
import NodeRSA from 'node-rsa';

const rsaUtil = {
  // Base64 编码
  base64Encode(value: string): string {
    return Buffer.from(value).toString('base64');
  },

  // Base64 解码
  base64Decode(value: string): string {
    return Buffer.from(value, 'base64').toString();
  },

  // 私钥加密
  privateEncrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    const key = new NodeRSA(privateKey);
    return key.encryptPrivate(buffer, 'base64');
  },

  // 公钥解密
  publicDecrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    const key = new NodeRSA(publicKey);
    return key.decryptPublic(buffer, 'utf8');
  },

  // 公钥加密
  publicEncrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    const key = new NodeRSA(publicKey);
    return key.encrypt(buffer, 'base64');
  },

  // 私钥解密
  privateDecrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    const key = new NodeRSA(privateKey);
    return key.decrypt(buffer, 'utf8');
  },

  // 生成 RSA 密钥对
  generateRsaKeyPair(bits = 2048) {
    const key = new NodeRSA({ b: bits });
    return { publicKey: key.exportKey('public'), privateKey: key.exportKey('private') };
  },
};

export default rsaUtil;
