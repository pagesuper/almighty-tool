import assert from 'power-assert';
import shortRsaUtil from '../../../src/utils/short-rsa.util';

describe('cryptoUtil.rsa', () => {
  const testText = 'hello world';

  test('成功: 公钥加密，私钥解密', async () => {
    const { publicKey, privateKey } = await shortRsaUtil.generateRsaKeyPair();
    const publicEncrypted = await shortRsaUtil.publicEncrypt(publicKey, testText);
    const privateDecrypted = await shortRsaUtil.privateDecrypt(privateKey, publicEncrypted);
    assert.equal(privateDecrypted, testText);
  });

  test('成功: 私钥加密，公钥解密', async () => {
    const { publicKey, privateKey } = await shortRsaUtil.generateRsaKeyPair();
    const privateEncrypted = await shortRsaUtil.privateEncrypt(privateKey, testText);
    const publicDecrypted = await shortRsaUtil.publicDecrypt(publicKey, privateEncrypted);
    assert.equal(publicDecrypted, testText);
  });
});

describe('cryptoUtil.rsa for long text', () => {
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

  // beforeAll(() => {
  //   const { privateKey: priKey, publicKey: pubKey } = cryptoUtil.generateRsaKeyPair();

  //   privateKey = priKey;
  //   publicKey = pubKey;
  // });

  // test('成功: 私钥加密，公钥解密', async () => {
  //   const { encryptedAesKey, encryptedData } = cryptoUtil.longPrivateEncrypt(privateKey, longText);
  //   const decryptedData = cryptoUtil.longPublicDecrypt(publicKey, encryptedAesKey, encryptedData);
  //   assert.equal(decryptedData, longText);
  // });

  // test('成功: 公钥加密，私钥解密', async () => {
  //   const { encryptedAesKey, encryptedData } = cryptoUtil.longPublicEncrypt(publicKey, longText);
  //   const decryptedData = cryptoUtil.longPrivatgeDecrypt(privateKey, encryptedAesKey, encryptedData);
  //   assert.equal(decryptedData, longText);
  // });
});
