module.exports = {
  extends: [
    'plugin:node/recommended',
    'eslint:recommended',
    'semistandard',
    'plugin:promise/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:ramda/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [ 'import', 'ramda', 'promise' ],
  rules: {
    'no-extra-semi': [ 'error' ],
    camelcase: [ 'warn' ],
    'comma-dangle': [ 'error', 'always-multiline' ],
    'no-throw-literal': [ 'warn' ],
    'prefer-promise-reject-errors': [ 'warn' ],
    semi: [ 'error', 'always' ],
    'node/no-missing-require': [ 'error' ],
    'node/no-unpublished-require': [ 'off' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'function', next: '*' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'node/no-unsupported-features/es-syntax': [ 'error', {
      version: '>=8.0.0',
      ignores: [
        'restSpreadProperties',
      ],
    } ],
  },
  env: {
    node: true,
  },
};
