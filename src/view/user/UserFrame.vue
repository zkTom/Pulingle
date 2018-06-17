<template>
  <div class="user-frame">
    <a href="#" class="pulingle-logo">
      <img src="../../assets/images/logo.png" alt="pulingle-logo">
    </a>
    <div class="user-frame-hd">
      <span :class="['fl',{active:viewName === 'register'}]" @click="viewName = 'register'">注册</span>
      <span :class="['fr',{active:viewName === 'login'}]" @click="viewName = 'login'">登录</span>
    </div>
    <div class="user-frame-bd">
      <keep-alive>
        <template v-if="viewName === 'register'">
          <register></register>
        </template>
        <template v-else>
          <login></login>
        </template>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import Login from "./Login.vue";
  import Register from "./Register.vue";
  export default {
    name: 'UserFrame',
    data(){
      let data = {};
      data.viewName = this.$route.meta.name;

      return data;
    },
    computed:{
      // viewName(){
      //   return this.$route.meta.name;
      // }
    },
    mounted(){
      
    },
    components: {
      [Login.name]: Login,
      [Register.name]: Register
    }
  }
</script>

<style lang="scss">
  $color-base: RGBA(33, 178, 146, 1);

  .user-frame{
    width: 402px;
    height: 440px;
    border: 1px solid RGBA(220, 220, 220, 1);
    margin: 100px auto;
    border-radius: 6px;
    position: relative;

    .pulingle-logo{
      position: absolute;
      display: block;
      left:50%;
      margin-left: -75px;
      width: 150px;
      top: -46px;
    }
  }

  .user-frame-hd{
    height: 64px;
    padding: 0 60px;
    border-bottom: 1px solid RGBA(220, 220, 220, 1);

    span{
      cursor: pointer;
      font-size: 20px;
      height: 62px;
      line-height: 62px;
      text-align: center;
      padding: 0 40px;
      border:none;
    }

    span.active{
      color: $color-base;
      border-bottom: 2px solid $color-base;
    }
  }
</style>

