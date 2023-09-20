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

describe('formatUtil.isMobileNumber', () => {
  test('成功', async () => {
    // 位数不对
    assert.equal(formatUtil.isMobileNumber('131123456789'), false);

    assert.equal(formatUtil.isMobileNumber('11012345678'), false);
    assert.equal(formatUtil.isMobileNumber('11112345678'), false);
    assert.equal(formatUtil.isMobileNumber('11212345678'), false);
    assert.equal(formatUtil.isMobileNumber('11312345678'), false);
    assert.equal(formatUtil.isMobileNumber('11412345678'), false);
    assert.equal(formatUtil.isMobileNumber('11512345678'), false);
    assert.equal(formatUtil.isMobileNumber('11612345678'), false);
    assert.equal(formatUtil.isMobileNumber('11712345678'), false);
    assert.equal(formatUtil.isMobileNumber('11812345678'), false);
    assert.equal(formatUtil.isMobileNumber('11912345678'), false);

    assert.equal(formatUtil.isMobileNumber('12012345678'), false);
    assert.equal(formatUtil.isMobileNumber('12112345678'), false);
    assert.equal(formatUtil.isMobileNumber('12212345678'), false);
    assert.equal(formatUtil.isMobileNumber('12312345678'), false);
    assert.equal(formatUtil.isMobileNumber('12412345678'), false);
    assert.equal(formatUtil.isMobileNumber('12512345678'), false);
    assert.equal(formatUtil.isMobileNumber('12612345678'), false);
    assert.equal(formatUtil.isMobileNumber('12712345678'), false);
    assert.equal(formatUtil.isMobileNumber('12812345678'), false);
    assert.equal(formatUtil.isMobileNumber('12912345678'), false);

    assert.equal(formatUtil.isMobileNumber('13012345678'), true);
    assert.equal(formatUtil.isMobileNumber('13112345678'), true);
    assert.equal(formatUtil.isMobileNumber('13212345678'), true);
    assert.equal(formatUtil.isMobileNumber('13312345678'), true);
    assert.equal(formatUtil.isMobileNumber('13412345678'), true);
    assert.equal(formatUtil.isMobileNumber('13512345678'), true);
    assert.equal(formatUtil.isMobileNumber('13612345678'), true);
    assert.equal(formatUtil.isMobileNumber('13712345678'), true);
    assert.equal(formatUtil.isMobileNumber('13812345678'), true);
    assert.equal(formatUtil.isMobileNumber('13912345678'), true);

    assert.equal(formatUtil.isMobileNumber('14012345678'), true);
    assert.equal(formatUtil.isMobileNumber('14112345678'), true);
    assert.equal(formatUtil.isMobileNumber('14212345678'), true);
    assert.equal(formatUtil.isMobileNumber('14312345678'), true);
    assert.equal(formatUtil.isMobileNumber('14412345678'), true);
    assert.equal(formatUtil.isMobileNumber('14512345678'), true);
    assert.equal(formatUtil.isMobileNumber('14612345678'), true);
    assert.equal(formatUtil.isMobileNumber('14712345678'), true);
    assert.equal(formatUtil.isMobileNumber('14812345678'), true);
    assert.equal(formatUtil.isMobileNumber('14912345678'), true);

    assert.equal(formatUtil.isMobileNumber('15012345678'), true);
    assert.equal(formatUtil.isMobileNumber('15112345678'), true);
    assert.equal(formatUtil.isMobileNumber('15212345678'), true);
    assert.equal(formatUtil.isMobileNumber('15312345678'), true);
    assert.equal(formatUtil.isMobileNumber('15412345678'), true);
    assert.equal(formatUtil.isMobileNumber('15512345678'), true);
    assert.equal(formatUtil.isMobileNumber('15612345678'), true);
    assert.equal(formatUtil.isMobileNumber('15712345678'), true);
    assert.equal(formatUtil.isMobileNumber('15812345678'), true);
    assert.equal(formatUtil.isMobileNumber('15912345678'), true);

    assert.equal(formatUtil.isMobileNumber('16012345678'), true);
    assert.equal(formatUtil.isMobileNumber('16112345678'), true);
    assert.equal(formatUtil.isMobileNumber('16212345678'), true);
    assert.equal(formatUtil.isMobileNumber('16312345678'), true);
    assert.equal(formatUtil.isMobileNumber('16412345678'), true);
    assert.equal(formatUtil.isMobileNumber('16512345678'), true);
    assert.equal(formatUtil.isMobileNumber('16612345678'), true);
    assert.equal(formatUtil.isMobileNumber('16712345678'), true);
    assert.equal(formatUtil.isMobileNumber('16812345678'), true);
    assert.equal(formatUtil.isMobileNumber('16912345678'), true);

    assert.equal(formatUtil.isMobileNumber('17012345678'), true);
    assert.equal(formatUtil.isMobileNumber('17112345678'), true);
    assert.equal(formatUtil.isMobileNumber('17212345678'), true);
    assert.equal(formatUtil.isMobileNumber('17312345678'), true);
    assert.equal(formatUtil.isMobileNumber('17412345678'), true);
    assert.equal(formatUtil.isMobileNumber('17512345678'), true);
    assert.equal(formatUtil.isMobileNumber('17612345678'), true);
    assert.equal(formatUtil.isMobileNumber('17712345678'), true);
    assert.equal(formatUtil.isMobileNumber('17812345678'), true);
    assert.equal(formatUtil.isMobileNumber('17912345678'), true);

    assert.equal(formatUtil.isMobileNumber('18012345678'), true);
    assert.equal(formatUtil.isMobileNumber('18112345678'), true);
    assert.equal(formatUtil.isMobileNumber('18212345678'), true);
    assert.equal(formatUtil.isMobileNumber('18312345678'), true);
    assert.equal(formatUtil.isMobileNumber('18412345678'), true);
    assert.equal(formatUtil.isMobileNumber('18512345678'), true);
    assert.equal(formatUtil.isMobileNumber('18612345678'), true);
    assert.equal(formatUtil.isMobileNumber('18712345678'), true);
    assert.equal(formatUtil.isMobileNumber('18812345678'), true);
    assert.equal(formatUtil.isMobileNumber('18912345678'), true);

    assert.equal(formatUtil.isMobileNumber('19012345678'), true);
    assert.equal(formatUtil.isMobileNumber('19112345678'), true);
    assert.equal(formatUtil.isMobileNumber('19212345678'), true);
    assert.equal(formatUtil.isMobileNumber('19312345678'), true);
    assert.equal(formatUtil.isMobileNumber('19412345678'), true);
    assert.equal(formatUtil.isMobileNumber('19512345678'), true);
    assert.equal(formatUtil.isMobileNumber('19612345678'), true);
    assert.equal(formatUtil.isMobileNumber('19712345678'), true);
    assert.equal(formatUtil.isMobileNumber('19812345678'), true);
    assert.equal(formatUtil.isMobileNumber('19912345678'), true);
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
