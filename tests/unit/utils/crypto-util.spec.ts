import assert from 'power-assert';
import cryptoUtil from '../../../src/utils/crypto-util';

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
    assert.equal(cryptoUtil.generateAesIv().length, 16);
    assert.equal(cryptoUtil.generateAesKey().length, 16);
  });
});
