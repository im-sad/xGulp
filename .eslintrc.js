module.exports = {
  extends: `htmlacademy/es6`,
  rules: {
    'no-console': 1,
    'quotes': ['error', 'single', {allowTemplateLiterals: true}],
    'no-unused-expressions': ['error', {allowTernary: true}],
    'space-before-function-paren': ['error', 'never'],
  },
  root: true,
  globals: {
    Swiper: `readonly`
  },
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: `module`
  },
  env: {
    es6: true,
    browser: true,
    commonjs: true
  }
};

