<template>
  <div class="private-message">
    <div class="private-message-container">
      <div class="private-message-item" v-for="n in 4" :key="n">
        <div class="avatar">
          <img src="https://cn.vuejs.org/images/logo.png" alt="">
        </div>
        <div class="comment-info">
          <p>
            <span class="nickname">用户名</span>
            <span class="comment-time">04/09 14:28</span>
          </p>
          <p class="comment-content">
            TUF堆料大板+八代酷睿原生可超频i7，适合游戏玩家。i7-8700K隶属于intel第八代酷睿家族，使用intel半导体14nm工艺，
            相比第七代同类产品有不小.TUF堆料大板+八代酷睿原生可超频i7，适合游戏玩家。i7-8700K隶属于intel第八代酷睿家族，
            使用intel半导体14nm工艺，相比第七代同类产品有不小.TUF堆料大板+八代酷睿原生可超频i7，适合游戏玩家。
            i7-8700K隶属于intel第八代酷睿家族，使用intel半导体14nm工艺，相比第七代同类产品有不小.
            TUF堆料大板+八代酷睿原生可超频i7，适合游戏玩家。i7-8700K隶属于intel第八代酷睿家族，使用intel半导体14nm工艺，
            相比第七代同类产品有不小.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: ''
}
</script>
<style lang="scss">
.private-message{
  background-color: #fff;
  border-radius: 5px;
  min-height: 440px;

  &-container{

  }
}
.private-message-item{
  border-bottom: 1px solid RGBA(234, 237, 234, 1);
  display: flex;
  padding-top: 24px;
  padding-bottom: 28px; 

  .avatar{
    padding-left: 21px;
    padding-right: 23px;

    img{
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }
  }

  .comment-info{
    font-size: 14px;
    width: 550px;

    >p:first-child{
      margin-bottom: 15px;
    }
    .nickname{
      color: RGBA(153, 153, 153, 1);
      display: inline-block;
      font-size: 16px;
      font-weight: 500;
      padding-right: 5px;
    }

    .comment-time{
      color: RGBA(204, 204, 204, 1);
      font-weight: 500;
    }

    .comment-content{
      color: RGBA(102, 102, 102, 1);
      line-height: 18px;
    }
  }
}
</style>


