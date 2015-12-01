var path = require('path');
var webpack = require('webpack');
var resolvPath = function(componentPath) {
  return path.join(__dirname, componentPath);
};
var src_path = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

var coverageLoaders = [];
var coverageReporters = [];

console.log(path.resolve(__dirname, './src/'))

coverageLoaders.push({
  test: /\.js$/,
  include: path.resolve(__dirname, './src/'),
  exclude: /__tests__/,
  loader: 'isparta'
});

coverageReporters.push('coverage');

module.exports = function(config) {

  config.set({

    browsers: [ 'PhantomJS' ],
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha' ].concat(coverageReporters),

    files: [
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/es5-shim/es5-sham.js',
      'tests.webpack.js'
    ],

    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' }
      ]
    },

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
        ].concat(coverageLoaders)
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }
  });
};