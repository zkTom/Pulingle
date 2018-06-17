<template>
  <div class="register">
    <div class="form-group tel">
      <span class="input__prefix area-code">中国（+86）</span>
      <input type="text" class="form-control" v-model.trim="form.phone" placeholder="您的手机号">
    </div>
    <div class="errors">
      <span class="error" v-show="!phoneValidator.valid && phoneValidator.message.length">{{phoneValidator.message}}</span>
    </div>
    <div class="form-group auth-code">
      <span class="input__suffix">
        <button class="btn"  :disabled="isSend" @click="sendCode(form.phone)">{{sendText}}</button>
      </span>
      <input type="text" class="form-control" v-model="authCode" placeholder="您收到的验证码">
    </div>
    <div class="errors">
      <span class="error" v-show="!authCodeValidator.valid && authCodeValidator.message.length">{{authCodeValidator.message}}</span>
    </div>
    <div class="form-group username">
      <input type="text" class="form-control" v-model="form.username" placeholder="用户名">
    </div>
    <div class="errors">
      <span class="error" v-show="!usernameValidator.valid && usernameValidator.message.length">{{usernameValidator.message}}</span>
    </div>
    <div class="form-group password">
      <input type="password" class="form-control"
       v-model="form.password" placeholder="设置密码：至少6位"  @keyup.13="register">
    </div>
    <div class="errors">
      <span class="error" v-show="!passwordValidator.valid && passwordValidator.message.length">{{passwordValidator.message}}</span>
    </div>
    <!-- <p class="service-agree">
       <input type="checkbox" name="" id="">
       点击注册表明您已阅读并且同意 <a href="javascript:void(0)">《服务条款》</a>
    </p> -->
    <div class="form-group btn-register-wrap" @click.stop="register" @keyup.13="register">
      <button class="btn btn-primary">注册</button>
    </div>
  </div>
</template>
<script>
import * as MessageApi from '../../api/MessageApi';
import {phoneRule, passwordRule, authCodeRule} from './validator';
import Validator from '../../model/Validator';
let timer = null;
export default {
  name: "register",
  data(){
    let data = {};

    data.form = {
      phone:'',
      username:'',
      password:''
    };
    data.authCode = '';
    data.seconds = 60;
    data.isSend = false;
    data.phoneValidator = new Validator(phoneRule);
    data.passwordValidator = new Validator(passwordRule);
    data.authCodeValidator = new Validator(authCodeRule);
    data.usernameValidator = new Validator({required:{ rule: true, message: '昵称不能为空'}});
    return data;
  },
  computed: {
    sendText(){
      if(!this.isSend) return "发送验证码";

      return `(${this.seconds})秒后重新发送`;
    }
  },
  watch: {
    'form.phone'(val){
      this.phoneValidator.validate(val);
    },
    'form.password'(val){
      this.passwordValidator.validate(val);
    },
    'form.username'(val){
      this.usernameValidator.validate(val);
    },
    'authCode'(val){
      this.authCodeValidator.validate(val);
    }
  },
  methods: {
    setTimer(){
      this.seconds = 60;
      timer = setInterval(() => {
        if(this.seconds <= 0){
          clearInterval(timer);
          this.isSend = false;
        }

        this.seconds--;
      },1000);
    },
    async sendCode(phone){
      let validator = this.phoneValidator;
      if(!validator.valid) {
        this.$message.error(validator.message);
        return;
      }
      this.isSend = true;
      this.setTimer();

      try {
        let data = await MessageApi.sendCode({phone:phone}); 
        if (data.msg == 1) {
          this.$message.success("发送成功");
        } else {
          this.$message.error("发送失败，稍后重试");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async register(){
      if (!this.phoneValidator.valid) {
        this.$message.error('请输入正确的手机号');
        return;
      }
      if (!this.authCodeValidator.valid) {
        this.$message.error('验证码格式错误');
        return;
      }
      if (!this.usernameValidator.valid) {
        this.$message.error('昵称不能为空');
        return;
      }
      if (!this.passwordValidator.valid) {
        this.$message.error('密码格式错误');
        return;
      }
      try {
        let data = await MessageApi.checkCode({phone:this.form.phone, authCode:this.authCode});
        let form = {
          account: this.form.phone,
          nickname: this.form.username,
          password: this.form.password
        }
        if (data.msg == 1) {
          data = await MessageApi.register(form);
          if (data.status == 1) {
            this.$message.success('注册成功');
            this.$router.push('/login');
            //本地缓存
            localStorage.setItem("lastuser", userInfo.account.toString());
          } else {
            this.$message.error(data.msg);
          }
        } else {
          this.$message.error("验证码错误")
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss">
$color-gray: #DCDCDC;
$color-base: RGBA(33, 178, 146, 1);
.register {
  margin: 30px 40px 50px 40px;

  .form-group{
   max-width: 320px;

   >span{
    display: inline-block;
    height: 40px;
    line-height: 40px;
   }
  }

  .tel{
    .area-code{
      width:88px;
      border-right: 1px solid $color-gray;
    }
    input{
      width: 200px;
      padding-left: 120px;
    }
  }

  .auth-code{

    span{
      right: 0;
      width: 114px;
      border-left: 1px solid $color-gray;
      pointer-events: auto;
    }

    .btn{
      background: none;
      cursor: pointer;
      height: 100%;
      pointer-events: auto;
      padding: 0;
      width: 100%;

      &:disabled{
        cursor: not-allowed;
      }
    }


    input{
      width: 200px;
      padding-right: 130px;
    }
  }

  .service-agree{
    padding:5px;

    input[type='checkbox']{
      vertical-align: middle;
    }

    a{
      color: $color-base;
      vertical-align: middle;
    }
  }

  .btn-register-wrap{
    border:none;
    width: 320px;
    text-align: center;
    padding: 0;

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

