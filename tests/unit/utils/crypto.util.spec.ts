import assert from 'power-assert';
import cryptoUtil from '../../../src/utils/crypto.util';

describe('cryptoUtil.md5', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.md5('hello world'), '5eb63bbbe01eeed093cb22bb8f5acdc3');
  });
});

describe('cryptoUtil.hmac', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.hmac('hello', 'world'), '8a3a84bcd0d0065e97f175d370447c7d02e00973');
  });
});

describe('cryptoUtil.sha1', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.sha1('hello world'), '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed');
  });
});

describe('cryptoUtil.sha256', () => {
  test('成功', async () => {
    assert.equal(cryptoUtil.sha256('hello world'), 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });
});

describe('cryptoUtil.sha384', () => {
  test('成功', async () => {
    assert.equal(
      cryptoUtil.sha384('hello world'),
      'fdbd8e75a67f29f701a4e040385e2e23986303ea10239211af907fcbb83578b3e417cb71ce646efd0819dd8c088de1bd',
    );
  });
});

describe('cryptoUtil.sha512', () => {
  test('成功', async () => {
    assert.equal(
      cryptoUtil.sha512('hello world'),
      '309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f',
    );
  });
});

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
      const { key, iv } = cryptoUtil.generateAesKeyAndIV();
      assert.equal(key.length, 32);
      assert.equal(iv.length, 16);
    }
  });

  test('成功: 加密，解密', async () => {
    const data = 'hello world';

    for (let index = 0; index < 1000; index++) {
      const { key, iv } = cryptoUtil.generateAesKeyAndIV();
      const encrypted = cryptoUtil.aesEncrypt(data, key, iv);
      // console.log(key, iv);
      assert.equal(cryptoUtil.aesDecrypt(encrypted, key, iv), data);
    }
  });

  test('成功: 随机key', async () => {
    const data = 'hello world';
    const iv = '1234567890123456';

    for (let index = 0; index < 1000; index++) {
      const key = cryptoUtil.generateRandomString(32);
      assert.equal(cryptoUtil.aesDecrypt(cryptoUtil.aesEncrypt(data, key, iv), key, iv), data);
    }
  });
});
