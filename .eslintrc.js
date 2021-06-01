module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
  },
};
