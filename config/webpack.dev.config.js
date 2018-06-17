// webpack 开发环境的打包设置
const env = process.env.NODE_ENV || 'development';
const path = require('path');

const webpack = require("webpack");
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 热重载配置
Object.keys(baseConfig.entry).forEach(function (name) {
  baseConfig.entry[name] = ['./build/dev-client'].concat(baseConfig.entry[name])
});
// 自定义插件
function InjectPlugin(options) {

};

// Defines `apply` method in it's prototype.
InjectPlugin.prototype.apply = function(compiler) {
  // Specifies webpack's event hook to attach itself.
  compiler.plugin('compilation', function(compilation, callback) {
    // console.log("This is an example plugin!!!");
    compilation.plugin('myplugin', function(PluginData, callback) {
      console.log('inject the PluginData');
      callback();
    })
    // Invokes webpack provided callback after functionality is complete.
  });
};
// 合并基础配置和生产环境配置
module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname,'../dist'),
    // https://www.webpackjs.com/configuration/output/#output-publicpath
    publicPath: '/', 
    filename:'[hash].bundle.js',
    //chunkFilename:'[name].[chunkhash].js'
  },
  // 可以映射对应的原始文件（错误追踪快捷）
  devtool: '#eval-source-map',
  plugins: [
    // 可以定义一些全局常量可以在整个编译过程中使用
    new webpack.DefinePlugin({
      'process.env': '"development"'
    }),
    // 启用模块热替换
    new webpack.HotModuleReplacementPlugin(),
    // 在输出阶段时，遇到编译错误跳过
    new webpack.NoEmitOnErrorsPlugin(),
    // 更好的展示输出错误
    new FriendlyErrorsPlugin(),
    // 内联自定义插件 this 指向compiler
    // new InjectPlugin(),
    // 可以生成一个入口的html文件，并且打包生成的（css,js）会自动映入该模板，inject=true 表示这些资源会插入到body标签后面
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/template/index.html',
      inject: true
    })
  ],
  resolve: {
    // 可以在开发中进行全局使用，路径复杂时使用尤其方便
    alias: {
      //'HttpUtil$': path.resolve(__dirname,'../src/util/HttpUtil.js'),
      //'app.config': path.resolve(__dirname,'../src/config/development.js'),
      
    },
  }
})