//https://github.com/mzabriskie/axios
import Cookie from 'js-cookie'
import router from "../router"
import message from '../component/common/message'
import axios from 'axios';

let appConfig = {}
/**
 * http工厂函数
 */
function buildInstance(){
  let instance = {};
  let http = axios_http;

  instance.get = function(url = '', params = {}, emulateJSON = true){
    let _encodeParams = encodeParams(params);  
    _encodeParams && (url += url.indexOf('?') != -1 ? "&" : "?" + _encodeParams);

    return http('get',url);
  }

  instance.post = function(url = '', params = {}, emulateJSON = true, headers = {}){
    return http('post',url,params,emulateJSON,headers);
  }

  instance.init = function(o){
    appConfig = o;
  }

  return instance;
}


function axios_http(method = 'get', url = '', params = {}, emulateJSON = true,headers = {}){
  let token = Cookie.get('token')
  let instance = axios.create();
  let config = {};
  
  config.url = url;
  config.method = method;
  //config.timeout = 5000;
  // post请求下 emulateJSON= false 不用手动设置Content-Type类型为 application/x-www-form-urlencoded
  // 会自动进行配置（encodeParams)
  //不太明白？
  if(method == 'post') emulateJSON ? config.data = params : config.data = encodeParams(params);

  // 添加请求拦截器
  instance.interceptors.request.use(function (config) {
    if (headers) config.headers = headers;
    config.headers['token'] = token;
    return config;
  }, function (error) {
    console.error('Http请求出错：',error)
    return Promise.reject(error);
  });
  // 添加响应拦截器
  instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let resStatus = response.data.status;
    let query = {redirect: router.currentRoute.fullPath};
    if (resStatus == 2 && /issue\/\d{1,}$/.test(query.redirect)){
      return response;
    } else if (resStatus == 2) {
      message.warning('请先登录')
      router.replace({path: '/login',query: query})
      //return response;
    } else {
      return response;
    }
    console.log(response);
    return response;
  }, function (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            console.error("Http请求参数错误",error.response);
            break;
          case 404:
          case 500:  // 500 处理
            router.replace("/internal-error");
            break;
        }
      } else {
        console.error("error message:" + error.message);
      }
    return Promise.reject(error);
  });

  return new Promise((resolve, reject) => {
    instance.request(config).then(response => {
      let data = response.data;
      if(data.status == -1){
        denied();
        return reject('access denied.');
      }

      resolve(data);
    })
    .catch(err => errorHandler(err,reject));
  });
}


/**
 * 对params进行编码格式如下：
 * key=value&key1=value1
 */
function encodeParams(params){
  let str = ""
  if(Object.keys(params).length > 0){
    for(let name in params){
      str += `&${name}=${encodeURIComponent(params[name])}`;
    }
    str = str.substring(1);
  }
  return str;
}

function errorHandler(err,reject){
  console.log(err)
  reject(err);
}

function denied(){
  var event = new CustomEvent('denied', {});
  window.dispatchEvent(event);
}

export default buildInstance();
