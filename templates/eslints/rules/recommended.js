module.exports = {
  semi: ['error', 'always'],
  'arrow-parens': ['error', 'always'],
  'vue-scoped-css/no-unused-selector': 'off',
  'comma-dangle': ['error', 'always-multiline'],
  'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1, maxEOF: 1 }],
  'no-undef': 'off',
  'no-use-before-define': 'off',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/ban-types': 'off',
  'space-before-function-paren': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/no-this-alias': [
    'error',
    {
      // Allow `const { props, state } = this`; false by default
      allowDestructuring: true,
      // Allow `const self = this`; `[]` by default
      allowedNames: ['self'],
    },
  ],
};
