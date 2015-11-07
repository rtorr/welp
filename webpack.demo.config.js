var path = require('path');
var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];
var entry = ['./examples/app'];
var loaders = [];

if(process.env.NODE_ENV === 'PRODUCTION'){
  loaders.push(
    {test: /\.js?$/, exclude: /node_modules/, loaders: ['babel']}
  );
}else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
  entry.push(
    'webpack-dev-server/client?http://localhost:8181',
    'webpack/hot/only-dev-server'
  );
  loaders.push(
    {test: /\.js?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel']}
  );
}

module.exports = {

  entry: entry,

  output: {
    library: 'Portal',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'dist'),
    filename: 'Portal.js',
    publicPath: 'http://localhost:8181/dist'
  },

  externals: [

  ],

  module: {
    loaders: loaders
  },

  node: {
    Buffer: false
  },

  plugins: plugins

};