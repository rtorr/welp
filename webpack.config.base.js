var webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'welp',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  },
  externals: [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'redux': {
        root: 'Redux',
        commonjs2: 'redux',
        commonjs: 'redux',
        amd: 'redux'
      }
    }
  ]
};
