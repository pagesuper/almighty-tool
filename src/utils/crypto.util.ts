import crypto from 'crypto';
import general from '../common/general';
import deepmerge from 'deepmerge';

interface IGenerateRsaKeyPairOptions {
  modulusLength?: number;
  publicExponent?: number;
}

/**
 * http://nodejs.cn/api/crypto.html
 */
export default {
  /** 私钥加密: 对长文字进行 */
  longPrivateEncrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    const aesKey = this.generateAesKey('aes-128-cbc');
    const aesIv = this.generateAesIv('aes-128-cbc');
    const encryptedAesKey = this.privateEncrypt(privateKey, aesKey);
    const encryptedData = `${aesIv}${this.aesEncrypt(buffer.toString(), aesKey, aesIv)}`;

    return {
      encryptedAesKey,
      encryptedData,
    };
  },

  /** 公钥解密: 对长文字进行 */
  longPublicDecrypt(publicKey: string | Buffer, encryptedAesKey: string, encryptedData: string) {
    const key = this.publicDecrypt(publicKey, encryptedAesKey).toString();
    const iv = encryptedData.slice(0, 16);
    return this.aesDecrypt(encryptedData.slice(16), key, iv);
  },

  /** 公钥加密: 对长文字进行 */
  longPublicEncrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    const aesKey = this.generateAesKey('aes-128-cbc');
    const aesIv = this.generateAesIv('aes-128-cbc');
    const encryptedAesKey = this.publicEncrypt(publicKey, aesKey);
    const encryptedData = `${aesIv}${this.aesEncrypt(buffer.toString(), aesKey, aesIv)}`;

    return {
      encryptedAesKey,
      encryptedData,
    };
  },

  /** 私钥解密: 对长文字进行 */
  longPrivatgeDecrypt(privateKey: string | Buffer, encryptedAesKey: string, encryptedData: string) {
    const key = this.privateDecrypt(privateKey, encryptedAesKey).toString();
    const iv = encryptedData.slice(0, 16);
    return this.aesDecrypt(encryptedData.slice(16), key, iv);
  },

  /** 私钥加密 */
  privateEncrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    return crypto.privateEncrypt(privateKey, Buffer.from(buffer)).toString('base64');
  },

  /** 公钥解密 */
  publicDecrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    return crypto.publicDecrypt(publicKey, Buffer.from(buffer.toString(), 'base64'));
  },

  /** 公钥加密 */
  publicEncrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    return crypto.publicEncrypt(publicKey, Buffer.from(buffer)).toString('base64');
  },

  /** 私钥解密 */
  privateDecrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    return crypto.privateDecrypt(privateKey, Buffer.from(buffer.toString(), 'base64'));
  },

  /** 生成RSA的钥匙对 */
  generateRsaKeyPair(options: IGenerateRsaKeyPairOptions = {}) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync(
      'rsa',
      deepmerge(
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            // cipher: 'aes-256-cbc',
            // passphrase: 'top secret',
          },
        },
        options,
      ),
    );

    return {
      publicKey: `${publicKey}`,
      privateKey: `${privateKey}`,
    };
  },

  /** 获取md5摘要 */
  md5(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('md5').update(value).digest(encoding);
  },

  /** 获取sha256摘要 */
  sha256(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha256').update(value).digest(encoding);
  },

  /** 获取sha512摘要 */
  sha512(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha512').update(value).digest(encoding);
  },

  /** base64编码 */
  base64Encode(value: string): string {
    return Buffer.from(value).toString('base64');
  },

  /** base64解码 */
  base64Decode(value: string): string {
    return Buffer.from(value, 'base64').toString();
  },

  /** 生成随机的aes iv */
  generateAesIv(algorithm = 'aes-128-cbc'): string {
    return general.generateRandomString({
      length: Number(algorithm.split('-')[1]) / 8,
    });
  },

  /** 生成随机的aes key */
  generateAesKey(algorithm = 'aes-128-cbc'): string {
    return general.generateRandomString({
      length: Number(algorithm.split('-')[1]) / 8,
    });
  },

  /** 生成随机的字节 */
  generateRandomBytes(bytes = 16): Buffer {
    return crypto.randomBytes(bytes);
  },

  /**
   * 加密
   *
   * iv-length: 192/8
   */
  aesEncrypt(data: string, key: string, iv: string, algorithm = 'aes-128-cbc'): string {
    const cipherChunks = [];
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
    cipherChunks.push(cipher.final('base64'));

    return cipherChunks.join('');
  },

  /**
   * 解密
   */
  aesDecrypt(data: string, key: string, iv: string, algorithm = 'aes-128-cbc'): string {
    const cipherChunks = [];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
    cipherChunks.push(decipher.final('utf8'));

    return cipherChunks.join('');
  },
};