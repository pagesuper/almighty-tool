import assert from 'power-assert';
import rsaUtil from '../../../src/utils/rsa.util';

describe('cryptoUtil.rsa', () => {
  const testText = 'hello world';

  test('成功: 公钥加密，私钥解密', async () => {
    const { publicKey, privateKey } = await rsaUtil.generateRsaKeyPair();
    const publicEncrypted = await rsaUtil.publicEncrypt(publicKey, testText);
    const privateDecrypted = await rsaUtil.privateDecrypt(privateKey, publicEncrypted);
    assert.equal(privateDecrypted, testText);
  });

  test('成功: 私钥加密，公钥解密', async () => {
    const { publicKey, privateKey } = await rsaUtil.generateRsaKeyPair();
    const privateEncrypted = await rsaUtil.privateEncrypt(privateKey, testText);
    const publicDecrypted = await rsaUtil.publicDecrypt(publicKey, privateEncrypted);
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

  test('成功: 私钥加密，公钥解密', async () => {
    const { privateKey, publicKey } = rsaUtil.generateRsaKeyPair();
    const { encryptedAesKey, encryptedData } = rsaUtil.longPrivateEncrypt(privateKey, longText);
    // console.log({ encryptedAesKey, encryptedData });
    const decryptedData = rsaUtil.longPublicDecrypt(publicKey, encryptedAesKey, encryptedData);
    assert.equal(decryptedData, longText);
  });

  test('成功: 公钥加密，私钥解密', async () => {
    const { privateKey, publicKey } = rsaUtil.generateRsaKeyPair();
    const { encryptedAesKey, encryptedData } = rsaUtil.longPublicEncrypt(publicKey, longText);
    // console.log({ encryptedAesKey, encryptedData });
    const decryptedData = rsaUtil.longPrivatgeDecrypt(privateKey, encryptedAesKey, encryptedData);
    assert.equal(decryptedData, longText);
  });
});
