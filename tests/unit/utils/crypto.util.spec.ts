import assert from 'power-assert';
import cryptoUtil from '../../../src/utils/crypto.util';

describe('cryptoUtil.base64', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.base64Encode('hello world'), 'aGVsbG8gd29ybGQ=');
    assert.equal(cryptoUtil.base64Decode('aGVsbG8gd29ybGQ='), 'hello world');
  });
});

describe('cryptoUtil.aes', () => {
  test('成功', async () => {
    const data = 'hello world';
    const iv = '1234567890123456';
    const key = '1234567890123456';

    assert.equal(cryptoUtil.aesEncrypt(data, key, iv), 'bAx40eFUVf/hIxbaV8/GaQ==');
    assert.equal(cryptoUtil.aesDecrypt('bAx40eFUVf/hIxbaV8/GaQ==', key, iv), data);

    for (let index = 0; index < 1000; index++) {
      assert.equal(cryptoUtil.generateAesIv().length, 16);
      assert.equal(cryptoUtil.generateAesKey().length, 16);
    }
  });
});

describe('cryptoUtil.rsa', () => {
  let privateKey: string | Buffer;
  let publicKey: string | Buffer;

  const longText = `
    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.

    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.

    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.

    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.

    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.

    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.

    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.

    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.

    TypeScript adds additional syntax to JavaScript to support
    a tighter integration with your editor. Catch errors early in your editor.
    TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: In a browser, on Node.js or Deno and in your apps.
    TypeScript understands JavaScript and uses type inference to give you great tooling without additional code.
    `;

  beforeAll(() => {
    const { privateKey: priKey, publicKey: pubKey } = cryptoUtil.generateRsaKeyPair();

    privateKey = priKey;
    publicKey = pubKey;
  });

  test('成功: 私钥加密，公钥解密', async () => {
    const { encryptedAesKey, encryptedData } = cryptoUtil.longPrivateEncrypt(privateKey, longText);
    const decryptedData = cryptoUtil.longPublicDecrypt(publicKey, encryptedAesKey, encryptedData);
    assert.equal(decryptedData, longText);
  });

  test('成功: 公钥加密，私钥解密', async () => {
    const { encryptedAesKey, encryptedData } = cryptoUtil.longPublicEncrypt(publicKey, longText);
    const decryptedData = cryptoUtil.longPrivatgeDecrypt(privateKey, encryptedAesKey, encryptedData);
    assert.equal(decryptedData, longText);
  });
});
