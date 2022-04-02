import crypto from 'crypto';
import general from '../common/general';

/**
 * http://nodejs.cn/api/crypto.html
 */
export default {
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
    return general.generateRandomString({ length: Number(algorithm.split('-')[1]) / 8 });
  },

  /** 生成随机的aes key */
  generateAesKey(algorithm = 'aes-128-cbc'): string {
    return general.generateRandomString({ length: Number(algorithm.split('-')[1]) / 8 });
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
