const path = require('path');
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  globals:{
    "I18N":true 
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json'
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
    'prettier/prettier': 2,
    // Vue: Recommended rules to be closed or modify
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    // Vue: Add extra rules
    // 'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/no-v-text': 1,
    'vue/padding-line-between-blocks': 1,
    'vue/require-direct-export': 1,
    'vue/multi-word-component-names': 0,
    'vue/v-on-event-hyphenation': 0,//自定义方法串式命名
    'vue/attribute-hyphenation': 0,//自定义属性串式命名
    'vue/attributes-order': 0,//自定义属性
    'no-use-before-define': 0,//function定义前使用
    'vue/padding-line-between-blocks': 0,//script标签前加换行
    'import/extensions': 0,//引入文件加后缀
    '@typescript-eslint/no-empty-function': 0,//声明空函数
    'spaced-comment': 0,//识别出错 styles引用识别为注释
    'no-plusplus': 0,//+
    'no-unused-expressions': 0,//短路运算
    'no-nested-ternary': 0,//三元嵌套
    'no-underscore-dangle': 0,// qiankun_开头
    // Allow @ts-ignore comment
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 1,
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
    'vue/no-deprecated-slot-attribute': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    'no-shadow': 'off',
    'no-console': 0,
    'no-debugger': 0,
    'func-names': 0,
    'import/order': 0,
    'no-restricted-syntax': 0,
    'class-methods-use-this': 0,
    'no-async-promise-executor': 0,
    'import/no-unresolved': 0,
    'import/no-named-default': 0,
    'prefer-promise-reject-errors': 0,
    'no-else-return': 0,
    'vue/no-v-html': 0,
    'vue/prop-name-casing': 0,
    'camelcase': 'off',
    'default-param-last': 0,
    'vue/require-prop-types': 0,
    'no-return-assign': 0,
    'no-template-curly-in-string': 0,
    'no-cond-assign': 0
  }
};
