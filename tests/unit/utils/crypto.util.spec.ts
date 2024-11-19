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
      assert.equal(key.length, 32);
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
