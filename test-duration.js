const { default: durationFormat } = require('./lib/formats/duration.format');

console.log('Testing durationFormat...');

// 测试中文格式
console.log('中文格式测试:');
console.log('0秒:', durationFormat.format(0));
console.log('34秒:', durationFormat.format(34));
console.log('3分0秒:', durationFormat.format(180));
console.log('4小时0分0秒:', durationFormat.format(14400));
console.log('1天12小时0分0秒:', durationFormat.format(129600));
console.log('1年0天2小时3分3秒:', durationFormat.format(31536000 + 7200 + 180 + 3));

// 测试英文格式
console.log('\n英文格式测试:');
console.log('0s:', durationFormat.format(0, { locale: 'en' }));
console.log('34s:', durationFormat.format(34, { locale: 'en' }));
console.log('3m0s:', durationFormat.format(180, { locale: 'en' }));
console.log('4h0m0s:', durationFormat.format(14400, { locale: 'en' }));
console.log('1d12h0m0s:', durationFormat.format(129600, { locale: 'en' }));
console.log('1y0d2h3m3s:', durationFormat.format(31536000 + 7200 + 180 + 3, { locale: 'en' }));

// 测试负数情况
console.log('\n负数情况测试:');
console.log('负数:', durationFormat.format(-1));

// 测试short格式化
console.log('\nshort格式化测试:');
console.log('34s:', durationFormat.format(34, { formatter: 'short' }));
console.log('3m0s:', durationFormat.format(180, { formatter: 'short' }));
console.log('4h0m0s:', durationFormat.format(14400, { formatter: 'short' }));

console.log('\n测试完成!');
