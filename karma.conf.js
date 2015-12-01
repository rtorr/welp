var path = require('path');
var webpack = require('webpack');
var resolvPath = function(componentPath) {
  return path.join(__dirname, componentPath);
};
var src_path = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

var coverageLoaders = [];
var coverageReporters = [];


module.exports = function(config) {

  config.set({

    browsers: [ 'PhantomJS' ],
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha', 'coverage'],

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
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
          {
            test: /\.js$/,
            include: path.resolve('src/'),
            exclude: /(node_modules | __tests__)/,
            loader: 'isparta'
          }
        ]
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