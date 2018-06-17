<template>
  <div class="picture-wall-wrapper">
    <my-head></my-head>
    <div class="picture-wall-container">
      <div class="picture-wall-hd">
        <p>照片墙</p>
      </div>
      <div class="picture-wall-bd">
        <pul-loadmore :bottom-method="loadmore" ref="loadmore"
          :page-num="page.pageNum" :current-page="page.currentPage">
          <div class="picture-wall-item clearfix" v-for="(item,index_out) in page.resultList" :key="index_out">
            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 album-date">
              <p>{{item.month | formatTime}}</p>
            </div>
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 album-list">
              <span class="album-picture" :class="[{'is-first': index === 0},{'third': index === 3},{'fourth': index === 4}]" 
              v-for="(picture,index) in item.pictureInfoList" 
              :key="picture.albumPictureId" @mouseenter="curIndex = index" @mouseleave=" curIndex = ''">
                <img v-lazy="`${picture.pictureUrl}?x-oss-process=image/resize,m_fill,h_${index === 0 ? 380 : 182},w_250`" 
                @click.stop="preview(item.pictureInfoList, index)">
                <!-- <p class="publish-time">2018-09-09</p> -->
                <transition name="fade">
                  <div class="album-picture-mask clearfix" v-show="curIndex === index">
                    <span class="publish-time fl">{{picture.uploadTime  }}</span>
                    <span class="fr iconfont icon-trash" @click.stop="deletePicture(item.pictureInfoList, picture, index)"></span>
                    <span class="fr iconfont icon-yulan"  @click.stop="preview(item.pictureInfoList, index)"></span>
                  </div>
                </transition>
              </span>
              <div class="album-list-collpase" v-if="item.pictureInfoList.length >= pictureNum">
                <span class="iconfont icon-cc-arrow-down-circle" 
                  @click="expendAlbum(item)" v-if="!item.isCollapse">展开</span>
                <span class="iconfont icon-cc-arrow-up-circle" @click="collapseAlbum(item)" v-else>收起</span>
              </div>
            </div>
          </div>
        </pul-loadmore>
      </div>
      <div class="btn-upload-wrap">
        <button class="btn btn-primary" @click="handleBtnClick">我要上传</button>
        <!-- <button class="btn btn-primary" @click="loadmore">点击加载更多</button> -->
      </div>
    </div>
    <pul-dialog :title="title" custom-class="dialog-custom-class" top="50px" 
    :center="true" :visible.sync="visible">
      <div class="picture-form">
        <pul-upload :action="action"
            :data="extraData"
            :headers="headers"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :on-error="handleError"
            :on-remove="handleRemove"
            :file-list="fileList"
            :limit="limit"></pul-upload>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" @click="handleUploadBtnClick">上传</button>
      </div>
    </pul-dialog>
  </div>  
</template>
<script>
import {syncroAlbum, queryAlbumPictureByForWall, queryAlbumPictureByMonth, deleteAlbumPicture} from '../../api/PictureApi'
import Head from '../../component/head/Head.vue'
import Dialog from '../../component/common/Dialog.vue'
import Upload from '../../component/common/Upload.vue'
import Loadmore from '../../component/common/Loadmore.vue'
import Page from '../../model/Pagination'
import Cookies from 'js-cookie'
let token = Cookies.get('token')
let HEIGHT = 182;

export default {
  data(){
    let data = {};

    data.title = '上传照片到照片墙';
    data.visible = false;
    data.action = '/zuul/picture-service/picture/upload';
    data.extraData = {
      userId: ''
    }
    data.headers = {
      token: token
    }
    data.fileList = [];
    data.limit = 30;
    data.page = new Page(1, 2)
    data.pictureNum = 5;
    data.curIndex = '';
    data.model = {};
    data.currentModel = {};
    return data;
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  watch:{
    currentModel(val){
      // console.log(val)
    }
  },
  methods: {
    async expendAlbum(item, index){
      // month
      let model = this.model;
      let month = item.month;
      let currentModel = model[month];
      let pictureInfoList = item.pictureInfoList;// 列表
      let params = {
          pictureNum: this.pictureNum,
          userId: this.userInfo.user_id,
          month: month
      }
      console.log(currentModel)
      if (currentModel && currentModel.init){
        // 初始化过的
        item.pictureInfoList = item.pictureInfoList.concat(model[month].list); 
      } else {
        let res = await queryAlbumPictureByMonth(params);
        if (res.status == 1) {
          model[month] = {};
          model[month].init = true;
          model[month].list = res.data;
          item.pictureInfoList = item.pictureInfoList.concat(model[month].list); 
          console.log(pictureInfoList, model[month].list)
        } else {
          this.$message.error('展开失败，请重试')
        }
      }
      item.isCollapse = true;
    },
    collapseAlbum(item){
      let model = this.model;
      let month = item.month;
      let currentModel = model[month];
      let pictureNum = this.pictureNum;
      let pictureInfoList = item.pictureInfoList;
      pictureInfoList.splice(pictureNum, currentModel.list.length);

      item.isCollapse = false;
    },
    async deletePicture(pictureList, picture, index){
      try {
        let res = await deleteAlbumPicture({albumPictureId: picture.albumPictureId})
        if (res.status == 1) {
          pictureList.splice(index, 1)   
        } else {
          this.$message.error('删除照片失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    preview(rawItems, index){
      let items = this.normalItems(rawItems);

      this.$preview({
        items:items,
        index: index
      })
    },
    normalItems(rawItems){
      let items = [];

      items = rawItems.map((rawItem, index) => {
        let item = {};
        item.html = `<img src=${rawItem.pictureUrl} 
                    style="max-height:100%;
                    max-width:50%;
                    transform:translate3d(-50%, -50%, 0);
                    position: absolute;
                    left: 50%;
                    top: 50%;" />`;

        return item;
      })

      return items;
    },
    async init(){
      let page = this.page;
      let form = {
        userId: this.userInfo.user_id,
        pageSize: page.pageSize,
        currentPage: page.currentPage,
        pictureNum: this.pictureNum
      }
      let instance = this.$loading();
      try {
        let res = await queryAlbumPictureByForWall(form);
        if (res.status == 1){
          let newPage = Page.as(res.data);
          page.merge(newPage);
        } else {
          this.$message.error('获取照片墙信息失败！')
        } 
      } catch (error) {
        console.log(error)
      } finally{
        instance.close()
      }
    },
    async loadmore(){
      let page = this.page;
      page.currentPage++;
      let form = {
        userId: this.userInfo.user_id,
        pageSize: page.pageSize,
        currentPage: page.currentPage,
        pictureNum: this.pictureNum
      }
      this.$refs.loadmore.loading = true;
      try {
        let res = await queryAlbumPictureByForWall(form);
        if (res.status == 1){
          let newPage = Page.as(res.data);
          this.formatTime(newPage.resultList);
          page.merge(newPage);
        } else {
          this.$message.error('获取照片墙信息失败！')
        } 
      } catch (error) {
        console.log(error)
      } finally{
        this.$refs.loadmore.bottomLoaded();
      }
    },
    async handleUploadBtnClick(){
      let fileList = this.fileList;
      if (!fileList.length) return this.$message.warning('至少上传一张照片')
      let params = {
        userId: this.userInfo.user_id,
        pictureList: fileList
      }
      let res = await syncroAlbum(params)
      if (res.status == 1) {
        this.visible = false
        this.fileList = []
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败，请重试')
      }
    },
    handleBtnClick(){
      this.visible = true;
    },
    handleSuccess(res, file){
      let fileList = this.fileList;
      let filename = file.name;
      let data = res.data;
      let pictureUrl = res.data.pictureUrl;
      let lastIndex = fileList.length - 1;
      fileList[lastIndex] = {name: filename, pictureUrl: pictureUrl, type: data.type, size: data.size};
    },
    handleExceed(){

    },
    handleError(){

    },
    handleRemove(){

    }
  },
  filters:{
    formatTime(rawMonth){
      let arr = rawMonth.split('-');
      let date = new Date(arr[0],Number(arr[1]) - 1);

      return date.format('yy/MM')
    }
  },
  mounted(){
    this.extraData.userId = this.userInfo.user_id;
    this.init();
  },
  components: {
    [Head.name]: Head,
    [Dialog.name]: Dialog,
    [Upload.name]: Upload,
    [Loadmore.name]: Loadmore
  }
}
</script>
<style lang="scss">
.picture-wall-wrapper{
  background-color: #F5F6F5;
  min-height: 600px;
  overflow: hidden;
  
  .picture-wall-container{
    background-color: #fff;
    padding: 24px 25px;
    width: 960px;
    margin: 24px auto 50px;
    position: relative;

    .btn-upload-wrap{
      position: absolute;
      top:24px;
      right: 25px;

      .btn{
        border-radius: 12.5px;
        font-size: 12px;
        height: 27px;
        line-height: 27px;
        padding: 0 12px;
      }
    }
  }
}
.picture-wall-hd{
  margin-bottom: 28px;

  p{
    border-bottom: 1px solid #000;
    color: #000;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    padding: 0 5px 10px 5px;
  }
}
.picture-wall-bd{
  margin-bottom: 28px;

  .picture-wall-item{
    margin: 10px;
  }
  .album-date{
    color: RGBA(129, 138, 144, 1);
    font-size: 18px;
  }

  .album-list{
    display: flex;
    flex-flow: row wrap;
    position: relative;
    //margin-bottom: 40px;

    // &.is-collapse{
    //   max-height: 400px;
    // }

    &-collpase{
      width: 100%;
      padding: 10px 0;
      text-align: center;
      // position: absolute;
      // top: 100%;

      span{
        color: $color-base;
        cursor: pointer;
        font-size: 18px;
      }

      .iconfont::before{
        font-size: 18px;
        padding-right: 5px;
      }
    }

    .album-picture{
      box-sizing: border-box;
      width: 250px;
      height: 182px;
      margin-right: 10px;
      margin-bottom: 14px;
      position: relative;
      overflow: hidden;

      &.is-first{
        height: 380px;
      }

      &.third{
        position: absolute;
        top: 200px;
        left: 260px;
      }
      &.fourth{
        position: absolute;
        top:200px;
        left: 520px;
      }
      &:hover img {
        opacity: .65;
        // filter: blur(4px);
        transform: scale3d(1.05,1.05,1);
      }
      
      img{
        width: 100%;
        height: 100%;
        transition: all .35s;
      }

      .publish-time{
        color: #fff;
        text-align: center;
        height: 40px;
        line-height: 40px;
      }

      &-mask{
        background-color: rgba(0,0,0,.5);
        position: absolute;
        left:0;
        right: 0;
        bottom: 0;
        z-index: 2;
        padding: 0 10px;
        height: 40px;
        line-height: 40px;

        .publish-time{
          color: #fff;
        }

        .iconfont{
          color: #fff;
          cursor: pointer;
          font-size: 16px;
          margin-right: 10px;
        }

        .icon-yulan{
          font-size: 20px;
          line-height: 42px;
        }
      }
    }    
  }

}

.picture-form {
  min-height: 400px;
}
</style>

