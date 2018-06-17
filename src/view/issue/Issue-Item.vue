<template>
 <div class="row issue-item clearfix">
  <div class="issue-content">
    <div class="issue-user-info">
      <router-link :to="{path: `/issue/${item.userId}`}" class="avatar">
        <img :src="avatarUrl | defaultAvatar('?x-oss-process=image/resize,m_fixed,h_48,w_48')" alt="">
      </router-link>
      <span>
        <p class="nickname">{{nickname}}</p>
        <p class="pushlish-time">{{item.createTime}}</p>
      </span>
    </div>
    <div class="issue-imgs">
      <img class="issue-img" v-for="(picture, index) in formatedPictureList" ref=""
      :src="`${picture}?x-oss-process=image/resize,m_fill,h_220,w_220`" alt=""
      :key="index" @click.stop="preview(item.pictureList, index)">
    </div>
    <div class="issue-desc">
      <p>{{item.content}}</p>
    </div>
    <div class="issue-action">
      <button class="btn btn-default fav" @click.stop="favourHandler"> 
        <span class="iconfont favour" :class="favourIcon"></span>{{item.thumbNum}}
      </button>
      <button class="btn btn-default comment" @click="isCollapse = !isCollapse">
        <span class="iconfont icon-comment"></span>{{commentNum}}
      </button>
    </div>
  </div>
  <issue-comment :is-collapse="isCollapse" :moment-info="item"></issue-comment>
</div>
</template>
<script>
import {thumb} from '../../api/MomentApi'
import IssueComment from './IssueComment.vue'
import defaultImg from '../../assets/images/default.jpg';
import {getNaturalSize} from '../../util/ImageUtil'

export default {
  name:'issue-item',
  data(){
    return {
      imgUrls: [],
      isCollapse: false
    }
  },
  props: {
    item:{
      type: Object,
      default: {}
    },
    visitedUserInfo:{
      type: Object,
      default: {}
    }
  },
  computed:{  
    isIssuePage(){
      let path = this.$route.fullPath;

      return /issue\/\d{1,}/.test(path)
    },
    userInfo(){
      return this.$store.getters.userInfo
    },
    favourIcon(){
      let icon = this.item.isThumb ? 'icon-heart-active' : 'icon-heart';
        return icon;
    },
    // formatedContent(){
    //   return this.item.content.substring(0, 60)
    // },
    formatedPictureList(){
      let pictureList = this.item.pictureList;
      if (pictureList.length <= 2) return pictureList;
      return this.item.pictureList.slice(0,2)
    },
    avatarUrl() {
      let url = this.visitedUserInfo.profilePictureUrl;
      let newUrl = this.item.profilePictureUrl;

      if (this.isIssuePage) return url;
      else return newUrl;
    },
    nickname(){
      let name = this.visitedUserInfo.nickname;
      let newName = this.item.nickname;
      if (this.isIssuePage) return name;
      else return newName;
    },
    commentNum(){
      let item = this.item;
      let text = '';
      if (this.isCollapse) text = '收起评论'
      else text = `${item.commentNum}条评论`

      return text;
    }
  },
  mounted(){

  },
  methods: {
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
        item.html = `<img src=${rawItem} 
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
    handleCollapseBtn(){

    },
    favourHandler(){
      let form = {
        userId: this.userInfo.user_id,
        status: this.item.isThumb ? 0 : 1,
        thumbUsersList: this.item.thumbUsersList
      }
      thumb(form).then((data) => {
        if (data.status == 1){
          let old = this.item.isThumb;
          let num = this.item.thumbNum;
          num = old ? num - 1: num + 1;
          this.item.thumbNum = num;
          this.item.isThumb = !this.item.isThumb;
        } else {
          this.$message.error('点赞失败，请重试')
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  components: {
    [IssueComment.name]: IssueComment
  }
}
</script>
<style lang="scss">
$color-gray: RGBA(102, 102, 102, 1);
$color-blank: RGBA(0, 0, 0, 1);

.issue-item{
  background-color: #fff;
  border-bottom: 2px solid RGBA(246, 246, 246, 1);
  padding: 10px 24px;
}

.issue-content{

  .issue-user-info{
    color: $color-gray;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 10px;

    .avatar{
      display: inline-block;
      margin-right: 8px;
    }

    .avatar img{
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }

    .nickname{
      font-size: 16px;
      color: #000000;
      padding-bottom: 5px;
    }
  }

  .issue-imgs{
    margin-bottom: 20px;

    .issue-img{
      width: 220px;
      height: 220px;
      margin-right: 10px;

      &:last-child{
        margin-right: 0;
      }
    }
  }

  .issue-desc{
    width: 100%;
    margin-bottom:25px;

    p{
      font-size: 14px;
      color: #000;
      letter-spacing: 1px;
      line-height: 20px;
    }
  }
}

.issue-action{
  font-size: 14px;

  .fav,.comment{
    display: inline-block;
    width: auto;
  }

  .iconfont{
    padding-right: 5px;
  }

  .favour{
    cursor: pointer;
    margin-right: 5px;
  }
  
  .icon-heart{
    color: #000000;

    &-active{
      color: red;
    }
  }

  .comment{
  }
}

</style>


