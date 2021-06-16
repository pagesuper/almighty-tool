module.exports = {
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  extends: ['stylelint-config-standard'],
  plugins: [
    // https://github.com/kristerkari/stylelint-scss
    'stylelint-scss',
  ],
  rules: {
    // https://stylelint.io/user-guide/rules/list
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements'],
      },
    ],
  },
};
