<template>
  <div class="pulingle-head-wrap">
    <div class="pulingle-head">
      <div class="pulingle-head-nav fl">
        <router-link :to="{path: `/issue/${userInfo.user_id}`}" class="logo-wrap">
          <img src="../../assets/images/logo.png" alt="pulingle-logo">
        </router-link>
        <router-link :to="{path: `/issue/${userInfo.user_id}`}">主页</router-link>
        <router-link :to="{path: '/zone'}">动态</router-link>
        <router-link :to="{path: `/picture-wall`}">照片墙</router-link>
      </div>
      <div class="pulingle-head-right fr">
        <div class="fl form-group pulingle-search">
          <span class="iconfont icon-search input__suffix"></span>
          <input type="text" class="form-control" placeholder="搜索Pulingle[昵称查询]" 
          v-model="searchContent" @input="search($event.target.value)">
          <div class="search-list-wrapper" v-show="searchContent">
            <template v-if="!searchListLoading">
            <ul class="search-list" v-if="searchList && searchList.length">
              <li class="search-item" v-for="(user,index) in searchList" :key="index">
                <router-link :to="{path:`/issue/${user.userId}`}" target="_blank">
                  <img :src="user.profilePictureUrl | defaultAvatar" alt="">
                  <p>{{user.nickname}}</p>
                </router-link>
              </li>
              <li class="popper-arrow"></li>
            </ul>
            <p class="no-data" v-else>暂无数据！</p>
            </template>
            <div class="search-list-loading" v-else>
              <span class="iconfont icon-loading"></span>
              <span>加载中...</span>
            </div>
          </div>
        </div>
        <div class="fl pulingle-avatar" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
          <span @click="goProfile">
            <pul-badge :value="badge.num" :max="badge.max" :hidden="badge.hidden">
              <img :src="avatarUrl | defaultAvatar('?x-oss-process=image/resize,m_fixed,h_34,w_34')" alt="">
            </pul-badge>
          </span>
          <transition name="fade">
            <div class="login-menu" v-if="!userInfo.user_id" v-show="showMenu">
              <button class="btn btn-default" @click="$router.push('/login')">登录</button>
              <button class="btn btn-default" @click="$router.push('/register')">注册</button>
            </div>
          </transition>
          <transition name="fade">
            <div class="person-menu" v-if="userInfo.user_id" v-show="showMenu">
              <button class="btn btn-default" @click="$router.push('/chatroom')">我的好友</button>
              <button class="btn btn-default" @click="$router.push('/profile')">个人中心</button>
              <button class="btn btn-default" @click.stop="logout">注销</button>
            </div>
          </transition>
        </div>
        <div class="fl btn-issue-wrap">
          <button class="btn btn-primary" @click="submitIssue">发布动态</button>
        </div>
      </div>
    </div>
    <pul-dialog :title="title" custom-class="dialog-custom-class" top="50px" :center="true" :visible.sync="visible">
      <div class="issue-form">
        <div class="form-group">
          <img class="avatar-img" :src="avatarUrl" alt=""> 
          <textarea class="form-control text" name="content" placeholder="动态文本(最多240字)"
            maxlength="240" v-model="form.content"></textarea>
        </div>
        <div class="issue-pictures">
          <pul-upload :action="action"
             :data="extraData"
             :headers="headers"
             :on-success="handleSuccess"
             :on-exceed="handleExceed"
             :on-error="handleError"
             :on-remove="handleRemove"
             :file-list="fileList"></pul-upload>
        </div>
      </div>
      <div slot="footer" class="clearfix">
        <div class="fr">
          <!-- <pul-select width="126px" popper-class="popperClass" customer-class="customerClass">
            <pul-option v-for="(level,index) in levelArr" :key="index" 
            @selectOption="selectOption(level)">{{level.displayName}}</pul-option>
          </pul-select> -->
          <div class="level-wrapper">
            <div class="level-container">
              <span>{{curLevel.displayName}}</span>
              <span class="iconfont icon-arrow-down-o"
              :class="{'is-reverse': showLevelMenu}"
               @click.stop="handleArrowIconClick"></span>
            </div>
            <transition name="fade">
              <ul class="level-menu" v-show="showLevelMenu">
                <li class="level-menu-item"  v-for="(level,index) in levelArr" 
                  :key="index" @click.stop="handleLevelItemClick(level)">
                  {{level.displayName}}
                </li>
              </ul>
            </transition>
          </div>
          <button class="btn btn-primary btn-submit" @click="publish">发布</button>
        </div>
      </div>
    </pul-dialog>
  </div>
</template>
<script>
import Dialog from '../../component/common/Dialog.vue';
import Upload from '../../component/common/Upload.vue';
import Badge from '../../component/common/Badge.vue';
import * as MomentApi from '../../api/MomentApi'
import {searchByNickname} from '../../api/UserApi'
import { getMessageNum } from '../../api/MessageApi'
import {PRIVATE_LEVEL} from '../../model/Enum'
import _ from 'lodash'
import Cookies from 'js-cookie'
let token = Cookies.get('token');

export default {
  name: 'my-head',
  data(){
    let data = {};

    data.title = '发布新动态';
    data.form = {
      userId: '',
      pictureList: [],
      content: '',
      privacyLev: 0
    };
    data.badge = {
      num: 0,
      max: 99,
      hidden: true
    };
    data.visible = false;
    data.action = '/zuul/picture-service/picture/upload';
    data.extraData = {
      userId: '',
    }
    data.headers = {
      token: token
    }
    data.fileList = [];
    data.showMenu = false;
    data.showLevelMenu = false;
    data.curLevel = PRIVATE_LEVEL[0]
    data.levelArr = PRIVATE_LEVEL;
    data.searchContent = '';
    data.searchList = [];
    data.searchListLoading = false;

    return data;
  },
  watch:{
   
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    friendId(){
      return this.$store.state.friendId
    },
    avatarUrl() {
      let userInfo = this.$store.getters.userInfo;
      console.log(userInfo)
      return userInfo.profile_picture_url;
    },
  },
  methods:{
    search:_.debounce(function(content) {
      if (!(content && content.length)) return;

      this.remote(content);
    }, 300),
    // search(content){
    //   if (!content.length) this.searchListShow = false;
    //   this.searchListShow = true;

    //   _.debounce(function(content) {
    //     console.log(content, this)
    //     this.remote(content)
    //   }, 300);
    // },
    goProfile(){
      if (this.userInfo && this.userInfo.user_id) {
        this.$router.push('/profile')
      } else {
        this.$message.warning('身份认证失效，请重新登录');
        return
      }
    },
    async remote(content){
      let params = {
        nickname: content,
        num: 5
      }
      this.searchListLoading = true;
      try {
        let res = await searchByNickname(params) 
        if (res.status == 1) {
          this.searchList = res.data;
        } else {
          this.$message.error('检索失败')
        }
      } catch (error) {
        console.log(error)
      } finally{
        this.searchListLoading = false;
      }
    },
    logout(){
      this.$router.push('/login')
      this.$store.dispatch('user/logout')
    },
    submitIssue(){
      // 检测登录
      if (this.userInfo && this.userInfo.user_id) {
        this.visible = true;
      } else {
        this.$message.warning('请先登录')
        return
      }
    },
    handleArrowIconClick(){
      this.showLevelMenu = !this.showLevelMenu;
    },
    handleLevelItemClick(level){
      this.form.privacyLev = level.type;
      this.curLevel = level;
      this.showLevelMenu = false;
    },
    handleSuccess(res, file){
      let filename = file.name;
      let data = res.data;
      let pictureUrl = res.data.pictureUrl;
      let lastIndex = this.fileList.length - 1;
      this.fileList[lastIndex] = {name: filename, pictureUrl: pictureUrl, type: data.type, size: data.size};
    },
    handleExceed(){

    },
    handleError(){

    },
    handleRemove(index){
      
    },
    async publish(){
      if (this.fileList.length === 0 && this.form.content.length === 0) {
        this.$message.error('图片和冬天内容至少填一项')
      }
      try {
        let pictureList = [];
        if (this.fileList.length === 0) pictureList = []
        else  pictureList = this.fileList.map(file => file.pictureUrl)
        this.form.userId = this.userInfo.user_id;
        this.form.pictureList = pictureList;

        let data = await MomentApi.publish(this.form)
        if (data.status == 1) {
          this.form.content = '';
          this.form.pictureList = [];
          this.fileList = [];
          this.visible = false;
          this.$message.success('动态发布成功')
        } else {
          this.visible = false
          this.$message.error(data.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async init(){
      if (!this.userInfo) return;
      try {
        let params = {
          userId: this.userInfo.user_id
        }
        let badge = this.badge;
        let res = await getMessageNum(params);
        if (res.status == 1) {
          let num = res.data.friendRequestNum + res.data.letterNum;
          if (num) {
            badge.num = num;
            badge.hidden = false;
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    [Dialog.name]: Dialog,
    [Upload.name]: Upload,
    [Badge.name]: Badge
  },
  mounted() {
    this.extraData.userId = this.userInfo.user_id;
    this.init();
  }
}
</script>
<style lang="scss">
.customerClass{
  margin-left: -40px;
}

$color-gray: RGBA(51, 51, 51, 1);
$color-green: RGBA(33, 178, 146, 1);
.pulingle-head-wrap{
  background-color: #fff;
  box-shadow: 0 0 4px RGBA(0, 0, 0, 0.23);
  height: 50px;
  width: 100%;
}
.pulingle-head{
  max-width: 950px;
  height: 100%;
  margin: 0 auto;
}

.pulingle-head-nav{
  height: 50px;

  a{
    height: 50px;
    display:block;
    line-height: 50px;
    font-size: 14px;
    float: left;
    color: $color-gray;
    margin: 0 10px; 
  }

  a.logo-wrap{
    width: 150px;
    max-height: 100%;

    img{
      vertical-align: middle;
    }
  }
}

.pulingle-head-right{
  height: 50px;

  .pulingle-search{
    color: RGBA(136, 136, 136, 1);
    position: relative;
    margin-top: 8px;
    margin-right: 20px;
    height: 34px;
    line-height: 32px;
    border:1px solid RGBA(224, 224, 224, 1);
    border-radius: 16px;
    width: 222px;

    input{
      height: 32px;
      line-height: 32px;
    }

    .iconfont{
      cursor: pointer;
      font-size: 16px;
      line-height: 32px;
      color: RGBA(136, 136, 136, 1);
      margin-right: 5px;
      pointer-events: auto;
    }

    .search-list-wrapper{
      background-color: #fff;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      box-sizing: border-box;
      width: 250px;
      min-height: 150px;
      position: absolute;
      top: 43px;
      left: 0;
      z-index: 2;
    }

    .search-list{
      padding: 5px;
      padding-bottom: 0;
      overflow: auto;

      .popper-arrow{
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        top: -6px;
        left: 50%;
        margin-right: 3px;
        border-top-width: 0;
        border-bottom-color: #ebeef5;
        border-width: 6px;
        filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
      }

      .popper-arrow:after{
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
      }

      .search-item{
        border-bottom: 1px solid #ebebeb;
        padding: 0 5px;
        margin: 0;
        line-height: 34px;
        cursor: pointer;
        color: #606266;
        font-size: 14px;
        list-style: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        a{
          color: #000;
          display: flex;
          padding: 5px 0;
          font-size: 14px;
          font-weight: bold;
        }
        img{
          border-radius: 5px;
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }

      &-loading{
        width: 100%;
        text-align: center;
        height: 150px;
        line-height: 150px;

        .icon-loading{
          display: inline-block;
          animation: loading-rotate 1s linear infinite;
        }
      }
    }
  }

  .pulingle-avatar{
    cursor: pointer;
    margin: 8px 20px 0 0;
    position: relative;

    >a {
      display: inline-block;
    }

    img{
      width: 34px;
      height: 34px;
      border-radius: 50%;
    }

    .login-menu, .person-menu{
      background-color: #fff;
      border: 1px solid #ebebeb;
      border-radius: 4px;
      box-shadow: 0 5px 20px rgba(26,26,26,.1);
      position: absolute;
      width: 120px;
      top: 40px;
      left: 50%;
      padding: 10px 0;
      transform: translateX(-50%);
      z-index: 1;

      .btn{
        display: block;
        width: 100%;
        margin-bottom: 10px;
      }
    }
  }

  .btn-issue-wrap{
    color: #fff;
    margin-top: 8px;

    .btn{
      border-radius: 16px;
    }
  }
}

.dialog-custom-class{
  max-width: 650px;
}

.issue-form{

  .form-group{
    border:none;
    border-radius: 0;
    display: flex;

    textarea.text{
      border: 1px solid $color-green;
      display: inline-block;
      width: 630px;
      min-width: 70%;
      margin-left: 10px;
      height: 200px;
    }
  }

  .avatar-img{
    border-radius: 50%;
    width: 36px;
    height: 36px;
    vertical-align: top;
  }

  .issue-pictures{
    padding-left: 30px;
  }
}
.level-wrapper{
  display: inline-block;
  position: relative;
  margin-right: 17px;

  .level-container{
    width: 120px;
    text-align: right;

    span:first-child{
      padding-right: 5px;
    }

    .iconfont{
      cursor: pointer;
      font: bold 12px/40px 'Microsoft YaHei';
      transition: transform .3s;
      transform: rotate(0deg);
    }

    .is-reverse{
      transform: rotate(180deg);
    }
  }

  .level-menu{
    background-color: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    width: 120px;
    position: absolute;
    z-index: 101;

    &-item{
      font-size: 14px;
      padding: 0 10px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;
      text-align: left;

      &.hover, &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
.btn-submit{
  border-radius: 18px;
  width: 116px;
}
</style>


