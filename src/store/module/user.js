import _ from 'lodash';
import Cookies from 'js-cookie';
import * as UserApi from '../../api/UserApi'
import router from '../../router'

const user = {
  namespaced: true,
  state: {
    userInfo:{
      user_id: '',
      account: '',
      phone: '',
      nickname: "",
      profile_picture_url: "",
      sex: '',
      friends_list: '',
      signature: '', // 个人签名
      picture_list: [],
      momentNum: 0,
      friendNum: 0,
      token: Cookies.get('token') || null
    },
  },
  mutations:{
    init_userInfo(state, userInfo = {}) {
      _.assign(state.userInfo, userInfo);
    },
    set_token(state, token){
      state.userInfo.token = token;
    },
    set_profilePictureUrl(state, url) {
      state.userInfo.profile_picture_url = url;
    },
    set_nickname(state, nickname) {
      state.userInfo.nickname = nickname
    },
    set_email(state, email) {
      state.userInfo.email = email
    },
    set_signature(state, signature) {
      state.userInfo.signature = signature
    },
    clear_userInfo(state, userInfo = {}) {
      state.userInfo = {};
    }
  },
  actions: {
    // token登录
    async quick_login({commit, state}) {
      let token = Cookies.get('token')
      try {
        if (!token) token = '';
        let res = await UserApi.quickLogin({token: token})
        if (res.status == 1) {
          commit('init_userInfo', res.data)
          commit('set_token', token)
          //本地缓存
          sessionStorage.setItem("__local_auth_info", JSON.stringify(res.data || {}));
        } else {
          commit('init_userInfo', {})
          commit('set_token', '')
          Cookies.remove('token')
          router.push('/login')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async logout({commit}) {
      try {
        let token = Cookies.get('token')
        let data = await UserApi.logout({token: token})
        Cookies.remove('token')
        commit('clear_userInfo', {})
        commit('set_token', '')
        // 清除本地缓存
        sessionStorage.removeItem("__local_auth_info");
      } catch (error) {
        console.log(error)
      }
    }
  }
}
export default user;