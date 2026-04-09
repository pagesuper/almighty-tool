import validateMessages from './validate';

const messages = {
  ...validateMessages,
  'AlmightyTool': {
    'DurationFormat': {
      'locale': 'zh-cn',
      'default': {
        'year': '年',
        'day': '天',
        'hour': '小时',
        'minute': '分',
        'second': '秒'
      },
      'short': {
        'year': 'y',
        'day': 'd',
        'hour': 'h',
        'minute': 'm',
        'second': 's'
      }
    }
  }
};

export default messages;
