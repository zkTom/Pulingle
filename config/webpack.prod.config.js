

// webpack 生产环境打包配置
const env = process.env.NODE_ENV || 'production';
const path = require('path');

const webpack = require("webpack");
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const config = require('../config/app.config');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// 抽离css防止将css打包到js
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const cssLoader = {
  loader: 'css-loader',
  options: {
    minimize: true
  }
};
// https://github.com/shakacode/sass-resources-loader
// 配置sass-resource-loader 以便可以在所有SASS样式中使用共享变量和混合，而无需在每个文件中手动导入它们。
const sassResourcesLoader = {
  loader: 'sass-resources-loader',
  options: {
    resources: [
      // path.resolve(__dirname, '../src/assets/scss/_variables.scss'),
      path.resolve(__dirname, '../src/assets/scss/_mixin.scss')
    ]
  }
}
//抽离css配置(filename指定文件位置和名称)
const appCssExtractTextPlugin = new ExtractTextPlugin('css/app.[contenthash].css');

module.exports = merge.smart(baseConfig, {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: appCssExtractTextPlugin.extract({
              use: [cssLoader, 'sass-loader', sassResourcesLoader],
              fallback: 'vue-style-loader' //如果use中的loader都处理失败了，就会使用fallback指定的loader处理
            })
          }
        }
      },
      {
        test: /\.scss$/,
        loader: appCssExtractTextPlugin.extract({
          use: [cssLoader,'postcss-loader','sass-loader',sassResourcesLoader],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.css$/,
        use:appCssExtractTextPlugin.extract({
          use:[cssLoader,'postcss-loader'],
          fallback: 'style-loader'
        })
      }
    ]
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: path.resolve(__dirname,'../dist'),
    publicPath: config[env].assetsHost + config[env].assetsPublicPath,
    chunkFilename: 'chunks/[name].[chunkhash].js',
  },
  // 去除映射文件
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('production')
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true, //用于调试
      comments: false, // 不保留版权注释
      compress: {     // 压缩js代码
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) { //???
        // any required modules inside node_modules are extracted to vendor
        return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0)
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ["vendor"]
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/template/index.html',
      inject: true
    }),
    appCssExtractTextPlugin
  ],
  resolve: {

  }
})
