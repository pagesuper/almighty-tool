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
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv9av2VBPtBwio8iZwP2A
nrVy6Lj8XF3Bpcocb5J/yOK7ISd6hV/BVgQthJNy1HycosB5r7LFywdes3JqOZiB
W2k/95W3snXYjxMlIiwBUAUrhIytjiV1/8Fo8NpXlEGQstCqtSbThmE5seEN/rYA
jz+j+hMqxHO/6FkPELNZECGKMlcbZoT95/0BBfLS1n88jdfjSvQTU2r4IIn33vBF
33+DXJycYDR56L4GD+jkun/bsX7oXKhurWYwIX9HTcuW6K3rIEcdRax+P/7vpb8C
v856tL7Tt2/B4lT3XqzOO7wh63OkdHhhkNpXQtizTCkjie16ocKL502zqjycpNlt
+QIDAQAB
-----END PUBLIC KEY-----    
    `;

    const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAv9av2VBPtBwio8iZwP2AnrVy6Lj8XF3Bpcocb5J/yOK7ISd6
hV/BVgQthJNy1HycosB5r7LFywdes3JqOZiBW2k/95W3snXYjxMlIiwBUAUrhIyt
jiV1/8Fo8NpXlEGQstCqtSbThmE5seEN/rYAjz+j+hMqxHO/6FkPELNZECGKMlcb
ZoT95/0BBfLS1n88jdfjSvQTU2r4IIn33vBF33+DXJycYDR56L4GD+jkun/bsX7o
XKhurWYwIX9HTcuW6K3rIEcdRax+P/7vpb8Cv856tL7Tt2/B4lT3XqzOO7wh63Ok
dHhhkNpXQtizTCkjie16ocKL502zqjycpNlt+QIDAQABAoIBAAI3Q565+8Gz1X6Y
0ZXWF8c9h09C279hYdw9Ymizg4BZhhnS7+pceco5kCEI5vmnWtPSb1VlNj2rHx/p
gWqa5Vud8pw0gYOxMsgsS3CCm51GAgOs8FBFBIDoxgKKMxrGSxqVqHMhOK5Drzvr
wpKfnZAKByXbVNIiGCRh6veharTx+RmDbJZzMp6L0zWJSEIsp2RGhMj23QXgXqSM
ansugCIn1/pfi/SR/LraXfyEEat+pRNt1cGZxPd0dbgNLfgNCZtkNBNFTqfdh3yH
WoQ1oBbek0QYB1RLb20D0gD3BP1BD4b+6fjVIhFZHv6kqGgO+B69pnEz7zA5LQ91
r6/NHZECgYEA7oqmmyr4br8Wy6LtxmE9X8sJvIMPzZIMTLL2ndvFyIMhEBdwUVfI
JW+n7w0YoPQDxyBKmM3HHJtsVVEbYlwaFxSJtNW1J9oWnMlYDFotc1lw6fCwcWYJ
Nkthg8clTFt9T8J8udsGp+ltU45ei1KFtpcqJBURxXTAjFN8a4fQYa0CgYEAzeEA
nVu/mbrXaVgIKWMGfWs/a5sIdjPhB8csMpTtLFCKXjrZqrKLrc5GKlOefWm3vqUv
2hA5ZJgWin4/XUHW0IIHTyfyXS6mq6x55SJDVxhcKr+PbLEvLcMrPpIcUhm39lNs
83pL4hKQaDko+hQ6MTBjknTkC7huSJp4yXdlPv0CgYEA3AAeNn/EDofIo1kKCOuH
6kBdI3KQ8ZxgIaDwmJin6g0eQjQLz8mw+u3mqS+f5loG3fDnO9SVbcneeTVLl0Sw
f1bexlxPLokST9nWjdXhk0ALRodIg92CY4PUVPAncyvx/8y0scjSc6xyuxxUEBS0
47i5Efwonr7WEtWwq4/f3SUCgYAyPM1hmJnQcX9O/WRAdSGISTtYjqQp887djwSB
80VMovqgs8uZk6fx6XvFqFHsWHe11akvlPXsThByCwx7PS2mA5S1BBJoGpIhIh08
hHfaMN+MruHYrAPPLujGg/DVN+FkAkd7wkPyDoWeaRROsdDhX+VsP4nGMmL25HrE
7pWOIQKBgQDelafPgwpVMcwg5DcrLTicQFNwygzqPsxYIs9b7Td8MnLQn4i5O3iZ
0wasj5rXpDOBzX0Nm1C5gQnFHTVsvZ/RD/hiAtUuFoB6YdaQHoNQKqLz3dBIJZj2
57BClUsKFO6KCACjYY8uHRh2dWyaRaJIgNnDV4b97uv/4XIkir5RaA==
-----END RSA PRIVATE KEY-----    
    `;

    const { encryptedAesKey, encryptedData } = cryptoUtil.longPublicEncrypt(publicKey, longText);
    const decryptedData = cryptoUtil.longPrivateDecrypt(privateKey, encryptedAesKey, encryptedData);
    assert.equal(decryptedData, longText);
  });
});
