import cryptoUtil from '../../../src/utils/crypto-util';

describe('cryptoUtil.base64', () => {
  test('成功', async () => {
    expect(cryptoUtil.base64Encode('hello world')).toBe('aGVsbG8gd29ybGQ=');
    expect(cryptoUtil.base64Decode('aGVsbG8gd29ybGQ=')).toBe('hello world');
    expect(cryptoUtil.base64Decode('1ir6JGuhuA8oxkL4nGPvFw==').length).toBe(16);
  });
});

describe('cryptoUtil.aes', () => {
  test('成功', async () => {
    const data = 'hello world';
    const iv = '1234567890123456';
    const key = '1234567890123456';

    # console.log('cryptoUtil.generateAesKey(): ', cryptoUtil.generateAesKey());
    expect(cryptoUtil.aesEncrypt(data, key, iv)).toBe('bAx40eFUVf/hIxbaV8/GaQ==');
    expect(cryptoUtil.aesDecrypt('bAx40eFUVf/hIxbaV8/GaQ==', key, iv)).toBe(data);
    expect(cryptoUtil.generateAesIv().length).toBe(16);
    expect(cryptoUtil.generateAesKey().length).toBe(16);
  });
});
