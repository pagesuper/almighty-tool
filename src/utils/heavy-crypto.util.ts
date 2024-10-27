import crypto from 'crypto';
import NodeRSA from 'node-rsa';
import { v4 as uuidv4 } from 'uuid';

/**
 * 这个heavyCryptoUtil与cryptoUtil的区别是: heavyCryptoUtil 用到了node 里的crypto, 并且heavyCryptoUtil 有 rsa 非对称加密算法。
 * 两个 util 不要同时引入，heavyCryptoUtil 的体积要比cryptoUtil 大很多。如果不需要 rsa 加密，就用cryptoUtil 就好了。
 */

const heavyCryptoUtil = {
  /** 获取 uuid */
  uuid(): string {
    return uuidv4();
  },

  /** 获取md5摘要 */
  md5(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('md5').update(value).digest(encoding);
  },

  /** 获取hmac摘要 */
  hmac(key: string, bytes: string, algorithm = 'sha1'): string {
    const hmac = crypto.createHmac(algorithm, key);
    hmac.update(bytes);
    return hmac.digest('hex');
  },

  /** 获取sha1摘要 */
  sha1(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha1').update(value).digest(encoding);
  },

  /** 获取sha384摘要 */
  sha384(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha384').update(value).digest(encoding);
  },

  /** 获取sha256摘要 */
  sha256(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha256').update(value).digest(encoding);
  },

  /** 获取sha512摘要 */
  sha512(value: string, encoding: crypto.BinaryToTextEncoding = 'hex'): string {
    return crypto.createHash('sha512').update(value).digest(encoding);
  },

  /** 生成密钥对 */
  generateAesKeyAndIV(algorithm = 'aes-128-cbc'): { key: string; iv: string } {
    return {
      key: heavyCryptoUtil.generateRandomString(Number(algorithm.split('-')[1]) / 8),
      iv: heavyCryptoUtil.generateRandomString(Number(algorithm.split('-')[1]) / 8),
    };
  },

  /** 生成随机的字符串 */
  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    return randomString;
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

  // Base64 编码
  base64Encode(value: string): string {
    return Buffer.from(value).toString('base64');
  },

  // Base64 解码
  base64Decode(value: string): string {
    return Buffer.from(value, 'base64').toString();
  },

  // 以下是rsa相关的方法

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

  /** 私钥加密: 对长文字进行 */
  longPrivateEncrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    const { key: aesKey, iv: aesIv } = heavyCryptoUtil.generateAesKeyAndIV();
    const encryptedAesKey = heavyCryptoUtil.privateEncrypt(privateKey, aesKey);
    const encryptedData = heavyCryptoUtil.joinStrings(aesIv, heavyCryptoUtil.aesEncrypt(buffer.toString(), aesKey, aesIv));

    return {
      encryptedAesKey,
      encryptedData,
    };
  },
  /** 公钥解密: 对长文字进行 */
  longPublicDecrypt(publicKey: string | Buffer, encryptedAesKey: string, encryptedData: string) {
    const key = heavyCryptoUtil.publicDecrypt(publicKey, encryptedAesKey).toString();
    const [iv, encrypted] = heavyCryptoUtil.splitJoinedStrings(encryptedData);
    return heavyCryptoUtil.aesDecrypt(encrypted, key, iv);
  },
  /** 公钥加密: 对长文字进行 */
  longPublicEncrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    const { key: aesKey, iv: aesIv } = heavyCryptoUtil.generateAesKeyAndIV();
    const encryptedAesKey = heavyCryptoUtil.publicEncrypt(publicKey, aesKey);
    const encryptedData = heavyCryptoUtil.joinStrings(aesIv, heavyCryptoUtil.aesEncrypt(buffer.toString(), aesKey, aesIv));
    return {
      encryptedAesKey,
      encryptedData,
    };
  },
  /** 私钥解密: 对长文字进行 */
  longPrivatgeDecrypt(privateKey: string | Buffer, encryptedAesKey: string, encryptedData: string) {
    const key = heavyCryptoUtil.privateDecrypt(privateKey, encryptedAesKey).toString();
    const [iv, encrypted] = heavyCryptoUtil.splitJoinedStrings(encryptedData);
    return heavyCryptoUtil.aesDecrypt(encrypted, key, iv);
  },

  joinStrings(txt1: string, txt2: string): string {
    return [txt1, txt2].join('##');
  },

  splitJoinedStrings(joinedString: string): string[] {
    const index = joinedString.indexOf('##');
    if (index !== -1) {
      return [joinedString.slice(0, index), joinedString.slice(index + 2)];
    }
    return [joinedString];
  },
};

export default heavyCryptoUtil;
