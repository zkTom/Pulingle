<template>
  <div class="chatroom" v-if="visitedUserInfo.userId">
    <div class="chatroom-header">
      <p class="nickname">{{visitedUserInfo.nickname}}</p>
    </div>
    <div class="chatroom-body" id="chatroom-body" ref="chatroom-body">
      <div class="loadmore" :class="{'acive': subListLoading}">
        <button class="btn btn-default" v-show="hasNextPage" @click.stop="loadmore">
          <span class="iconfont" :class="iconStyle"></span>
          查看历史消息
        </button>
        <p class="loadmore" v-if="!hasNextPage">没有更多消息!</p>
      </div>
      <div v-for="(item, index) in currentModel.page.resultList" :key="index">
        <div class="send-time">
          <p>{{item.sendTime}}</p>
        </div>
        <div class="my-message" v-if="userInfo.user_id == item.sendUserId">
          <span class="txt">{{item.content}}</span>
          <img class="avatar" :src="userInfo.profile_picture_url" alt="">
        </div>
        <div class="other-message" v-else>
          <img class="avatar" :src="visitedUserInfo.profilePictureUrl" alt="">
          <span class="txt">{{item.content}}</span>
        </div>
      </div>
    </div>
    <div class="chatroom-footer">
      <div class="input-wrapper">
        <textarea type="text" class="input__inner" v-model.trim="form.content" 
        placeholder="请输入发送内容...[可按Enter发送消息]" maxlength="255" @keyup.enter.prevent="sendMessage"></textarea>
      </div>
      <div class="send-btn-wrap">
        <button class="btn btn-primary" @click="sendMessage">发送消息</button>
        <span class="tip">按Enter发送消息</span>
      </div>
    </div>
  </div>
</template>
<script>
import {getMessageRecords, send, readMessage} from '../../api/MessageApi'
import Page from '../../model/MessagePagination'
export default {
  name: 'pul-chatroom',
  data() {
    let data = {};
    data.id = this.friendId;
    data.model = {};
    data.currentModel = {
      page: new Page()
    };
    data.form = {
      type: 1,
      sendUserId: '',
      receUserId: this.friendId || '',
      content: ''
    }
    data.subListLoading = false;
    return data;
  },
  props:{
    friendId: Number ,
    visitedUserInfo: Object
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    },
    iconStyle(){
      return this.subListLoading ? 'icon-loading' : 'icon-clock'
    },
    hasNextPage(){
      let currentModel = this.currentModel;
      let page = this.currentModel.page;
      if (page.currentPage < page.pageNum) return true;

      return false;
    }
  },
  methods:{
    async initModel(){
      let friendId = this.friendId;
      let currentModel = this.model[friendId];
      let page = currentModel.page;
      let params = {
        userId: this.userInfo.user_id,
        friendId: friendId,
        pageSize: currentModel.page.pageSize,
        currentPage: currentModel.page.currentPage
      }
      let res = await getMessageRecords(params)
      if (res.status == 1) {
        let newPage = Page.as(res.data)
        newPage.resultList.reverse();
        page.merge(newPage)
        currentModel.init = true;
        this.currentModel = currentModel;

        let params = {
          receUserId: this.visitedUserInfo.userId,
          sendUserId: this.userInfo.user_id
        }
        let messageRes = await readMessage(params);
      } else {
       this.$message.warning('获取消息列表失败') 
      }
    },
    async sendMessage(){
      let form = this.form;
      let resultList = this.currentModel.page.resultList;

      if (!form.content) return this.$message.info('发送内容不能为空')
      if (form.content.length > 255) return this.$message.info('发送内容最多255个字')

      form.sendUserId = this.userInfo.user_id;
      form.receUserId = this.friendId;
      let res = await send(form);

      if (res.status == 1) {
        this.$message.success('发送成功')
        let message = {
          content: form.content,
          receUserId: form.receUserId,
          sendUserId: form.sendUserId,
          sendTime: new Date().format("yyyy-MM-dd hh:mm:ss")
        }
        resultList.push(message)
        //设置滚动高度

        form.content = '';
      }
    },
    async loadmore(){
      let friendId = this.friendId;
      let currentModel = this.currentModel;
      let page = currentModel.page;
      
      page.currentPage = page.currentPage + 1;

      let params = {
        userId: this.userInfo.user_id,
        friendId: friendId,
        pageSize: page.pageSize,
        currentPage: page.currentPage
      }
      try {
        this.subListLoading = true;
        let res = await getMessageRecords(params)
        if (res.status == 1){
          let newPage = Page.as(res.data)
          newPage.resultList.reverse();
          page.merge(newPage)
          this.currentModel = currentModel; 

          this.subListLoading = false;
        } else{
          this.$message.error('加载消息失败，请重试')
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  watch: {
    friendId(val){
      let model = this.model;
      if (!model[val]) {
        model[val] = {};
        model[val].page = new Page()
        model[val].init = false
      };
      //发送请求
      if (!model[val].init) this.initModel();
      else this.currentModel = model[val]
    }

  },
  mounted(){
  }
}
</script>
<style lang="scss">
$color-base:RGBA(33, 178, 146, 1);
.chatroom{
  width: 100%;
}
.chatroom-header {
  border-bottom: 1px solid RGBA(234, 237, 234, 1);
  height: 64px;
  line-height: 64px;

  .nickname{
    color: $color-base;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
}

.chatroom-body{
  border-bottom: 1px solid RGBA(234, 237, 234, 1);
  height: 300px;
  position: relative;
  padding: 13px 21px;
  overflow-y: auto;

  .loadmore{
    width: 100%;
    margin-bottom: 10px;
    text-align: center; 

    .iconfont{
      display: inline-block;
    }

    &.active{
      
      .btn{
        color: $color-base;
      }

      .icon-loading{
        animation: loading-rotate 1s linear infinite;
      }
    }
  }

  .avatar{
    border-radius: 50%;
    width: 48px;
    height: 48px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .txt{
    background-color: RGBA(234, 237, 234, 1);
    border-radius: 6px;
    color: #000;
    display: inline-block;
    padding: 10px;
    font-size: 14px;
  }
  .send-time{
    color: RGBA(154, 154, 154, 1);
    padding: 10px 0 20px;
    text-align: center;
  }

  .my-message, .other-message{
    display: flex;
    align-items: center;

  }
  .my-message{
    position: relative;
    justify-content: flex-end;
  }
  .other-message{
    position: relative;
    justify-content: flex-start;
  }
  &::-webkit-scrollbar {  
      width: 12px;  /*滚动条宽度*/
      height: 12px;  /*滚动条高度*/
  }  
  /*定义滚动条轨道 内阴影+圆角*/  
  &::-webkit-scrollbar-track  {  
      //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
      border-radius: 10px;  /*滚动条的背景区域的圆角*/
      background-color: rgba(204,204,204,.5);/*滚动条的背景颜色*/  
  }  
  /*定义滑块 内阴影+圆角*/  
  &::-webkit-scrollbar-thumb  {  
      border-radius: 10px;  /*滚动条的圆角*/
      //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
      background-color: #ccc;  /*滚动条的背景颜色*/
  }  
}
.chatroom-footer{
  height: 150px;
  padding: 10px 20px;
  position: relative;

  .input-wrapper{
    height: 115px;

    .input__inner{
      -webkit-appearance: none;
      background-color: transparent;
      background-image: none;
      border: none;
      box-shadow: none;
      color: #333333;
      font-size: 14px;
      line-height: 20px;
      outline: none;
      overflow-x: hidden;
      overflow-y: auto;
      transition: all .2;
      resize: none;
      width: 100%;
      height: 100%;
    }
  }

  .send-btn-wrap{
    margin-top: 5px;
    position: relative;
    text-align: right;

    .tip{
      display: none;
      color: #333333;
      position: relative;
      right: 10px;
      bottom: 5px;
      user-select: none;
    }
  }
}
</style>


