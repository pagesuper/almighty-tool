import assert from 'power-assert';
import formatUtil from '../../../src/utils/format.util';

describe('formatUtil.isChinaIDCard', () => {
  test('成功', async () => {
    // 正常手机号
    assert.equal(formatUtil.isChinaIDCard('340102199003146046'), true);
    // 月份错误
    assert.equal(formatUtil.isChinaIDCard('340102199013146046'), false);
    // 1月没有32日
    assert.equal(formatUtil.isChinaIDCard('340102199201326046'), false);
    // 1月没有31日
    assert.equal(formatUtil.isChinaIDCard('340102199201316046'), true);
    // 没有2月30日
    assert.equal(formatUtil.isChinaIDCard('340102199002306046'), false);
    // 平年2月没有29日
    assert.equal(formatUtil.isChinaIDCard('340102199002296046'), false);
    // 平年2月没有29日
    assert.equal(formatUtil.isChinaIDCard('340102199202296046'), true);
    // 润年2月没有29日
    assert.equal(formatUtil.isChinaIDCard('340102200002296046'), true);
    // 带有X结尾的手机号
    assert.equal(formatUtil.isChinaIDCard('34010219900314604X'), true);
    // 带有x结尾的手机号
    assert.equal(formatUtil.isChinaIDCard('34010219900314604x'), true);
    // 位数不够
    assert.equal(formatUtil.isChinaIDCard('34010219900314604'), false);
    // 位数过多
    assert.equal(formatUtil.isChinaIDCard('3401021990031460468'), false);
    // 15位身份证
    assert.equal(formatUtil.isChinaIDCard('340102990229604', 15), true);
    // 15位身份证: 位数不足
    assert.equal(formatUtil.isChinaIDCard('34010299022960', 15), false);
    // 15位身份证: 位数过多
    assert.equal(formatUtil.isChinaIDCard('3401029902296041', 15), false);
  });
});

describe('formatUtil.isEmail', () => {
  test('成功', async () => {
    assert.equal(formatUtil.isEmail('ABC'), false);
    assert.equal(formatUtil.isEmail('hello@123.com'), true);
    assert.equal(formatUtil.isEmail('hello.123@123.com'), true);
    assert.equal(formatUtil.isEmail('hello.123@123.baidu.com'), true);
    assert.equal(formatUtil.isEmail('hello-123@123.baidu.com'), true);
    assert.equal(formatUtil.isEmail('hello$123@123.baidu.com'), true);
    assert.equal(formatUtil.isEmail(' hello123@123.baidu.com'), false);
  });
});

describe('formatUtil.isPureNumber', () => {
  test('成功', async () => {
    assert.equal(formatUtil.isPureNumber('ABC'), false);
    assert.equal(formatUtil.isPureNumber('ABC123'), false);
    assert.equal(formatUtil.isPureNumber(' 123 '), false);
    assert.equal(formatUtil.isPureNumber('123'), true);
    assert.equal(formatUtil.isPureNumber('123 456'), false);
  });
});

describe('formatUtil.isChinaMobileNumber', () => {
  test('成功', async () => {
    // 位数不对
    assert.equal(formatUtil.isChinaMobileNumber('131123456789'), false);

    assert.equal(formatUtil.isChinaMobileNumber('11012345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11112345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11212345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11312345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11412345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11512345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11612345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11712345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11812345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('11912345678'), false);

    assert.equal(formatUtil.isChinaMobileNumber('12012345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12112345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12212345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12312345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12412345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12512345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12612345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12712345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12812345678'), false);
    assert.equal(formatUtil.isChinaMobileNumber('12912345678'), false);

    assert.equal(formatUtil.isChinaMobileNumber('13012345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13112345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13212345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13312345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13412345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13512345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13612345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13712345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13812345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('13912345678'), true);

    assert.equal(formatUtil.isChinaMobileNumber('14012345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14112345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14212345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14312345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14412345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14512345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14612345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14712345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14812345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('14912345678'), true);

    assert.equal(formatUtil.isChinaMobileNumber('15012345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15112345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15212345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15312345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15412345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15512345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15612345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15712345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15812345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('15912345678'), true);

    assert.equal(formatUtil.isChinaMobileNumber('16012345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16112345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16212345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16312345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16412345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16512345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16612345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16712345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16812345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('16912345678'), true);

    assert.equal(formatUtil.isChinaMobileNumber('17012345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17112345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17212345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17312345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17412345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17512345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17612345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17712345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17812345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('17912345678'), true);

    assert.equal(formatUtil.isChinaMobileNumber('18012345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18112345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18212345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18312345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18412345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18512345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18612345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18712345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18812345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('18912345678'), true);

    assert.equal(formatUtil.isChinaMobileNumber('19012345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19112345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19212345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19312345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19412345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19512345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19612345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19712345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19812345678'), true);
    assert.equal(formatUtil.isChinaMobileNumber('19912345678'), true);
  });
});

describe('general.cssStyleObjectToString()', () => {
  test('成功', async () => {
    const cssString = formatUtil.cssStyleObjectToString({
      backgroundImage: 'url(https://tva1.sinaimg.cn/large/008i3skNgy1gtj1iasx2jj615o0m87a302.jpg)',
      height: '89px',
      display: 'flex',
    });

    const cssStringExcepted =
      'background-image: url(https://tva1.sinaimg.cn/large/008i3skNgy1gtj1iasx2jj615o0m87a302.jpg); height: 89px; display: flex';

    assert.equal(cssString, cssStringExcepted);
  });
});

describe('formatUtil.isContainChinese', () => {
  test('成功', async () => {
    assert.equal(formatUtil.isContainChinese('hello'), false);
    assert.equal(formatUtil.isContainChinese('你好'), true);
    assert.equal(formatUtil.isContainChinese('你好，世界'), true);
    assert.equal(formatUtil.isContainChinese('你好，世界！'), true);
    assert.equal(formatUtil.isContainChinese('你好，世界！123'), true);
    assert.equal(formatUtil.isContainChinese('吙謃攵'), true);
    assert.equal(formatUtil.isContainChinese('體'), true);
    assert.equal(formatUtil.isContainChinese('體！123'), true);
    assert.equal(formatUtil.isContainChinese('ф̶ф̶'), false);
  });
});
