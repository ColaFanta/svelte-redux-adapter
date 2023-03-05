module.exports = {
  singleQuote: true,
  semi: false,
  printWidth: 120,
  plugins: [require('prettier-plugin-svelte'), require('@trivago/prettier-plugin-sort-imports')],
  pluginSearchDirs: ['.'],
  trailingComma: 'es5',
  endOfLine: 'auto',
  arrowParens: 'avoid',
  tabWidth: 2,
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
        svelteBracketNewLine: false,
        htmlWhitespaceSensitivity: 'css',
      },
    },
  ],
  importOrder: ['^\\$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx', JSON.stringify(['decorators', { decoratorsBeforeExport: false }])],
}
