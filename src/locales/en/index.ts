export default {
  AlmightyTool: {
    DateFormat: {
      locale: 'en',
      am: 'AM',
      pm: 'PM',
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
        today: 'h:mm A',
        tomorrow: '[Tomorrow] h:mm A',
        yesterday: '[Yesterday] h:mm A',
        thisYear: 'MMM D h:mm A',
        longAgo: 'MMM D, YYYY h:mm A',
      },
      shortStep: {
        today: 'HH:mm',
        tomorrow: '[Tomorrow] HH:mm',
        yesterday: '[Yesterday] HH:mm',
        thisYear: 'MMM D HH:mm',
        longAgo: 'MMM D, YYYY HH:mm',
      },
    },
  },
};
