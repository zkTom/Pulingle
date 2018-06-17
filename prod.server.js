var express = require('express')
const proxyMiddleware = require('./node_modules/http-proxy-middleware');
var axios = require('axios')

var port = process.env.PORT || 8199

var app = express()

var apiRoutes = express.Router()

//请求代理
const proxyOptions = {
  target: 'http://120.78.81.233:8040', // target host
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

// apiRoutes.get('/getDiscList', function (req, res) {
//   var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
//   axios.get(url, {
//     headers: {
//       referer: 'https://c.y.qq.com/',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then((response) => {
//     res.json(response.data)
//   }).catch((e) => {
//     console.log(e)
//   })
// })
// app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})