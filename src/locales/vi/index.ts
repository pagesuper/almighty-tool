export default {
  AlmightyTool: {
    DateFormat: {
      locale: 'vi',
      am: 'SA',
      pm: 'CH',
      formats: {
        default: 'YYYY-MM-DDTHH:mm:ssZ[Z]',
        full: 'YYYY-MM-DDTHH:mm:ssZ[Z]',
        long: 'YYYY-MM-DD HH:mm:ss',
        short: 'YYYY-MM-DD HH:mm',
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
        shortTime: 'HH:mm',
      },
      step: {
        today: 'h:mm SA/CH',
        tomorrow: '[Ngày mai] h:mm SA/CH',
        yesterday: '[Hôm qua] h:mm SA/CH',
        thisYear: 'MMM D h:mm SA/CH',
        longAgo: 'MMM D, YYYY h:mm SA/CH',
      },
      shortStep: {
        today: 'HH:mm',
        tomorrow: '[Ngày mai] HH:mm',
        yesterday: '[Hôm qua] HH:mm',
        thisYear: 'MMM D HH:mm',
        longAgo: 'MMM D, YYYY HH:mm',
      },
    },
  },
};
