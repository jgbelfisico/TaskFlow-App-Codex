module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-process-exit': 'off'
  }
}
