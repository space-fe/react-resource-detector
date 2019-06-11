const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const SOURCE_PATH = path.join(__dirname, 'src')

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [{
      test: /\.(js|ts)x?$/,
      exclude: [
        path.resolve(__dirname, 'build')
      ],
      include: [
        path.resolve(__dirname, 'src'),
        /node_modules\/react-onroutechanged/,
        /node_modules\/react-resource-detector/
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
    port: 9000,
    historyApiFallback: true // 解决刷新页面404问题
  },
  devtool: 'source-map'
}
