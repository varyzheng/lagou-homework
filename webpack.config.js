const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    test: './index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  devServer: {
    host: 'localhost',
    port: '9999',
    open: true,
    overlay: true,
  },
  module: {
  },
  resolve: {
    extensions: [
      '.js',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      title: '测试',
      chunks: true,
    }),
  ],
};
