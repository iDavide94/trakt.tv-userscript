module.exports = {
  ...require('prettier-config-standard'),
  plugins: ['prettier-plugin-sort-json', 'prettier-plugin-pkg'],
  jsonRecursiveSort: true,
  overrides: []
}
