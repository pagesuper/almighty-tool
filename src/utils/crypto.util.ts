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
    md5.update(value);
    return md5.digest().toHex();
  },

  /** 获取hmac摘要 */
  hmac(key: string | forge.util.ByteBuffer | null, bytes: string, md: forge.md.Algorithm = 'sha1'): string {
    const hmac = forge.hmac.create();
    hmac.start(md, key);
    hmac.update(bytes);
    return hmac.digest().toHex();
  },

  /** 获取sha1摘要 */
  sha1(value: string): string {
    const sha1 = forge.md.sha1.create();
    sha1.update(value);
    return sha1.digest().toHex();
  },

  /** 获取sha256摘要 */
  sha256(value: string): string {
    const sha256 = forge.md.sha256.create();
    sha256.update(value);
    return sha256.digest().toHex();
  },

  /** 获取sha384摘要 */
  sha384(value: string): string {
    const sha384 = forge.md.sha384.create();
    sha384.update(value);
    return sha384.digest().toHex();
  },

  /** 获取sha512摘要 */
  sha512(value: string): string {
    const sha512 = forge.md.sha512.create();
    sha512.update(value);
    return sha512.digest().toHex();
  },

  /** base64编码 */
  base64Encode(value: string): string {
    return forge.util.encode64(value);
  },

  /** base64解码 */
  base64Decode(value: string): string {
    return forge.util.decode64(value);
  },

  /** 生成密钥对 */
  generateAesKeyAndIV(algorithm: forge.cipher.Algorithm = 'AES-CBC'): { key: string; iv: string } {
    let keyLength: number | null = null;
    let ivLength: number | null = null;

    switch (algorithm) {
      case 'AES-ECB':
      case '3DES-ECB':
      case 'DES-ECB':
        ivLength = null;
        break;
      case 'AES-CBC':
      case 'AES-CFB':
      case 'AES-OFB':
      case 'AES-CTR':
      case 'AES-GCM':
        keyLength = 16;
        ivLength = 16;
        break;
      case '3DES-CBC':
        keyLength = 24;
        ivLength = 8;
        break;
      case 'DES-CBC':
        keyLength = 8;
        ivLength = 8;
        break;
      default:
        throw new Error('unsupport the algorithm：' + algorithm);
    }

    return {
      key: keyLength ? cryptoUtil.generateRandomString(keyLength) : '',
      iv: ivLength ? cryptoUtil.generateRandomString(ivLength) : '',
    };
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
    cipher.update(forge.util.createBuffer(data));
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
    return decipher.output.data;
  },
};

export default cryptoUtil;
