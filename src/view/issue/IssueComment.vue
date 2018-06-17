<template>
  <div class="comment-container" v-show="isCollapse">
    <div class="comment-hd">
      <p class="comment-hd-title">{{momentInfo.commentNum}}条评论</p>
    </div>
    <div class="comment-bd">
      <template v-if="!loading">
        <template v-if="page.resultList.length">
          <ul class="comment-list">
            <li class="comment-item" v-for="(comment, index) in page.resultList" :key="index">
              <div class="comment-item-hd">
                <div class="user-info">
                  <span class="avatar">
                    <img :src="comment.profilePictureUrl | defaultAvatar" alt="">
                  </span>
                  <span>
                    <p class="nickname">{{comment.nickname}}</p>
                    <p class="send-time">{{comment.createTime}}</p>
                  </span>
                </div>
              </div>
              <div class="comment-item-bd">
                <p class="comment-content">
                  {{comment.content}}
                </p>
              </div>
            </li>
          </ul>
          <div class="pagination-wrapper" v-if="page.pageNum > 1">
            <pagination :page-index="page.currentPage" :total="momentInfo.commentNum" 
              :page-size="page.pageSize" @indexChange="loadmore"></pagination>
          </div>
        </template>
        <p class="no-data" v-else>暂时没有评论数据！</p>
      </template>
      <div id="comment-list-loading" style="height:100px;width:100%;" v-else>
        <span class="iconfont icon-loading"></span>
        <span>加载中...</span>
      </div>
    </div>
    <div class="send-comment">
      <div class="form-group" :class="{'form-group--active': show}" ref="form-group">
        <input type="text" class="form-control" placeholder="评论..." maxlength="255"
        v-model="content" @focus="show = true" 
        @blur="show = false" @keydown.enter="comment">
      </div>
      <transition name="zoomIn">
        <div class="send-btn-wrap" v-show="show">
          <button class="btn btn-primary" @click="comment">发表</button>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import {remark, queryCommentByCIL, queryMomentByUserId} from '../../api/MomentApi'
import Page from '../../model/Pagination'
import Pagination from '../../component/common/Pagination.vue'
export default {
  name: 'issue-comment',
  data(){
    return {
      show: false,
      content: '',
      loading: false,
      page: new Page()
    }
  },
  computed: {
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  mounted(){
    // this.inputDom = document.getElementById('form-group');
  },
  props: {
    isCollapse: Boolean,
    momentInfo: Object
  },
  watch: {
    'isCollapse'(val) {
      if (val) {
        this.page = new Page();
        this.getCommentList();
      }
    }
  },
  methods: {
    hide(){
      this.$emit('update:isCollapse', false)
    },
    async loadmore(index){
      let page = this.page;
      let params = {
        currentPage: index,
        pageSize: page.pageSize,
        commentList: this.momentInfo.commentList
      }
      this.loading = true;
      try {
        let res = await queryCommentByCIL(params);
        if (res.status == 1) {
          let resultList = res.data.commentList;
          let newPage = Page.as(res.data)
          newPage.resultList = resultList;
          page.merge(newPage)
          page.resultList =resultList;
        } else {
          this.$message.error('加载分页信息失败')
        }
      } catch (error) {
        console.log(error)
      } finally{
        this.loading = false;
      }
    },
    async getCommentList(){
      let page = this.page;
      let params = {
        currentPage: page.currentPage,
        pageSize: page.pageSize,
        commentList: this.momentInfo.commentList
      }
      this.loading = true;
      try {
        let res = await queryCommentByCIL(params)
        if (res.status == 1){
          let resultList = res.data.commentList;
          let newPage = Page.as(res.data)
          newPage.resultList = resultList;
          page.merge(newPage)
        } else {
          this.$message.error('获取评论信息失败')
        } 
      } catch (error) {
        console.log(error)
      } finally{
        this.loading = false;
      }
    },
    async comment(){
      let userId = this.userInfo.user_id;
      let momentId =this.momentInfo.momentId;
      let params = {
        userId: userId,
        momentId: momentId,
        content: this.content
      }

      let res = await remark(params)
      if (res.status == 1) {
        this.content = '';
        if (this.show) this.show = false;
        this.$message.success('评论成功')
      } else {
        this.$message.error('发送评论失败，请重试')
      }
    }
  },
  components: {
    [Pagination.name]: Pagination
  }
}
</script>
<style lang="scss">
#comment-list-loading{
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;

  .icon-loading{
    display: inline-block;
    animation: loading-rotate 1s linear infinite;
  }
}
.comment-container{
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(26,26,26,.1);
  height: auto;
  width: 100%;
  margin: 12px 0;

  .comment-hd{
    border-bottom: 1px solid #f6f6f6;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;

    &-title{
      display: inline-block;
      font-size: 15px;
      font-weight: 600;
      font-synthesis: style;
      color: #1a1a1a;
    }
  }

  .comment-bd{
    padding: 12px 20px 10px;

    .pagination-wrapper{
      padding: 10px 0px;
      display: flex;
      justify-content: center;
    }
  }

  .comment-list{
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .comment-item{
    border-bottom: 1px solid #f6f6f6;
    display: block;
    padding-bottom: 5px;
    margin-bottom: 10px;

    &-hd{
      position: relative;
      padding-right: 3px;
      padding-left: 1px;
      margin-bottom: 5px;
    }

    .user-info{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
      color: #8590a6;

      .nickname{
        color: #1a1a1a;
      }

      .avatar{
        width: 30px;
        height: 30px;
        margin-right: 5px;
      }
      .avatar img{
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }

    &-bd{
      margin-bottom: 6px;

      .comment-content{
        color: #1a1a1a;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 1px;
      }
    }
  }

  .send-comment{
    display: flex;
    align-items: center;
    height: 35px;
    margin: 0 10px;
    margin-bottom: 20px;
    position: relative;

    .form-group{
      background-color: #ebebeb;
      border: 1px solid #ebebeb;
      flex: 1;
      margin: 0;
      margin-right: 0;
      transition: margin-right .4s  ease,background-color .2s, border .2s;

      .form-control{
        height: 30px;
        line-height: 30px;
      }

      &--active{    
        margin-right: 90px;
        background-color: #fff;
      }
    }

    .send-btn-wrap{
      position: absolute;
      right: 12px;
      top: 2px;
      width: 60px;
    }
  }
}
</style>


