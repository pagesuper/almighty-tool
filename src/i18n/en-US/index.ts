import validateMessages from './validate';

const messages = {
  ...validateMessages,
  'AlmightyTool': {
    'DurationFormat': {
      'locale': 'en',
      'default': {
        'year': 'y',
        'day': 'd',
        'hour': 'h',
        'minute': 'm',
        'second': 's'
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
