import assert from 'power-assert';
import heavyCryptoUtil from '../../../src/utils/heavy-crypto.util';

describe('heavyCryptoUtil.md5', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.md5('hello world'), '5eb63bbbe01eeed093cb22bb8f5acdc3');
  });
});

describe('heavyCryptoUtil.hmac', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.hmac('hello', 'world'), '8a3a84bcd0d0065e97f175d370447c7d02e00973');
  });
});

describe('heavyCryptoUtil.sha1', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.sha1('hello world'), '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed');
  });
});

describe('heavyCryptoUtil.sha256', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.sha256('hello world'), 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });
});

describe('heavyCryptoUtil.sha384', () => {
  test('成功', async () => {
    assert.equal(
      heavyCryptoUtil.sha384('hello world'),
      'fdbd8e75a67f29f701a4e040385e2e23986303ea10239211af907fcbb83578b3e417cb71ce646efd0819dd8c088de1bd',
    );
  });
});

describe('heavyCryptoUtil.sha512', () => {
  test('成功', async () => {
    assert.equal(
      heavyCryptoUtil.sha512('hello world'),
      '309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f',
    );
  });
});

describe('heavyCryptoUtil.base64', () => {
  test('成功', async () => {
    assert.equal(heavyCryptoUtil.base64Encode('hello world'), 'aGVsbG8gd29ybGQ=');
    assert.equal(heavyCryptoUtil.base64Decode('aGVsbG8gd29ybGQ='), 'hello world');
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
    const data = 'hello world';

    for (let index = 0; index < 1000; index++) {
      const { key, iv } = heavyCryptoUtil.generateAesKeyAndIV();
      const encrypted = heavyCryptoUtil.aesEncrypt(data, key, iv);
      // console.log('encrypted: ...', encrypted);
      assert.equal(heavyCryptoUtil.aesDecrypt(encrypted, key, iv), data);
    }
  });
});

describe('heavyCryptoUtil.rsa', () => {
  const testText = 'hello world';

  test('成功: 公钥加密，私钥解密', async () => {
    const { publicKey, privateKey } = await heavyCryptoUtil.generateRsaKeyPair();
    const publicEncrypted = await heavyCryptoUtil.publicEncrypt(publicKey, testText);
    const privateDecrypted = await heavyCryptoUtil.privateDecrypt(privateKey, publicEncrypted);
    assert.equal(privateDecrypted, testText);
  });

  test('成功: 私钥加密，公钥解密', async () => {
    const { publicKey, privateKey } = await heavyCryptoUtil.generateRsaKeyPair();
    const privateEncrypted = await heavyCryptoUtil.privateEncrypt(privateKey, testText);
    const publicDecrypted = await heavyCryptoUtil.publicDecrypt(publicKey, privateEncrypted);
    assert.equal(publicDecrypted, testText);
  });
});

describe('heavyCryptoUtil.rsa for long text', () => {
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
