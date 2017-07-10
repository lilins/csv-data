const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main:'./src/index.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // Enable HMR
  ],
  output: {
    filename: 'bundle_[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      // { test: /\.less$/,loader: 'style!css!less' },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  devServer: {
    hot: true, // Tell the dev-server we're using HMR
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};