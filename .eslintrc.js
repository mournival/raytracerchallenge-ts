module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',

  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ]};
