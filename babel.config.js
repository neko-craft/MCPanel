const decamelize = require('decamelize')

exports.plugins = [
  [
    'babel-plugin-transform-imports',
    {
      antd: {
        transform: name => 'antd/es/' + decamelize(name, { separator: '-' }),
        preventFullImport: true
      }
    }
  ]
]
