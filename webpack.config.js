const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const SOURCE_PATH = path.join(__dirname, 'src');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
    // publicPath: '/assets/'   // path 和 publicPath 的区别？？
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: [
        path.resolve(__dirname, 'build')
      ],
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(SOURCE_PATH, 'index.tmpl.html'),
      inject: 'body'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 9000
  }
};
