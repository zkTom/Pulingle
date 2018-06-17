import Cookies from 'js-cookie'
import './assets/scss/index.scss';
import './util/polyfill';
import app from "./app.js";

_init();

function _init(){
  //获取本地验证信息
  let __localAuthInfoStr = sessionStorage.getItem('__local_auth_info');
  let token = Cookies.get('token');
  // 没有本地信息，则要重新登录(token)
  if (!__localAuthInfoStr) {
    // 根据token获取登录信息
    if(token) app.$store.dispatch('user/quick_login')
  } else {
    let localAuthInfo = {};
    try{
      
      localAuthInfo = JSON.parse(__localAuthInfoStr);
    }catch(e){
      console.log(e)
    }
    //初始化验证信息
    app.$store.commit('user/init_userInfo', localAuthInfo);
    if(token) app.$store.commit('user/set_token', token);
  }
  app.$mount("#app");
}
