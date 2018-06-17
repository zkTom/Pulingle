<template>
  <div class="login">
    <div class="form-group username">
      <input type="text" class="form-control" v-model.trim="form.account"  placeholder="手机号">
    </div>
    <div class="errors">
      <span class="error" v-show="!phoneValidator.valid && phoneValidator.message.length">{{phoneValidator.message}}</span>
    </div>
    <div class="form-group password">
      <input type="password" class="form-control" v-model="form.password" minlength="6" placeholder="密码">
    </div>
    <div class="errors">
      <span class="error" v-show="!passwordValidator.valid && passwordValidator.message.length">{{passwordValidator.message}}</span>
    </div>
    <div class="captcha-wrapper">
      <div class="form-group">
        <input type="text" class="form-control" v-model="form.captcha" 
        maxlength="4" placeholder="验证码" @keyup.13="login">
      </div>
      <div class="captcha">
        <img :src="captchaUrl" alt="">
        <span class="iconfont icon-refresh" @click="updateCaptcha" :style="rotateStyle"></span>
      </div>
    </div>
    <div class="errors">
      <span class="error" v-show="!captchaValidator.valid && captchaValidator.message.length">{{captchaValidator.message}}</span>
    </div>
    <div class="form-group quick-login clearfix">
      <!-- <a href="#" class="fl">手机验证码登录</a> -->
      <router-link class="fr" to="/reset-pass">忘记密码？</router-link>
    </div>
    <div class="form-group btn-login-wrap">
      <button class="btn btn-primary" @click="login" @keyup.13="login">{{btnText}}</button>
    </div>
  </div>
</template>
<script>
import * as UserApi from '../../api/UserApi';
import Validator from '../../model/Validator';
import {phoneRule, captchaRule, passwordRule} from './validator.js';
import Cookies from 'js-cookie';
import _ from 'lodash'

  export default {
    name: 'login',
    data(){
      let data = {};
      
      data.form = {
        account: '',
        password:'',
        captcha:'',
        timeStamp:''
      }
      data.round = 0;
      data.captchaUrl = '';
      data.phoneValidator = new Validator(phoneRule);
      data.passwordValidator = new Validator(passwordRule);
      data.captchaValidator =new Validator(captchaRule);
      data.inLogin = false;
      return data;
    },
    computed:{
      rotateStyle(){
        return `transform:rotate(${this.round * 360}deg)`;
      },
      btnText(){
        return !this.isLogin ? '登录' : '登录中...';
      }
    },
    watch: {
      'form.account'(val){
        this.phoneValidator.validate(val);
      },
      'form.password'(val){
        this.passwordValidator.validate(val);
      },
      'form.captcha'(val){
        this.captchaValidator.validate(val);
      }
    },
    methods: {
      getTimeStamp(){
        let date = new Date();
        let minutes = this.makeUp(date.getMinutes(),2);
        let seconds = this.makeUp(date.getSeconds(),2);
        let milliseconds= this.makeUp(date.getMilliseconds(),3);

        return minutes.concat(seconds,milliseconds).toString(32);
      },
      makeUp(num, digits){
        let str = num.toString();
        let zeroStr = '';
        if (str.length >= digits) return str;
        else {
          for(let i = 0; i< digits - str.length; i++)
            zeroStr += '0';
        }
        return zeroStr.concat(str);
      },
      async updateCaptcha(){
        this.round++;
        try {
          this.form.timeStamp = this.getTimeStamp();
          let data = await UserApi.getCaptcha({timeStamp: this.form.timeStamp});
          if (data.status == 1) {
            this.captchaUrl = `data:image/png;base64,${data.data}`;
          } else {
            this.$message.error('获取验证码失败,请重试')
          }
        } catch (error) {
          console.log(error)
        }
      },
      async login(){
        if (!this.phoneValidator.valid) {
          this.$message.error('请填写正确的手机号')
          return;
        }
        if (!this.passwordValidator.valid) {
          this.$message.error('请填写密码')
          return;
        }
        if (!this.captchaValidator.valid) {
          this.$message.error('请填写验证码')
          return;
        }
        try {
          this.isLogin = true;
          let res = await UserApi.login(this.form);
          this.isLogin = false;
          if (res.status == 1) {
            let userInfo = res.data;
            let friendId = userInfo.user_id;
            
            _.assign(userInfo, {friendNum: res.data.friendNum, momentNum: res.data.momentNum})
            this.$store.commit('user/init_userInfo', userInfo);
            this.$store.commit('user/set_token', userInfo.token)
            this.$store.commit('set_friendId', friendId)
            Cookies.set('token', userInfo.token);
            //本地缓存
            localStorage.setItem("lastuser", userInfo.account.toString());
            sessionStorage.setItem("__local_auth_info", JSON.stringify(userInfo || {}));
            this.$message.success('登录成功');
            // 是否有跳转页面参数
            let query = this.$router.query;
            if (query && query.redirect) {
              this.$router.replace(query.redirect);
            } else {
             this.$router.push(`/issue/${friendId}`); 
            }
          } else {
            this.$message.error(res.msg || '未知错误，请重试')
          }
        } catch (error) {
          this.isLogin = false;
          console.log(error)
        }
      }
    },
    created(){

    },
    mounted(){
      this.form.account = localStorage.getItem('lastuser') || '';
      this.updateCaptcha();
    }
  }
</script>
<style lang="scss">
$color-gray: #DCDCDC;
$color-base: RGBA(33, 178, 146, 1);
.login{
  margin: 30px 40px 50px 40px;

  .form-group{
   max-width: 320px;

   >span{
    display: inline-block;
    height: 40px;
    line-height: 40px;
   }
  }

  .captcha-wrapper{
    display: flex;
    max-width: 100%;

    .form-group{
      display: inline-block;
      max-width: 150px;
    }
    .captcha{
      align-items: center;
      display: flex;
      position: absolute;
      right: 40px;
      margin-bottom: 15px;

      .icon-refresh{
        cursor: pointer;
        font-size: 18px;
        margin-left: 10px;
        transition: all .5s;
        transform: rotate(0deg);
      }
      img{
        width: 100px;
        height: 40px;
      }
    }
  }

  .quick-login{
    border: none;
    margin-top: -10px;

    a:first-child{
      color: $color-base;
    }

    a:last-child{
      color: RGBA(83, 83, 83, 1);
    }
  }

  .btn-login-wrap{
    border:none;
    width: 320px;
    text-align: center;

    .btn{
      width: 100%;
    }
  }

  .errors {
    color: red;
    margin-bottom: 10px;

    .error{
      font-size: 14px;
    }
  }
}
</style>

