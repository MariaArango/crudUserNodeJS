module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    'jest/global': true,
  },
  extends: ['airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['jest'],
  rules: {},
};
