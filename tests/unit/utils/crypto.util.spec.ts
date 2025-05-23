import assert from 'power-assert';
import cryptoUtil from '../../../src/utils/crypto.util';

describe('cryptoUtil.md5', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.md5('helloworld哈哈😄'), '5e24b7dd11dd60898e7457572b902a3b');
  });
});

describe('cryptoUtil.hmac', () => {
  test('成功', async () => {
    assert.equal(
      cryptoUtil.hmac('hello哈哈😄', 'world哈哈😄'),
      '741174589ad790cf263b9f465078c2536070f824048e63167ff444f28aa2c02f',
    );
  });
});

describe('cryptoUtil.sha1', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.sha1('hello world哈哈😄'), 'b711bb537b46990070b6ae66ecfb3ecbb4a71c7d');
  });
});

describe('cryptoUtil.sha256', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.sha256('hello world哈哈😄'), '054bde7cfa7066fcc0082bf6ba03bee21145cb2c30b21f323cf6284446ef14bd');
  });
});

describe('cryptoUtil.sha384', () => {
  test('成功', async () => {
    assert.equal(
      cryptoUtil.sha384('hello world哈哈😄'),
      '4f51eeaec9b2339925fa275544b2ada20106c0a23f7be6fc4893622545e427f83518081af6279b570ef8926080f08b37',
    );
  });
});

describe('cryptoUtil.sha512', () => {
  test('成功', async () => {
    assert.equal(
      cryptoUtil.sha512('hello world哈哈😄'),
      '1312655c8f8357cead40338e99ee4d8484b619e43f47943a0da74dc86aba05d40947838c78dff7e55556826cdc8eec8cd02e8f176c35f7be6417064e83ad580c',
    );
  });
});

describe('cryptoUtil.base64', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.base64Encode('hello world哈哈😄'), 'aGVsbG8gd29ybGTlk4jlk4jwn5iE');
    assert.equal(cryptoUtil.base64Decode('aGVsbG8gd29ybGTlk4jlk4jwn5iE'), 'hello world哈哈😄');
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
      const { key, iv } = cryptoUtil.generateAesKeyAndIV();
      assert.equal(key.length, 16);
      assert.equal(iv.length, 16);
    }
  });

  test('成功: 加密，解密', async () => {
    const data = 'hello world你好哈哈😄';

    for (let index = 0; index < 1000; index++) {
      const { key, iv } = cryptoUtil.generateAesKeyAndIV();
      const encrypted = cryptoUtil.aesEncrypt(data, key, iv);
      // console.log(key, iv);
      assert.equal(cryptoUtil.aesDecrypt(encrypted, key, iv), data);
    }
  });

  test('成功: 随机key', async () => {
    const data = 'hello world你好哈哈😄';
    const iv = '1234567890123456';

    for (let index = 0; index < 1000; index++) {
      const key = cryptoUtil.generateRandomString(32);
      assert.equal(cryptoUtil.aesDecrypt(cryptoUtil.aesEncrypt(data, key, iv), key, iv), data);
    }
  });
});

describe('cryptoUtil.rsa for long text', () => {
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

  test('成功: 公钥加密，私钥解密', async () => {
    const { privateKey, publicKey } = cryptoUtil.generateRsaKeyPair();
    // console.log('publicKey: ', publicKey);
    // console.log('privateKey: ', privateKey);
    const { encryptedAesKey, encryptedData } = cryptoUtil.longPublicEncrypt(publicKey, longText);
    // console.log({ encryptedAesKey, encryptedData });
    const decryptedData = cryptoUtil.longPrivateDecrypt(privateKey, encryptedAesKey, encryptedData);
    assert.equal(decryptedData, longText);
  });
});

describe('cryptoUtil.rsa for long text', () => {
  const longText = '✨凌晨三点的键盘侠｜致敬那些用代码改变世界的英雄们✨  🌙​';

  test('成功: 公钥加密，私钥解密 Simple', async () => {
    const publicKey = `
-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJxpvpUCcJPlx/5FCmc5X/3aFYFybNEX
6Zf38weB65klZOxtn/or+kiKp0ONb9X0q/+ZFsgb+vKFIJdtT44exx0CAwEAAQ==
-----END PUBLIC KEY----- 
    `;

    const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBAJxpvpUCcJPlx/5FCmc5X/3aFYFybNEX6Zf38weB65klZOxtn/or
+kiKp0ONb9X0q/+ZFsgb+vKFIJdtT44exx0CAwEAAQJAB8AAkrMMf3OE+Y8TsSIp
ZLNb2e5gwGqCJ0bAmrhgA1ZAXqR/YLsou6nMCX0t7AbgjU8NGywozhsvN4GzfAhF
mQIhANXAefWs6A3068Xzlz8UwHDH78s+MidWNi2u29F2dpVFAiEAu1QCzNVpfcXz
OAJjx4gpkAKx9DrhDtCtDbKXhjGxK/kCIDoy8gIGVhiWuytmq6OtTshmZ8/620UC
oDXICmn5y0fRAiEApXEU6AKzIDlrDNRPezFuQ5mdwK0fhw4VSDuqRwIsD0ECIQCL
pB7QrgYwQ0scc/Z+9Olge+Ll7QGdrEe6Ay52mo63mg==
-----END RSA PRIVATE KEY----- 
    `;

    // let time = new Date().valueOf();
    const { encryptedAesKey, encryptedData } = cryptoUtil.longPublicEncrypt(publicKey, longText);
    // console.log('t1: ', new Date().valueOf() - time);
    // console.log({ encryptedAesKey, encryptedData });
    // time = new Date().valueOf();
    const decryptedData = cryptoUtil.longPrivateDecrypt(privateKey, encryptedAesKey, encryptedData);
    // console.log('t2: ', new Date().valueOf() - time);
    assert.equal(decryptedData, longText);
  });
});
