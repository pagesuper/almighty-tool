import forge from 'node-forge';

const cryptoUtil = {
  /** 获取md5摘要 */
  md5(value: string): string {
    const md5 = forge.md.md5.create();
    md5.update(value);
    return md5.digest().toHex();
  },

  /** 获取sha256摘要 */
  sha256(value: string): string {
    const sha256 = forge.md.sha256.create();
    sha256.update(value);
    return sha256.digest().toHex();
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

  generateAesKeyAndIV(algorithm: forge.cipher.Algorithm = 'AES-CBC'): { key: string; iv: string } {
    let key: forge.Bytes;
    let iv: forge.Bytes | null;

    if (
      algorithm === 'AES-ECB' ||
      algorithm === 'AES-CBC' ||
      algorithm === 'AES-CFB' ||
      algorithm === 'AES-OFB' ||
      algorithm === 'AES-CTR' ||
      algorithm === 'AES-GCM'
    ) {
      // 对于AES相关算法，通常密钥长度可以是128位、192位或256位等，这里以128位（16字节）为例
      key = cryptoUtil.generateRandomString(16);
      // 对于需要初始向量的模式（如CBC、CFB、OFB、GCM等），AES的IV通常也是16字节
      if (algorithm !== 'AES-ECB') {
        iv = cryptoUtil.generateRandomString(16);
      } else {
        iv = null;
      }
    } else if (algorithm === '3DES-ECB' || algorithm === '3DES-CBC') {
      // 3DES的密钥长度通常基于其自身特性，这里以标准的192位（24字节）为例
      key = cryptoUtil.generateRandomString(24);
      // 对于需要初始向量的模式（如3DES-CBC），3DES的IV通常是8字节
      if (algorithm === '3DES-CBC') {
        iv = cryptoUtil.generateRandomString(8);
      } else {
        iv = null;
      }
    } else if (algorithm === 'DES-ECB' || algorithm === 'DES-CBC') {
      // DES的密钥长度通常是64位（8字节）
      key = cryptoUtil.generateRandomString(8);
      // 对于需要初始向量的模式（如DES-CBC），DES的IV通常是8字节
      if (algorithm === 'DES-CBC') {
        iv = cryptoUtil.generateRandomString(8);
      } else {
        iv = null;
      }
    } else {
      throw new Error('unsupport the algorithm：' + algorithm);
    }

    return {
      key,
      iv: iv ?? '',
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
