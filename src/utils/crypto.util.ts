import forge from 'node-forge';
import { v4 as uuidv4 } from 'uuid';
import randomUtil from './random.util';

const cryptoUtil = {
  /** 获取 uuid */
  uuid(): string {
    return uuidv4();
  },

  /** 获取md5摘要 */
  md5(value: string): string {
    const md5 = forge.md.md5.create();
    md5.update(forge.util.encodeUtf8(value));
    return md5.digest().toHex();
  },

  /** 获取hmac摘要 */
  hmac(key: string | forge.util.ByteBuffer | null, bytes: string, md: forge.md.Algorithm = 'sha256'): string {
    const hmac = forge.hmac.create();
    hmac.start(md, typeof key === 'string' ? forge.util.encodeUtf8(key) : key);
    hmac.update(forge.util.encodeUtf8(bytes));
    return hmac.digest().toHex();
  },

  /** 获取sha1摘要 */
  sha1(value: string): string {
    const sha1 = forge.md.sha1.create();
    sha1.update(forge.util.encodeUtf8(value));
    return sha1.digest().toHex();
  },

  /** 获取sha256摘要 */
  sha256(value: string): string {
    const sha256 = forge.md.sha256.create();
    sha256.update(forge.util.encodeUtf8(value));
    return sha256.digest().toHex();
  },

  /** 获取sha384摘要 */
  sha384(value: string): string {
    const sha384 = forge.md.sha384.create();
    sha384.update(forge.util.encodeUtf8(value));
    return sha384.digest().toHex();
  },

  /** 获取sha512摘要 */
  sha512(value: string): string {
    const sha512 = forge.md.sha512.create();
    sha512.update(forge.util.encodeUtf8(value));
    return sha512.digest().toHex();
  },

  /** base64编码 */
  base64Encode(value: string): string {
    return forge.util.encode64(forge.util.encodeUtf8(value));
  },

  /** base64解码 */
  base64Decode(value: string): string {
    return forge.util.decodeUtf8(forge.util.decode64(value));
  },

  /** 生成密钥对 */
  generateAesKeyAndIV(): { key: string; iv: string } {
    return {
      key: this.generateAesKey(),
      iv: this.generateAesIv(),
    };
  },

  /** 生成密钥Key */
  generateAesKey(length = 16): string {
    return cryptoUtil.generateRandomString(length);
  },

  /** 生成密钥IV */
  generateAesIv(length = 16): string {
    return cryptoUtil.generateRandomString(length);
  },

  /** 生成随机的字符串 */
  generateRandomString(length: number): string {
    return randomUtil.generateRandomString({ length, ranges: ['lower', 'number', 'upper', 'symbol'] });
  },

  /**
   * 加密
   *
   * iv-length: 192/8
   */
  aesEncrypt(data: string, key: string, iv: string, algorithm: forge.cipher.Algorithm = 'AES-CBC'): string {
    const cipher = forge.cipher.createCipher(algorithm, key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(data)));
    cipher.finish();
    return forge.util.encode64(cipher.output.data);
  },

  /**
   * 解密
   */
  aesDecrypt(data: string, key: string, iv: string, algorithm: forge.cipher.Algorithm = 'AES-CBC'): string {
    const decipher = forge.cipher.createDecipher(algorithm, key);
    decipher.start({ iv });
    decipher.update(forge.util.createBuffer(forge.util.decode64(data)));
    decipher.finish();
    return forge.util.decodeUtf8(decipher.output.data);
  },
};

export default cryptoUtil;
