import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import Cookies from 'js-cookie';
import user from './module/user'

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    friendId: 0
  },
  getters:{
    token: state => state.user.token,
    userInfo: state => state.user.userInfo
  },
  mutations: {
    set_friendId(state, friendId){
      if (friendId > 0) state.friendId = friendId;
    }
  },
  modules: {
    user
  },
});
export default store;