<template>
  <div class="profile-wrapper">
    <my-head></my-head>
    <div class="profile-container clearfix">
      <div class="profile-menu fl">
        <p class="profile-menu-hd">
          <span class="iconfont icon-bell"></span>
          <span>账号设置</span>
        </p>
        <ul class="profile-menu-bd">
          <li class="profile-menu-item">
            <span class="circle" :class="{'active' : viewName === viewType[0]}"></span>
            <span :class="{'active' : viewName === viewType[0]}" 
            @click="handleSettingClick">个人信息设置</span>
          </li>
          <li class="profile-menu-item">
            <span class="circle" :class="{'active' : viewName === viewType[1]}"></span>
            <span :class="{'active' : viewName === viewType[1]}" 
            @click="handleAvatarClick">更换头像</span>
          </li>
          <!-- <li class="profile-menu-item">
            <span class="circle" :class="{'active' : viewName === viewType[2]}"></span>
            <span :class="{'active' : viewName === viewType[2]}" 
            @click="handleBannerSettingClick">轮播图设置</span>
          </li> -->
        </ul>
      </div>
      <div class="profile-content">
        <keep-alive>
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import Head  from '../../component/head/Head.vue'
const ViewType = ['setting', 'avatar-setting', 'banner-settting']

export default {
  name:'pul-profile-frame',
  data(){
    return{
      viewName: 'setting',
      viewType: ViewType
    }
  },
  computed:{
    
  },
  methods:{     
    handleSettingClick(){
      this.viewName = 'setting'
      this.$router.push('/profile/setting')
    },
    handleBannerSettingClick(){
      this.viewName = 'banner-setting'
      this.$router.push('/profile/banner-setting')
    },
    handleAvatarClick(){
      this.viewName = 'avatar-setting'
      this.$router.push('/profile/avatar-setting')  
    }
  },
  components:{
    [Head.name]: Head
  }
}
</script>

<style lang="scss">
$color-gray:RGBA(102, 102, 102, 1);
$color-base:RGBA(33, 178, 146, 1);
.profile-wrapper{
  background-color: #EAEDEA;
  padding-bottom: 100px;
}
.profile-container{
  margin: 18px auto 0;
  width: 970px;
}
.profile-menu{
  background-color: #fff;
  border-radius: 5px;
  width: 160px;
  min-height: 440px;
  text-align: center;

  &-hd{
    color: $color-gray;
    font-size: 16px;
    font-weight: bold;
    padding: 16px 0;
    margin-bottom: 10px;
    margin-left: 30px;
    text-align: left;

    .icon-bell{
      padding-right: 5px;
    }
  }

  &-bd{
    color: $color-gray;
    font-size: 14px;
    font-weight: bold;

    .profile-menu-item{
      list-style: none;
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 30px;
    }
    span{
      cursor: pointer;
      display: inline-block;
    }

    span.circle{
      background-color: $color-gray;
      border-radius: 50%;
      width: 6px;
      height: 6px;
      margin-right: 10px;

      &.active{
        background-color: $color-base;
      }
    }
    
    span.active{
      color: $color-base;
    }
  }
}
.profile-content{
  background-color: #fff;
  border-radius: 5px;
  width: 800px;
  margin-left: 172px;
  min-height: 440px;
  position: relative;
}
</style>


