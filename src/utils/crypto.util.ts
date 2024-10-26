import crypto from 'crypto';
import deepmerge from 'deepmerge';

interface IGenerateRsaKeyPairOptions {
  modulusLength?: number;
  publicExponent?: number;
}

const cryptoUtil = {
  // 私钥加密长文本
  longPrivateEncrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    const aesKey = this.generateAesKey('aes-128-cbc');
    const aesIv = this.generateAesIv('aes-128-cbc');
    const encryptedAesKey = this.privateEncrypt(privateKey, aesKey);
    const encryptedData = `${aesIv}${this.aesEncrypt(buffer.toString(), aesKey, aesIv)}`;
    return { encryptedAesKey, encryptedData };
  },

  // 公钥解密长文本
  longPublicDecrypt(publicKey: string | Buffer, encryptedAesKey: string, encryptedData: string) {
    const key = this.publicDecrypt(publicKey, encryptedAesKey).toString();
    const iv = encryptedData.slice(0, 16);
    return this.aesDecrypt(encryptedData.slice(16), key, iv);
  },

  // 公钥加密长文本
  longPublicEncrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    const aesKey = this.generateAesKey('aes-128-cbc');
    const aesIv = this.generateAesIv('aes-128-cbc');
    const encryptedAesKey = this.publicEncrypt(publicKey, aesKey);
    const encryptedData = `${aesIv}${this.aesEncrypt(buffer.toString(), aesKey, aesIv)}`;
    return { encryptedAesKey, encryptedData };
  },

  // 私钥解密长文本
  longPrivatgeDecrypt(privateKey: string | Buffer, encryptedAesKey: string, encryptedData: string) {
    const key = this.privateDecrypt(privateKey, encryptedAesKey).toString();
    const iv = encryptedData.slice(0, 16);
    return this.aesDecrypt(encryptedData.slice(16), key, iv);
  },

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
  generateRsaKeyPair(options: IGenerateRsaKeyPairOptions = {}) {
    const defaultOptions = {
      modulusLength: 4096,
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

  // 获取 MD5 摘要
  md5(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('md5').update(value).digest(encoding);
  },

  // 获取 SHA256 摘要
  sha256(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha256').update(value).digest(encoding);
  },

  // 获取 SHA512 摘要
  sha512(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha512').update(value).digest(encoding);
  },

  // Base64 编码
  base64Encode(value: string): string {
    return Buffer.from(value).toString('base64');
  },

  // Base64 解码
  base64Decode(value: string): string {
    return Buffer.from(value, 'base64').toString();
  },

  // 生成随机 AES IV
  generateAesIv(algorithm = 'aes-128-cbc'): string {
    const keyLength = Number(algorithm.split('-')[1]) / 8;
    return cryptoUtil.generateRandomString(keyLength);
  },

  // 生成随机 AES 密钥
  generateAesKey(algorithm = 'aes-128-cbc'): string {
    const keyLength = Number(algorithm.split('-')[1]) / 8;
    return cryptoUtil.generateRandomString(keyLength);
  },

  // 生成随机字符串
  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  },

  // AES 加密
  aesEncrypt(data: string, key: string, iv: string, algorithm = 'aes-128-cbc'): string {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    cipher.setAutoPadding(true);
    let encryptedData = cipher.update(data, 'utf8', 'base64');
    encryptedData += cipher.final('base64');
    return encryptedData;
  },

  // AES 解密
  aesDecrypt(data: string, key: string, iv: string, algorithm = 'aes-128-cbc'): string {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAutoPadding(true);
    let decryptedData = decipher.update(data, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  },
};

export default cryptoUtil;
