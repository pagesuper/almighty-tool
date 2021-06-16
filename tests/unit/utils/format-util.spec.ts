import formatUtil from '../../../src/utils/format-util';

describe('formatUtil.showDatetime', () => {
  test('成功', async () => {
    const date = new Date(Date.parse('2020/02/29 23:34:43'));

    expect(formatUtil.showDatetime(date, 'long', 'en-US')).toEqual('2020-02-29 23:34:43');
    expect(formatUtil.showDatetime(date, 'date', 'en-US')).toEqual('2020-02-29');
    expect(formatUtil.showDatetime(date, 'shortDate', 'en-US')).toEqual('02-29');
    expect(formatUtil.showDatetime(date, 'time', 'en-US')).toEqual('23:34:43');
    expect(formatUtil.showDatetime(date, 'shortTime', 'en-US')).toEqual('23:34');

    expect(formatUtil.showDatetime(date, 'long', 'zh-CN')).toEqual('2020年02月29日 23:34:43');
    expect(formatUtil.showDatetime(date, 'date', 'zh-CN')).toEqual('2020年02月29日');
    expect(formatUtil.showDatetime(date, 'shortDate', 'zh-CN')).toEqual('02月29日');
    expect(formatUtil.showDatetime(date, 'time', 'zh-CN')).toEqual('23:34:43');
    expect(formatUtil.showDatetime(date, 'shortTime', 'zh-CN')).toEqual('23:34');
  });
});

describe('formatUtil.isChinaIDCard', () => {
  test('成功', async () => {
    // 正常手机号
    expect(formatUtil.isChinaIDCard('340102199003146046')).toBe(true);
    // 月份错误
    expect(formatUtil.isChinaIDCard('340102199013146046')).toBe(false);
    // 1月没有32日
    expect(formatUtil.isChinaIDCard('340102199201326046')).toBe(false);
    // 1月没有31日
    expect(formatUtil.isChinaIDCard('340102199201316046')).toBe(true);
    // 没有2月30日
    expect(formatUtil.isChinaIDCard('340102199002306046')).toBe(false);
    // 平年2月没有29日
    expect(formatUtil.isChinaIDCard('340102199002296046')).toBe(false);
    // 平年2月没有29日
    expect(formatUtil.isChinaIDCard('340102199202296046')).toBe(true);
    // 润年2月没有29日
    expect(formatUtil.isChinaIDCard('340102200002296046')).toBe(true);
    // 带有X结尾的手机号
    expect(formatUtil.isChinaIDCard('34010219900314604X')).toBe(true);
    // 带有x结尾的手机号
    expect(formatUtil.isChinaIDCard('34010219900314604x')).toBe(true);
    // 位数不够
    expect(formatUtil.isChinaIDCard('34010219900314604')).toBe(false);
    // 位数过多
    expect(formatUtil.isChinaIDCard('3401021990031460468')).toBe(false);
    // 15位身份证
    expect(formatUtil.isChinaIDCard('340102990229604', 15)).toBe(true);
    // 15位身份证: 位数不足
    expect(formatUtil.isChinaIDCard('34010299022960', 15)).toBe(false);
    // 15位身份证: 位数过多
    expect(formatUtil.isChinaIDCard('3401029902296041', 15)).toBe(false);
  });
});

describe('formatUtil.isEmail', () => {
  test('成功', async () => {
    expect(formatUtil.isEmail('ABC')).toBe(false);
    expect(formatUtil.isEmail('hello@123.com')).toBe(true);
    expect(formatUtil.isEmail('hello.123@123.com')).toBe(true);
    expect(formatUtil.isEmail('hello.123@123.baidu.com')).toBe(true);
    expect(formatUtil.isEmail('hello-123@123.baidu.com')).toBe(true);
    expect(formatUtil.isEmail('hello$123@123.baidu.com')).toBe(true);
    expect(formatUtil.isEmail(' hello123@123.baidu.com')).toBe(false);
  });
});

describe('formatUtil.isPureNumber', () => {
  test('成功', async () => {
    expect(formatUtil.isPureNumber('ABC')).toBe(false);
    expect(formatUtil.isPureNumber('ABC123')).toBe(false);
    expect(formatUtil.isPureNumber(' 123 ')).toBe(false);
    expect(formatUtil.isPureNumber('123')).toBe(true);
    expect(formatUtil.isPureNumber('123 456')).toBe(false);
  });
});

describe('formatUtil.isMobilePhone', () => {
  test('成功', async () => {
    // 位数不对
    expect(formatUtil.isMobilePhone('131123456789')).toBe(false);

    expect(formatUtil.isMobilePhone('11012345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11112345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11212345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11312345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11412345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11512345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11612345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11712345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11812345678')).toBe(false);
    expect(formatUtil.isMobilePhone('11912345678')).toBe(false);

    expect(formatUtil.isMobilePhone('12012345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12112345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12212345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12312345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12412345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12512345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12612345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12712345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12812345678')).toBe(false);
    expect(formatUtil.isMobilePhone('12912345678')).toBe(false);

    expect(formatUtil.isMobilePhone('13012345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13112345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13212345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13312345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13412345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13512345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13612345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13712345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13812345678')).toBe(true);
    expect(formatUtil.isMobilePhone('13912345678')).toBe(true);

    expect(formatUtil.isMobilePhone('14012345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14112345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14212345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14312345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14412345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14512345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14612345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14712345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14812345678')).toBe(true);
    expect(formatUtil.isMobilePhone('14912345678')).toBe(true);

    expect(formatUtil.isMobilePhone('15012345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15112345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15212345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15312345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15412345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15512345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15612345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15712345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15812345678')).toBe(true);
    expect(formatUtil.isMobilePhone('15912345678')).toBe(true);

    expect(formatUtil.isMobilePhone('16012345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16112345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16212345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16312345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16412345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16512345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16612345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16712345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16812345678')).toBe(true);
    expect(formatUtil.isMobilePhone('16912345678')).toBe(true);

    expect(formatUtil.isMobilePhone('17012345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17112345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17212345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17312345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17412345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17512345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17612345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17712345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17812345678')).toBe(true);
    expect(formatUtil.isMobilePhone('17912345678')).toBe(true);

    expect(formatUtil.isMobilePhone('18012345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18112345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18212345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18312345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18412345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18512345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18612345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18712345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18812345678')).toBe(true);
    expect(formatUtil.isMobilePhone('18912345678')).toBe(true);

    expect(formatUtil.isMobilePhone('19012345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19112345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19212345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19312345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19412345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19512345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19612345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19712345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19812345678')).toBe(true);
    expect(formatUtil.isMobilePhone('19912345678')).toBe(true);
  });
});
