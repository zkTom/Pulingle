<template>
  <div class="issue" id="issue" v-if="!loading">
    <my-head></my-head>
    <pul-banner banner-style="width:100%;height:350px;" :autoplay="autoplay" :interval="interval">
      <pul-banner-item v-for="(imgUrl, index) in imgUrls" :key="index">
        <img :src="imgUrl" alt="url" class="banner-img" />  
      </pul-banner-item> 
    </pul-banner>
    <div class="clearfix row issue-container">
      <div class="col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xsoffset-0
        col-lg-2 col-md-2 col-sm-2 col-xs-0 personal-info__wrapper">
          <div class="bg"></div>
          <div class="personal-info">
            <a href="javascript:void(0);">
              <img class="avatar-img" :src="userInfo.profile_picture_url | defaultAvatar('?x-oss-process=image/resize,m_fixed,h_70,w_70')" alt="">
            </a>
            <span class="nickname">{{userInfo.nickname}}</span>
            <span class="btn-group myself-group">
              <span class="num issue-num">
                <strong>{{userInfo.momentNum}}</strong> <br/>动态</span>
              <span class="border-line"></span>
              <span class="num friend-num">
                <strong> {{userInfo.friendNum}}</strong> <br/>好友</span>
            </span>
            <p  class="introduction">个性签名：{{signature}}</p>
          </div>
          <div class="my-picture-list">
            <div class="my-picture-list-hd">
              <p>我的照片</p>
              <router-link to="/picture-wall">查看更多</router-link>
            </div>
            <div class="my-picture-list-bd">
              <ul v-if="albumList.length">
                <li v-for="(picture, index) in albumList" :key="index">
                  <img v-lazy="`${picture.pictureUrl}?x-oss-process=image/resize,m_fixed,h_55,w_55`" alt="">
                </li>
              </ul>
              <p class="no-data" v-else>暂无图片！</p>
            </div>
          </div>
      </div>
      <div class="col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xsoffset-0
        col-lg-2 col-md-2 col-sm-2 col-xs-0 personal-info__wrapper-mask"
        v-show="false"></div>
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 issues" id="issues">
        <div class="zone-hd" ref="issues">
          <span :class="['zones', {'active': curType === 'zones'}]" @click="handleFriendClick">好友动态</span>
          <span :class="['second-zone', {'active': curType === 'second-zone'}]" @click="handleSecFriendClick">推荐动态</span>
        </div>
        <keep-alive>
          <template v-if="curType === 'zones'">
            <template v-if="currentModel.page.resultList.length">
              <pul-loadmore :bottom-method="loadmore" ref="loadmore"
              :page-num="currentModel.page.pageNum" :current-page="currentModel.page.currentPage">
                <issue-item v-for="(item, index) in currentModel.page.resultList" :key="index" 
                :visited-user-info="userInfo" :item="item"></issue-item>
              </pul-loadmore>
            </template>
            <div class="no-data" v-else>
              <p>你的好友还没发过动态！</p>
            </div>
          </template>
          <template v-else>
            <template v-if="currentModel.page.resultList.length">
              <pul-loadmore :bottom-method="loadmore" ref="loadmore"
              :page-num="currentModel.page.pageNum" :current-page="currentModel.page.currentPage">
                <issue-item v-for="(item, index) in currentModel.page.resultList" :key="index" 
                :visited-user-info="userInfo" :item="item"></issue-item>
              </pul-loadmore>
            </template>
            <div class="no-data" v-else>
              <p>暂时没有推荐动态!</p>
            </div>
          </template>
        </keep-alive>
      </div>
      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-0 new-issues">
        <div class="new-issues-hd">
          <p>最新动态</p>
          <a href="javascript:void(0);">刷新</a>
        </div>
        <div class="new-issues-bd">
          <div class="new-issue"  v-for="(moment, index) in lastMomentList" :key="index" 
            @click="$router.push(`/issue/${moment.userId}`)">
            <span class="avatar-img">
              <img :src="moment.profilePictureUrl | defaultAvatar" alt="">
            </span>
            <span class="user-info">
              <p class="nickname">{{moment.nickname}}</p>
              <p class="send-time">{{moment.time}}</p>
            </span>
            <!-- <span class="btn-group">
              <button class="btn btn-default" >查看他</button>
            </span> -->
          </div>
        </div>
      </div>
      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-0 new-issues-mask" v-show="false"></div>
    </div>
  </div>
</template>
<script>
import Head from "../../component/head/Head.vue";
import Banner from '../../component/banner/Banner.vue';
import BannerItem from '../../component/banner/Banner-Item.vue';
import IssueItem from './Issue-Item.vue';
import Loadmore from '../../component/common/Loadmore.vue';
import {queryRecommendMoments, queryFriendMomentByUserId} from '../../api/MomentApi'
import {acceptFriendRequest, queryFriendMomentStatus} from '../../api/UserApi'
import {queryNewAlbumPicture} from '../../api/PictureApi'
import Page from '../../model/Pagination';

import bannerImg from '../../assets/images/banner.png';

const friendType = ['zones', 'second-zone'];
export default {
  name: 'zone',
  data() {
    let data = {};
    data.imgUrls = [
      bannerImg,bannerImg,bannerImg,bannerImg
    ],
    data.avatarUrl = '';
    data.autoplay = false;
    data.interval = 2000;
    data.isFav = false; // 点赞
    // data.page = new Page();
    // data.secondFriendPage = new Page();//二度好友列表
    data.isFixed = false;
    data.loading = false; // 全屏loading
    data.subListLoading = false; // 子列表loading
    data.model = {
      'zones':{
        page: new Page(),
        request: queryFriendMomentByUserId,
        init: false
      },
      'second-zone':{
        page: new Page(),
        request: queryRecommendMoments,
        init: false
      }
    }
    data.currentModel = {
      page: new Page()
    };
    data.curIndex = '';
    data.curType = 'zones';
    data.albumList = [];
    data.lastMomentList = [];
    return data;
  },
  props: {
    friendId: String //搜索的friendId
  },  
  computed:{  
    userInfo(){
      return this.$store.getters.userInfo
    },
    signature(){
      let signature = this.userInfo.signature
      let defaultSignature = '这个人很懒，什么都没留下！'
      if (signature && signature.length > 0) return signature
      return defaultSignature
    }
  },
  methods:{
    handleFriendClick(){
      this.curType = 'zones'
      // 拉取数据
    },
    handleSecFriendClick(){
      this.curType = 'second-zone'
      //拉取数据

    },
    // 拉取全部好友数据
    async initModel(){
      let currentModel = this.model[this.curType];
      let page = currentModel.page;
      let params = {
        userId: this.userInfo.user_id,
        currentPage: page.currentPage,
        pageSize: page.pageSize
      }
      this.subListLoading = true;
      let instance = this.$loading({target: '#issues'}); 
      try {   
          let res = await currentModel.request(params);
          if (res.status == 1) {
            let newPage = Page.as(res.data)
            page.merge(newPage)
            currentModel.init = true;
            this.currentModel = currentModel;
          } else  {
            this.$message.error('获取动态消息失败')
          }
      } catch (error) {
        console.log(error)
      } finally{
        this.subListLoading = false;
        instance.close();
      }
    },
    async init(){
      let currentModel = this.model[this.curType];
      let page = currentModel.page;
      let params = {
        userId: this.userInfo.user_id,
        currentPage: page.currentPage,
        pageSize: page.pageSize
      }
      let albumParams = {userId: this.userInfo.user_id}
      let friendParams = {userId: this.userInfo.user_id, num: 5}
      let microTask = [];

      this.loading = true;
      let instance = this.$loading({text: '加载中...'}); 
      microTask.push(queryNewAlbumPicture(albumParams))
      microTask.push(currentModel.request(params))
      microTask.push(queryFriendMomentStatus(friendParams))
      Promise.all(microTask).then(res => {
        if (res[0].status == 1 && res[1].status == 1 && res[2].status == 1) {
          let newPage = Page.as(res[1].data)
          page.merge(newPage)
          currentModel.init = true;
          this.currentModel = currentModel;
          this.albumList = res[0].data;
          this.lastMomentList = res[2].data;
        } else {
          // this.$store.dispatch('user/logout');
          this.$message.error('身份认证失效，请重新登录')
        }
      }).catch(error => {
        console.log(error)
      }).finally(() =>{
        this.loading = false;
        instance.close();
      })
    },
    async loadmore(){
      let currentModel = this.model[this.curType];
      let page = currentModel.page;
      page.currentPage = page.currentPage + 1;
      let params = {
        userId: this.userInfo.user_id,
        currentPage: page.currentPage,
        pageSize: page.pageSize
      }
      try {
        this.$refs.loadmore.loading = true;
        let res = await currentModel.request(params);
        this.$refs.loadmore.bottomLoaded();
  
        if (res.status == 1) {
          let newPage = Page.as(res.data)
          page.merge(newPage)
        } else {
          this.$message.error('获取动态信息失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleDocumentScroll(event){
      let scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
      if (scroll_top > 410) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
      // console.log(scroll_top, event)
    }
  },
  watch:{
    curType(val){
      let currentModel = this.model[val];

      if(!currentModel.init){
        this.initModel()
      } else {
        this.currentModel = currentModel;
      }
    }
  },
  mounted(){
    this.init();
    // 监听滚动
    window.addEventListener('scroll', this.handleDocumentScroll)
  },
  components:{
    [Head.name]: Head,
    [Banner.name]: Banner,
    [BannerItem.name]: BannerItem,
    [IssueItem.name]: IssueItem,
    [Loadmore.name]: Loadmore
  }
}
</script>
<style lang="scss">
$color-base: RGBA(33, 178, 146, 1);
.issue{
  background-color: #F5F6F5;
  overflow: hidden;

  .banner-img{
    width: 100%;
    height: 100%;
    border: 0;
  }
}

.issue-container{
  width: 1180px;
  min-height: 600px;
  margin: 10px auto 0;
  position: relative;
}

.personal-info__wrapper{ 
  border-radius: 4px;
  position: relative;

  &.fixed{
    width: 196.16px;
    position: fixed;
    top: 0;
    left: 5.2%;
  }
  &-mask{
    position: relative;
  }
  .bg{
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 90px;
    background-color: $color-base;
  }

  .personal-info{
    background-color: #fff;  
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-top: 45px;
    padding-bottom: 10px;

    >a{
      background: #fff;
      border-radius: 50%;
      display: block;
      left: 50%;
      top: 50px;
      position: absolute;
      transform: translateX(-50%);
      z-index: 1;
      padding: 4px;
      
      .avatar-img{
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
    }

    .nickname{
      display: block;
      text-align: center;
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 5px;
    }

    .btn-group{
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 30px 5px;
    
      .btn{
        border-radius: 16px;
        width: 70px;
        font-size: 12px;
        padding-top: 4px;
        padding-bottom: 4px;
      }

      .btn-info{
        background-color: #fff;
        border:1px solid $color-base;
      }
    }

    .btn-group.myself-group{

      .num{
        width: 60px;
        color: #000;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
      }
      .border-line{
        border-right: 2px solid #000;
        height: 25px;
      }
    }

    .introduction{
      border: 1px solid transparent;
      font-weight: 500;
      font-size: 14px;
      margin:15px 15px 5px 20px;
      min-height: 150px;
      line-height: 1.428;
      overflow: hidden;
      white-space: wrap;
    }
  }

  .my-picture-list{
    background-color: #fff;
    border-radius: 4px;
    margin-top: 7px;

    &-hd{
      border-bottom: 1px solid RGBA(234, 237, 234, 1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      height: 40px;

      p{
        color: #000;
        font-size: 14px;
        font-weight: 700;
      }

      a{
        color: $color-base;
      }

    }

    &-bd{
      min-height: 175px;
      padding: 10px 5px;

      ul{
        display: flex;
        flex-flow: row wrap;
        margin: 0;
        padding: 0;
        list-style: none;
        padding-left: 5px;
      }

      li{
        margin-right: 5px;

        img{
          width: 55px;
          height: 55px;
        }
      }
    }
  }
}
.issues{
  background-color: #fff;
  border-radius: 4px;
  margin-left:10px;
  min-height: 500px;

  .zone-hd{
  padding: 15px;
  font-size: 16px;
  border-bottom: 1px solid #ccc;

    .zones, .second-zone{
      margin-right: 25px;
      cursor: pointer;
    }

    .active{
      color: $color-base;
    }
  }
}
.new-issues{
  background-color: #fff;
  min-height: 400px;
  margin-left: 10px;

  &.fixed{
    width: 196.16px;
    position: fixed;
    top: 0;
    right: 12.2%;
  }
  &-mask{
    position: relative;
  }

  &-hd{
    border-bottom: 1px solid RGBA(234, 237, 234, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 40px;

    p{
      color: #000;
      font-size: 14px;
      font-weight: 700;
    }

    a{
      color: $color-base;
    }

  }

  &-bd{
    padding: 8px;

    .new-issue{
      align-items: center;
      display: flex;
      justify-content: flex-start;
      margin-bottom: 10px;
      position: relative;
      height: 50px;

      &:hover, &-active{
        background-color: #f5f5f5;
        cursor: pointer;
      }

      .avatar-img{
        width: 50px;
        height: 50px;
        margin-right: 15px;

        img{
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
      }

      .user-info{
        font-size: 12px;
        color: #000;
        line-height: 16px;
        
        .nickname{
          font-weight: 700;
        }
        
        .send-time{
          color: #777;
        }
      }

      .btn-group{

      }
      .btn{
        width: 50px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        font-size: 12px;
      }
    }

  }
}
</style>


