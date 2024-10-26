import NodeRSA from 'node-rsa';
import cryptoUtil from './crypto.util';

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

  /** 私钥加密: 对长文字进行 */
  longPrivateEncrypt(privateKey: string | Buffer, buffer: string | Buffer) {
    const { key: aesKey, iv: aesIv } = cryptoUtil.generateAesKeyAndIV();
    const encryptedAesKey = rsaUtil.privateEncrypt(privateKey, aesKey);
    const encryptedData = rsaUtil.joinStrings(aesIv, cryptoUtil.aesEncrypt(buffer.toString(), aesKey, aesIv));

    return {
      encryptedAesKey,
      encryptedData,
    };
  },
  /** 公钥解密: 对长文字进行 */
  longPublicDecrypt(publicKey: string | Buffer, encryptedAesKey: string, encryptedData: string) {
    const key = rsaUtil.publicDecrypt(publicKey, encryptedAesKey).toString();
    const [iv, encrypted] = rsaUtil.splitJoinedStrings(encryptedData);
    return cryptoUtil.aesDecrypt(encrypted, key, iv);
  },
  /** 公钥加密: 对长文字进行 */
  longPublicEncrypt(publicKey: string | Buffer, buffer: string | Buffer) {
    const { key: aesKey, iv: aesIv } = cryptoUtil.generateAesKeyAndIV();
    const encryptedAesKey = rsaUtil.publicEncrypt(publicKey, aesKey);
    const encryptedData = rsaUtil.joinStrings(aesIv, cryptoUtil.aesEncrypt(buffer.toString(), aesKey, aesIv));
    return {
      encryptedAesKey,
      encryptedData,
    };
  },
  /** 私钥解密: 对长文字进行 */
  longPrivatgeDecrypt(privateKey: string | Buffer, encryptedAesKey: string, encryptedData: string) {
    const key = rsaUtil.privateDecrypt(privateKey, encryptedAesKey).toString();
    const [iv, encrypted] = rsaUtil.splitJoinedStrings(encryptedData);
    return cryptoUtil.aesDecrypt(encrypted, key, iv);
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

export default rsaUtil;
