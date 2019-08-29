const { override, fixBabelImports } = require('customize-cra')
const path = require('path')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  }),
  config => {
    config.module.rules.push({
      loader: 'webpack-ant-icon-loader',
      enforce: 'pre',
      include: [
        require.resolve('@ant-design/icons/lib/dist')
      ]
    })
    return config
  }
)
