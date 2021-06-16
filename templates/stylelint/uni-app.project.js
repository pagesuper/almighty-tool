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
    'unit-no-unknown': null,
    'selector-type-no-unknown': null,
    'font-family-no-missing-generic-family-keyword': null,
    'no-descending-specificity': null,
  },
};
