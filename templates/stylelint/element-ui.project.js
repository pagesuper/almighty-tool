module.exports = {
  extends: [require.resolve('./recommended.js')],
  rules: {
    'no-descending-specificity': null,
    'property-no-unknown': null,
    'selector-pseudo-class-no-unknown': null,
    'selector-pseudo-element-colon-notation': null,
    'at-rule-no-unknown': null,
    'property-case': null,
  },
};
