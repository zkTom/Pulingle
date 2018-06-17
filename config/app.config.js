// app的资源配置 权限设置 模拟假数据

module.exports = {
  'development': {
    NODE_ENV:"'development'",
    assetsHost:"",
    assetsInternalHost:"",
    assetsPublicPath: '/',
    minimize:false
  },
  'production': {
    NODE_ENV: "'production'",
    assetsHost:"",
    assetsInternalHost:"",
    assetsPublicPath: '/',
    minimize: true
  }
}