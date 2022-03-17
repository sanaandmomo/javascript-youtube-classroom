module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // prettier delete cr 설정 끄기
      },
    ],
    'import/extensions': [
      'off',
      {
        extensions: ['.js'], // import ... from ..js 가능하게 하기
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 13,
  },
};
