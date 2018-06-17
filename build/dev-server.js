// 本地启用node来进行调试的
process.env.NODE_ENV = 'development';
const path = require('path');
const https = require('https');
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const proxyMiddleware = require('http-proxy-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
//dev config
const webpackDevConfig = require("../config/webpack.dev.config");
// 进行打包
const compiler = webpack(webpackDevConfig);
const app = express();
// 配置webpack测试服务器中间件
const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: '/',
  quiet: true,
  headers: {
    "Access-Control-Allow-Origin": "*" ,
    "Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS"
  }
});
// 配置webpack热重载中间件
const hotMiddleware = webpackHotMiddleware(compiler, {
  log: false,
  heartbeat: 5000
});
//请求代理
const proxyOptions = {
  target: 'http://120.78.81.233:8040', // target host
  //target: 'http://192.168.1.109:8087',
  changeOrigin: true,               // needed for virtual hosted sites
  ws: true,                         // proxy websockets
  // pathRewrite:function (path, req) {
  //   if(path == '/dd/login') return path;
  //   let rewritePath = path;
  //   rewritePath += rewritePath.includes("?")?"&":"?";
  //   rewritePath += "tenantId=7416b42a-25cc-11e7-a500-00163e12f748"
  //   return rewritePath;
  // }
};

app.use('/message-service', proxyMiddleware(proxyOptions));
app.use('/user-service', proxyMiddleware(proxyOptions));
app.use('/picture-service', proxyMiddleware(proxyOptions));
app.use('/zuul', proxyMiddleware(proxyOptions));
app.use('/moment-service', proxyMiddleware(proxyOptions));

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

const port = process.env.PORT || 8199;

devMiddleware.waitUntilValid(function () {
  console.log('[本地地址]:' + "http://127.0.0.1:8199");
})

app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
});