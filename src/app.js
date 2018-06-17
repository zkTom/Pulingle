import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import App from './view/App.vue'
import router from './router'
import store from './store'

import message from './component/common/message';
import loading from './component/common/loading';
import preview from './component/preview';
// import {MessageBox} from 'element-ui';
import {defaultAvatar, defaultImg} from './filter'

// Vue.use(MessageBox);
Vue.use(VueLazyLoad, {
    error: require('./assets/images/error.png')
})

// yyyy-MM-dd hh:mm:ss
Date.prototype.format = function(fmt){
  const newDate = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "S" : this.getMilliseconds() 
  }

  if (/(y+)/.test(fmt)) {
    let $1 = RegExp.$1;
    fmt = fmt.replace($1, this.getFullYear().toString().substr(4 - $1.length))
  }

  for(let key in newDate){
    if (new RegExp(`(${key})`).test(fmt)) {
      let $1 = RegExp.$1;
      let len = newDate[key].toString().length;
      let s = ($1.length === 1) ? newDate[key] : ("00"+ newDate[key]).substr(len);

      fmt = fmt.replace($1, s)
    }
  }

  return fmt;
}
Vue.prototype.$message = message;
Vue.prototype.$loading = loading;
Vue.prototype.$preview = preview;
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;
Vue.filter('defaultAvatar', defaultAvatar)
Vue.filter('defaultImg', defaultImg)
const app = new Vue({
  render: h => h(App),
  router,
  store
});

export default app;