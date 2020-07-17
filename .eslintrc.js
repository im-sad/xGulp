module.exports = {
  extends: `htmlacademy/es6`,
  rules: {
    'no-console': 1
  },
  root: true,
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

