const path = require('path');
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json',
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.vue']
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json')
      }
    }
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': 1,
    // Vue: Recommended rules to be closed or modify
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    // Vue: Add extra rules
    'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/no-v-text': 1,
    'vue/padding-line-between-blocks': 1,
    'vue/require-direct-export': 1,
    'vue/multi-word-component-names': 0,
    // Allow @ts-ignore comment
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-explicit-any': 0,
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'no-param-reassign': 0,
    'prefer-regex-literals': 0,
    'import/no-extraneous-dependencies': 0,
    'consistent-return': 0,
    'import/prefer-default-export': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    'no-console': 0
  }
};
