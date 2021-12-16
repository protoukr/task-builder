module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint-config-standard-with-typescript',
    "prettier"
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'project': './tsconfig.eslint.json'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    '@typescript-eslint/method-signature-style': ['error', 'method'],
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/promise-function-async': 'off'
  }
};
