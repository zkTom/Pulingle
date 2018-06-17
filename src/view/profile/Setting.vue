<template>
  <div class="profile-setting">
    <div class="form-group account">
      <span class="label">账号：</span>
      <p class="content">{{userInfo.account}}</p>
    </div>
    <div class="form-group nickname">
      <span class="label">昵称：</span>
      <input type="text" class="form-control" v-model="form.nickname" placeholder="昵称">
    </div>
    <div class="form-group email">
      <span class="label">邮箱：</span>
      <input type="text" class="form-control" v-model="form.email" placeholder="邮箱">
    </div>
    <div class="form-group phone">
      <span class="label">手机：</span>
      <p class="content">{{userInfo.account}}</p>
    </div>
    <div class="form-group signature">
      <span class="label">签名：</span>
      <textarea class="form-control" v-model="form.signature" placeholder="个性签名"></textarea>
    </div>
    <div class="form-group">
      <span class="label">性别：</span>
      <input type="radio" name="sex" id="male" value="0" v-model="form.sex">
      <label for="male">男</label>
      <input type="radio" name="sex" id="female" value="1" v-model="form.sex">
      <label for="female">女</label>
    </div>
    <div class="btn-wrap">
      <button class="btn btn-primary" @click="save">保存</button>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import {updateUserInfo} from '../../api/UserApi'

export default {
  data(){
    let data = {};

    data.form = {
      user_id: '',
      nickname: '',
      sex: '',
      email: '',
      signature: ''
    }

    return data;
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    },
    isEmailOk(){
      let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

      return reg.test(this.form.email)
    }
  },
  methods: {
    async save(){
      let email = this.form.email;
      if (email.length && !this.isEmailOk){
        return this.$message.error('邮箱格式不正确')
      }
      let res = await updateUserInfo(this.form)
      let form = this.form;
      if (res.status == 1) {
        this.$store.commit('user/init_userInfo', res.data)
        this.$message.success('修改成功')
        //本地缓存
        let __localAuthInfoStr = sessionStorage.getItem("__local_auth_info");
        let _userInfo = JSON.parse(__localAuthInfoStr);
        _.assign(this.userInfo, _userInfo, res.data)
        sessionStorage.setItem("__local_auth_info", JSON.stringify(this.userInfo || {}));
      } else {
        this.$message.error('修改失败，请重试')
      }
    },
    init(){
      _.assign(this.form, this.userInfo);
    }
  },
  mounted(){
    this.init()
  }
}
</script>
<style lang="scss">
.profile-setting{
  position: absolute;
  width: 100%;
  padding: 20px;

  .form-group{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: none;

    .label{
      width: 60px;
      color: #000;
      font-size: 16px;
      margin-right: 10px;
      user-select: none;
    }

    .form-control{
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      width: 200px;
      height: auto;
    }

    textarea.form-control{
      width: 230px;
      height: 130px;
    }

    .content{
      user-select: none;
    }

    label{
      margin-right: 20px;
      margin-left: 10px;
    }
  }
}

</style>

