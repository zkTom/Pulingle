// 打出生产环境包
//解析来自命令行的参数
 const argv = require('minimist')(process.argv.slice(2));
 const NODE_ENV = argv.NODE_ENV || 'production';
 // const ROOT_PATH = argv.ROOT_PATH || '/Users/dongls/Desktop/work/sm4';
 //设置NODE_ENV
 process.env.NODE_ENV = NODE_ENV;
 
 const path = require('path')
 const shell = require('shelljs');
 const webpack = require('webpack')
 const webpackConfig = require('../config/webpack.prod.config')
 
 console.log(`building for ${NODE_ENV},please wait a moment.`);
 
 //TODO: 替换成 https://www.npmjs.com/package/clean-webpack-plugin
 //删除之前的构建文件
 shell.rm('-rf', path.resolve(__dirname, '../dist'))
 
 webpack(webpackConfig, function (err, stats) {
   if (err) throw err
   process.stdout.write(stats.toString({
     colors: true,
     modules: false,
     children: false,
     chunks: false,
     chunkModules: false
   }) + '\n');
 
   copyFile();
   console.log("build complete on " + new Date().toLocaleString() + ".");
 });
 
 //复制到指定目录
 //替换为sm4项目下的ddm目录
 function copyFile(){
   //拷贝dist
   let distOriginPath = path.resolve(__dirname, '../dist');
   //let distTargetPatg = ROOT_PATH + '/src/main/webapp/resource/pc';
   //重建文件夹
   //shell.rm('-rf', distTargetPatg);
   //shell.mkdir('-p', distTargetPatg);
   //shell.cp('-r', distOriginPath + '/*', distTargetPatg);
   //console.log("copy dist file to => " + distTargetPatg);
 }
 
 
 