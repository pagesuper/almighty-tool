import assert from 'power-assert';
import heavyCryptoUtil from '../../../src/utils/heavy-crypto.util';

describe('heavyCryptoUtil.md5', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.md5('hello world'), '5eb63bbbe01eeed093cb22bb8f5acdc3');
  });
});

describe('heavyCryptoUtil.hmac', () => {
  test('成功', async () => {
    assert.equal(
      heavyCryptoUtil.hmac('hello哈哈😄', 'world哈哈😄'),
      '741174589ad790cf263b9f465078c2536070f824048e63167ff444f28aa2c02f',
    );
  });
});

describe('heavyCryptoUtil.sha1', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.sha1('hello world哈哈😄'), 'b711bb537b46990070b6ae66ecfb3ecbb4a71c7d');
  });
});

describe('heavyCryptoUtil.sha256', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.sha256('hello world哈哈😄'), '054bde7cfa7066fcc0082bf6ba03bee21145cb2c30b21f323cf6284446ef14bd');
  });
});

describe('heavyCryptoUtil.sha384', () => {
  test('成功', async () => {
    assert.equal(
      heavyCryptoUtil.sha384('hello world哈哈😄'),
      '4f51eeaec9b2339925fa275544b2ada20106c0a23f7be6fc4893622545e427f83518081af6279b570ef8926080f08b37',
    );
  });
});

describe('heavyCryptoUtil.sha512', () => {
  test('成功', async () => {
    assert.equal(
      heavyCryptoUtil.sha512('hello world哈哈😄'),
      '1312655c8f8357cead40338e99ee4d8484b619e43f47943a0da74dc86aba05d40947838c78dff7e55556826cdc8eec8cd02e8f176c35f7be6417064e83ad580c',
    );
  });
});

describe('heavyCryptoUtil.base64', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.base64Encode('hello world哈哈😄'), 'aGVsbG8gd29ybGTlk4jlk4jwn5iE');
    assert.equal(heavyCryptoUtil.base64Decode('aGVsbG8gd29ybGTlk4jlk4jwn5iE'), 'hello world哈哈😄');
  });
});

describe('heavyCryptoUtil.aes', () => {
  test('成功', async () => {
    const data = 'hello world';
    const iv = '1234567890123456';
    const key = '1234567890123456';

    assert.equal(heavyCryptoUtil.aesEncrypt(data, key, iv), 'bAx40eFUVf/hIxbaV8/GaQ==');
    assert.equal(heavyCryptoUtil.aesDecrypt('bAx40eFUVf/hIxbaV8/GaQ==', key, iv), data);

    for (let index = 0; index < 1000; index++) {
      const { key, iv } = heavyCryptoUtil.generateAesKeyAndIV();
      assert.equal(key.length, 16);
      assert.equal(iv.length, 16);
    }
  });

  test('成功: 加密，解密', async () => {
    const data = 'hello world你好哈哈😄';

    for (let index = 0; index < 1000; index++) {
      const { key, iv } = heavyCryptoUtil.generateAesKeyAndIV();
      const encrypted = heavyCryptoUtil.aesEncrypt(data, key, iv);
      // console.log(key, iv);
      assert.equal(heavyCryptoUtil.aesDecrypt(encrypted, key, iv), data);
    }
  });

  test('成功: 随机key', async () => {
    const data = 'hello world你好哈哈😄';
    const iv = '1234567890123456';

    for (let index = 0; index < 1000; index++) {
      const key = heavyCryptoUtil.generateRandomString(16);
      assert.equal(heavyCryptoUtil.aesDecrypt(heavyCryptoUtil.aesEncrypt(data, key, iv), key, iv), data);
    }
  });
});

describe('heavyCryptoUtil.rsa for long text', () => {
  const longText = `
    哈哈，😄
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
    const { privateKey, publicKey } = heavyCryptoUtil.generateRsaKeyPair();
    const { encryptedAesKey, encryptedData } = heavyCryptoUtil.longPrivateEncrypt(privateKey, longText);
    // console.log({ encryptedAesKey, encryptedData });
    const decryptedData = heavyCryptoUtil.longPublicDecrypt(publicKey, encryptedAesKey, encryptedData);
    assert.equal(decryptedData, longText);
  });

  test('成功: 公钥加密，私钥解密', async () => {
    const { privateKey, publicKey } = heavyCryptoUtil.generateRsaKeyPair();
    const { encryptedAesKey, encryptedData } = heavyCryptoUtil.longPublicEncrypt(publicKey, longText);
    // console.log({ encryptedAesKey, encryptedData });
    const decryptedData = heavyCryptoUtil.longPrivatgeDecrypt(privateKey, encryptedAesKey, encryptedData);
    assert.equal(decryptedData, longText);
  });
});
