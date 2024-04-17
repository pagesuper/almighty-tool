// https://eslint.org/docs/user-guide/configuring
module.exports = {
  extends: [require.resolve('./templates/eslints/recommended.js')],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'vue/no-unused-vars': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-template-key': 'off',
    'vue/no-v-for-template-key': 'off',
  }
};
