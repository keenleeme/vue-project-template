module.exports = {
  printWidth: 120, // 最大行长规则通常设置为 100 或 120。
  useTabs: false,
  tabWidth: 2,
  jsxSingleQuote: false,
  singleQuote: true,
  endOfLine: 'auto',
  semi: true,
  trailingComma: 'none',
  vueIndentScriptAndStyle: true, // Vue 文件脚本和样式标签缩进
  arrowParens: 'always', // 在唯一的箭头函数参数周围始终包含括号。
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^vue', '<THIRD_PARTY_MODULES>', '@/(.*)', '^[./]'],
  camelcase: false
  // importOrderSeparation: true,
  // importOrderSortSpecifiers: true,
};
