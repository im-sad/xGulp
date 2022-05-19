module.exports = {
  extends: `htmlacademy/es6`,
  rules: {
    'no-console': 1,
    allowTernary : true
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

