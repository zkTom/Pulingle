<template>
  <div class="chat-wrapper">
    <my-head></my-head>
    <div class="chat-container clearfix" v-if="!loading">
      <div class="friend-list fl">
        <p class="friend-list-hd">
          <span class="avatar">
            <img :src="userInfo.profile_picture_url | defaultAvatar" alt="">
          </span>
          <span class="nickname">{{userInfo.nickname}}</span>
        </p>
        <transition-group tag="ul" name="fadeOutLeft" class="friend-list-bd">
          <li class="friend-list-item" v-for="(req, index) in friendRequestList" :key="req.userInfo.userId">
            <span class="avatar">
              <img :src="req.userInfo.profilePictureUrl | defaultAvatar" alt="">
            </span>
            <span>
              <p class="txt nickname">{{req.userInfo.nickname}}</p>
              <p class="txt signature">{{req.content}}</p>
            </span>
            <div class="action">
              <button class="btn btn-default" @click.stop="addFriend(req,index)">添加</button>
              <button class="btn btn-default" @click.stop="ignoreFriend(req, index)">忽略</button>
            </div>
            
          </li>
          <template v-if="friendInfoList.length">
            <li class="friend-list-item my-friend" v-for="(info, index) in friendInfoList" :key="info.userId"
            @mouseenter.stop="curId = info.userId" 
            @mouseleave.stop="curId = 0"
            @click.stop="handleItemClick(info)">
              <span class="avatar">
                <img :src="info.profilePictureUrl | defaultAvatar" alt="">
              </span>
              <span>
                <p class="txt nickname">{{info.nickname}}</p>
                <p class="txt signature">{{info.content || '暂时没有消息'}}</p>
              </span>
              <div class="message-num" v-if="info.messageNum">
                  <pul-badge :value="info.messageNum" :max="99" :hidden="!info.messageNum" ></pul-badge>
              </div>
              <div class="action">
                <button class="btn btn-default" @click.stop="showMessageBox(info, index)" v-show="curId === info.userId">删除</button>
              </div>
            </li>
          </template>
          <p class="no-data" :key="'no-data'" v-else>你还没有好友！</p>
        </transition-group>
      </div>
      <div class="chat-content">
        <keep-alive>
          <pul-chatroom :friend-id="friendId" ref="chatroom" :visited-user-info="visitedUserInfo"></pul-chatroom>
        </keep-alive>
      </div>
    </div>
    <pul-message-box @confirm="confirm" ref="msg-box"></pul-message-box>
  </div>  
</template>
<script>
import Head from '../../component/head/Head.vue'
import Chatroom from './Chatroom.vue'
import Badge from '../../component/common/Badge.vue'
import MessageBox from '../../component/message-box/MessageBox.vue'
import {getFriendWithMessageList, acceptFriendRequest, deleteFriend} from '../../api/UserApi'
import {getFriendRequest, deleteFriendRequest} from '../../api/MessageApi'

export default {
  data(){
    let data = {};

    data.friendRequestList = [];// 好友请求列表
    data.friendInfoList = []; // 好友私信列表
    data.loading = false;
    data.curId = 0; 
    data.friendId = 0;
    data.visitedUserInfo = {};
    data.boxVisible = false;
    return data;
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  methods:{
    handleItemClick(infoData){
      let info = {
        nickname: infoData.nickname,
        profilePictureUrl: infoData.profilePictureUrl,
        userId: infoData.userId
      } 
      this.friendId = info.userId;
      this.visitedUserInfo = info;
      // 消息提示框消失（如果有的话）
      if (infoData.messageNum) infoData.messageNum = 0;
    },
    async init(){
      let microTask = [];
      let params = {userId: this.userInfo.user_id}

      microTask.push(getFriendRequest(params));
      microTask.push(getFriendWithMessageList(params));
      this.loading = true;
      let instance = this.$loading({target: document.body})

      Promise.all(microTask).then(res => {
        let reqData = res[0];
        let infoData = res[1]; 
        if (reqData.status == 1 && infoData.status == 1){
          this.friendRequestList = reqData.data;
          this.friendInfoList = infoData.data;
        } else {
          this.$message.error('获取好友信息失败')
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        this.loading = false;
        instance.close()
      })
      
      // try {
      //   let reqData = await getFriendRequest({userId: this.userInfo.user_id})
      //   let infoData = await getFriendInfoList({userId: this.userInfo.user_id}) 
      //   if (reqData.status == 1 && infoData.status == 1) {
      //     this.friendRequestList = reqData.data;
      //     this.friendInfoList = infoData.data;
      //   }
      // } catch (error) {
      //   console.log(error)
      // } finally{

      // }
    },
    showMessageBox(info, index){
      this.info = info;
      this.infoIndex = index;
      this.$refs['msg-box'].show();
    },
    confirm(){
      // delete
      let info = this.info;
      let index = this.infoIndex;
      let form = {
        userId: this.userInfo.user_id,
        friendId: info.userId
      }
      deleteFriend(form).then(res => {
        if (res.status == 1){
          this.friendInfoList.splice(index, 1)
          // 修改缓存信息
            let __localAuthInfoStr = sessionStorage.getItem('__local_auth_info');
            let userInfo = JSON.parse(__localAuthInfoStr);
            userInfo.friendNum--;
            sessionStorage.setItem('__local_auth_info', JSON.stringify(userInfo))
          this.$message.success('删除成功')          
        } else {
          this.$message.error('删除失败', res.msg)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('删除好友失败')
      })
    },
    async addFriend(req, index){
      try {
        let form = {
          userId: this.userInfo.user_id,
          friendId: req.sendUserId,
          messageId: req.messageId
        }
       let data = await acceptFriendRequest(form)
       if (data.status == 1){
         let frList = this.friendRequestList;
         let fiList = this.friendInfoList;
         frList.splice(index, 1)
         let info = {
           userId: req.userInfo.userId,
           profilePictureUrl: req.userInfo.profilePictureUrl,
           nickname: req.userInfo.nickname,
           content: '我已经添加你为好友了！'
         }
         fiList.unshift(info); 
         this.$message.success('添加成功')
       } else {
         this.$message.error('添加失败请重试')
       }
       console.log(data) 
      } catch (error) {
        console.log(error)
      }
    },
    async ignoreFriend(req, index){
      try {
        let res = await deleteFriendRequest({messageId: req.messageId})
        if (res.status == 1) {
          let frList = this.friendRequestList;
          frList.splice(index, 1)
        } else {
          this.$message.error('忽略好友请求失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // sureToDelete(info, index){
    //     let bool = false;
    //     this.$confirm('你确定删除该好友?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {

    //     }).then(res => {

    //     }).catch(() => {
    //       this.$message.info('已取消删除');          
    //     });
    //     return false;
    // },
  },
  watch: {
  },
  mounted(){
    this.init()
  },
  components: {
    [Head.name]: Head,
    [Chatroom.name]: Chatroom,
    [Badge.name]: Badge,
    [MessageBox.name]: MessageBox
  }
}
</script>
<style lang="scss">
$color-gray:RGBA(102, 102, 102, 1);
$color-base:RGBA(33, 178, 146, 1);

.chat-wrapper{
  background-color: #EAEDEA;
}
.chat-container{
  margin: 8px auto 0;
  width: 1120px;
  min-height: 500px;
  padding-bottom: 10px;
}
.friend-list{
  background-color: #fff;
  border-radius: 5px;
  width: 230px;
  height: 560px;
  text-align: center;
  overflow-y: auto;

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

  .avatar{
    flex-shrink: 0;
    margin-left: 20px;
    margin-right: 9px;

    img{
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }
  }
  .nickname{
    color: #000;
    font-size: 18px;
    font-weight: 500;
  }

  &-hd{
    border-bottom: 1px solid RGBA(234, 237, 234, 1);
    display: flex;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 7px;
  }

  &-bd{
    color: $color-gray;
    font-size: 14px;
    font-weight: 500;
  }

  .friend-list-item{
    align-items: center;
    display: flex;
    border-bottom: 1px solid RGBA(234, 237, 234, 1);
    cursor: pointer;
    height: 55px; 
    padding-top: 10px;
    padding-bottom: 7px;
    position: relative;
    text-align: left;

    .txt{
      color: RGBA(102, 102, 102, 1);
      font-size: 14px;
      font-weight: 500;
      width: 120px;
    }

    .nickname{
      color: #000;
      font-size: 16px;
      margin-bottom: 5px;
    }

    .signature{
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .message-num{
      position: absolute;
      right: 20px;
      bottom: 7px;
    }

    .action {
      position: absolute;
      right: 10px;

      .btn{
        display: block;
        border: 1px solid RGBA(153, 153, 153, 1);
        border-radius: 4px;
        padding: 0;
        width: 54px;
        line-height: 20px;
        margin-bottom: 5px;
      }

      .btn:hover, .btn.hover{
        background-color: $color-base;
        border: 1px solid $color-base;
        color: #fff;
      }
    }
  }

  .friend-list-item.my-friend{
    
    .txt{
      width: 140px;
    }
    .action{
      top: 10px;
    }
  }
}
.chat-content{
  background-color: #fff;
  border-radius: 5px;
  width: 800px;
  margin-left: 242px;
  min-height: 560px;
}
</style>


