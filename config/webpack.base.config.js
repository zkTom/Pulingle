// webpack 通用的打包配置
const path = require('path');
const webpack = require("webpack");

const env = process.env.NODE_ENV;
// 进一步配置css-loader
const cssLoader = {
  loader: 'css-loader',
  options: {
    minimize: false
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

module.exports = {
  entry: {
    'app': './src/index.js'
  },
  output: {
    path: path.resolve(__dirname,'../dist'),
    // https://www.webpackjs.com/configuration/output/#output-publicpath
    publicPath: '/dist/', 
    filename:'[hash].bundle.js',
    chunkFilename:'[name].[chunkhash].js'
  },
  module: {
    rules: [
      { // loader: 'vue-loader' <==> use: ['vue-loader'] <==> use: [{loader: 'vue-loader'}]
        // 仅仅使用单个loader的简便写法
        // 每个loader有自己的options配置，具体查看对应文档
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['style-loader',cssLoader,'sass-loader',sassResourcesLoader]
          }
        }
      },
      // 使用多个loader的写法
      {
        test: /\.scss$/,
        use: ['style-loader',cssLoader,'postcss-loader','sass-loader',sassResourcesLoader]
      },
      {
        test: /\.css$/,
        use: ['style-loader',cssLoader,'postcss-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: path.resolve(__dirname, '../src/assets/font'),
        loader: 'url-loader',
        options: {
          limit: 10000,
          path:'',
          name: 'img/[name].[ext]',
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize:false,
          removeComments: false,  
          collapseWhitespace: true
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        exclude: path.resolve(__dirname, '../src/assets/svg'),
        loader: 'file-loader',
        options:{
          limit: 10000,
          name:'fonts/[name].[hash].[ext]',
        }
      },
    ]
  },
  // 别名使用更加方便
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      '@': path.join(__dirname,'../src')
    }
  },
  performance: {
    hints: 'warning'
  }
}