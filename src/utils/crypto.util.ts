import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import randomUtil from './random.util';
import JSEncrypt from 'jsencrypt';

type KeyEncryptionScheme = 'RSAES-PKCS1-V1_5' | 'RSA-OAEP' | 'RAW' | 'NONE' | null;
type CipherAlgorithm = 'AES-CBC' | 'AES-CTR' | 'AES-GCM' | 'AES-ECB';

const DEFAULT_KEY_ENCRYPTION_SCHEME: KeyEncryptionScheme = 'RSA-OAEP';
const DEFAULT_CIPHER_ALGORITHM: CipherAlgorithm = 'AES-CBC';
const DEFAULT_JOIN_SEPARATOR = '::';

interface AesEncryptDecryptOptions {
  algorithm?: CipherAlgorithm;
}

interface EncryptDecryptOptions {
  algorithm?: KeyEncryptionScheme;
}

interface LongEncryptDecryptOptions extends EncryptDecryptOptions {
  aesAlgorithm?: CipherAlgorithm;
  joinSeparator?: string;
}

const cryptoUtil = {
  uuid(): string {
    return uuidv4();
  },

  md5(value: string): string {
    return CryptoJS.MD5(value).toString(CryptoJS.enc.Hex);
  },

  hmac(key: string | null, bytes: string, md: 'sha1' | 'sha256' | 'sha512' = 'sha256'): string {
    const keyStr = key || '';
    if (md === 'sha1') {
      return CryptoJS.HmacSHA1(bytes, keyStr).toString(CryptoJS.enc.Hex);
    } else if (md === 'sha512') {
      return CryptoJS.HmacSHA512(bytes, keyStr).toString(CryptoJS.enc.Hex);
    } else {
      return CryptoJS.HmacSHA256(bytes, keyStr).toString(CryptoJS.enc.Hex);
    }
  },

  sha1(value: string): string {
    return CryptoJS.SHA1(value).toString(CryptoJS.enc.Hex);
  },

  sha256(value: string): string {
    return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
  },

  sha384(value: string): string {
    return CryptoJS.SHA384(value).toString(CryptoJS.enc.Hex);
  },

  sha512(value: string): string {
    return CryptoJS.SHA512(value).toString(CryptoJS.enc.Hex);
  },

  base64Encode(value: string): string {
    return CryptoJS.enc.Utf8.parse(value).toString(CryptoJS.enc.Base64);
  },

  base64Decode(value: string): string {
    return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
  },

  generateAesKeyAndIV(): { key: string; iv: string } {
    return {
      key: this.generateAesKey(),
      iv: this.generateAesIv(),
    };
  },

  generateAesKey(length = 16): string {
    return cryptoUtil.generateRandomString(length);
  },

  generateAesIv(length = 16): string {
    return cryptoUtil.generateRandomString(length);
  },

  generateRandomString(length: number): string {
    return randomUtil.generateRandomString({ length, ranges: ['lower', 'number', 'upper', 'symbol'] });
  },

  aesEncrypt(data: string, key: string, iv: string, options: AesEncryptDecryptOptions = {}): string {
    const algorithm = options.algorithm ?? DEFAULT_CIPHER_ALGORITHM;
    let result: CryptoJS.lib.CipherParams;

    if (algorithm === 'AES-CBC') {
      result = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    } else if (algorithm === 'AES-ECB') {
      result = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
    } else {
      result = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    }

    return result.ciphertext.toString(CryptoJS.enc.Base64);
  },

  aesDecrypt(data: string, key: string, iv: string, options: AesEncryptDecryptOptions = {}): string {
    const algorithm = options.algorithm ?? DEFAULT_CIPHER_ALGORITHM;
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const ivHex = CryptoJS.enc.Utf8.parse(iv);

    const decrypted = CryptoJS.AES.decrypt(data, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  },

  generateRsaKeyPair(bits = 2048): { publicKey: string; privateKey: string } {
    const jsEncrypt = new JSEncrypt({ default_key_size: String(bits) });
    const publicKey = jsEncrypt.getPublicKey();
    const privateKey = jsEncrypt.getPrivateKey();
    return { publicKey, privateKey };
  },

  publicEncrypt(publicKey: string, data: string, options: EncryptDecryptOptions = {}): string {
    const algorithm = options.algorithm ?? DEFAULT_KEY_ENCRYPTION_SCHEME;
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(publicKey);
    const encrypted = jsEncrypt.encrypt(data);
    if (!encrypted) {
      throw new Error('RSA encryption failed');
    }
    return encrypted;
  },

  privateDecrypt(privateKey: string, encrypted: string, options: EncryptDecryptOptions = {}): string {
    const algorithm = options.algorithm ?? DEFAULT_KEY_ENCRYPTION_SCHEME;
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPrivateKey(privateKey);
    const decrypted = jsEncrypt.decrypt(encrypted);
    if (!decrypted) {
      throw new Error('RSA decryption failed');
    }
    return decrypted;
  },

  longPublicEncrypt(publicKey: string, data: string, options: LongEncryptDecryptOptions = {}) {
    const algorithm = options.algorithm ?? DEFAULT_KEY_ENCRYPTION_SCHEME;
    const aesAlgorithm = options.aesAlgorithm ?? DEFAULT_CIPHER_ALGORITHM;
    const joinSeparator = options.joinSeparator ?? DEFAULT_JOIN_SEPARATOR;
    const { key: aesKey, iv } = this.generateAesKeyAndIV();

    return {
      encryptedAesKey: this.publicEncrypt(publicKey, aesKey, { algorithm }),
      encryptedData: this.joinStrings(
        cryptoUtil.base64Encode(iv),
        this.aesEncrypt(data, aesKey, iv, { algorithm: aesAlgorithm }),
        joinSeparator,
      ),
    };
  },

  longPrivateDecrypt(
    privateKey: string,
    encryptedAesKey: string,
    encryptedData: string,
    options: LongEncryptDecryptOptions = {},
  ) {
    const algorithm = options.algorithm ?? DEFAULT_KEY_ENCRYPTION_SCHEME;
    const aesAlgorithm = options.aesAlgorithm ?? DEFAULT_CIPHER_ALGORITHM;
    const joinSeparator = options.joinSeparator ?? DEFAULT_JOIN_SEPARATOR;
    const aesKey = this.privateDecrypt(privateKey, encryptedAesKey, { algorithm });
    const [iv, data] = this.splitJoinedStrings(encryptedData, joinSeparator);
    return this.aesDecrypt(data, aesKey, cryptoUtil.base64Decode(iv), { algorithm: aesAlgorithm });
  },

  joinStrings(txt1: string, txt2: string, separator: string): string {
    return [txt1, txt2].join(separator);
  },

  splitJoinedStrings(str: string, separator: string): string[] {
    const index = str.indexOf(separator);
    return index !== -1 ? [str.slice(0, index), str.slice(index + separator.length)] : [str];
  },
};

export default cryptoUtil;
export { cryptoUtil };
