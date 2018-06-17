<template>
  <div class="friend">
    <div class="friend-container">
      <div class="friend-item" v-for="n in 2" :key="n">
        <div class="userinfo">
          <span class="avatar">
            <img src="https://cn.vuejs.org/images/logo.png" alt="">
          </span>
          <span>
            <p class="txt nickname">用户名</p>
            <p class="txt signature">毎日楽しく前向きに平和に...毎日楽しく前向きに平和に...。</p>
          </span>
        </div>
        <div class="action">
          <button class="btn btn-primary agree">发送私信</button>
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
$color-base:RGBA(33, 178, 146, 1);
.friend{
  background-color: #fff;
  border-radius: 5px;
  min-height: 440px;

  &-contaienr{

  }
}
.friend-item{
  display: flex;
  border-bottom: 1px solid RGBA(234, 237, 234, 1);
  height: 55px;
  padding-top: 24px;
  padding-bottom: 28px;
  position: relative;
  justify-content: space-between;

  .userinfo{
    display: flex;
    align-items: center;
    margin-left: 22px;
    height: 100%;

    .avatar{
      display: inline-block;
      margin-right: 20px;
    }

    .avatar img{
      // box-shadow: 0 0 3px RGBA(153, 153, 153, 1);
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }

    .txt{
      color: RGBA(153, 153, 153, 1);
      font-size: 14px;
      font-weight: 500;
      width: 200px;
    }

    .nickname{
      color: RGBA(102, 102, 102, 1);
      font-size: 16px;
      margin-bottom: 5px;
    }

    .signature{
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .action {
    position: relative;
    margin-right: 10px;
    line-height: 55px;

    .btn{
      border-radius: 16px;
      width: 92px;
      margin-right: 20px;
    }
    .btn.ignore{
      border:1px solid $color-base;
      color: $color-base;
    }
  }
}
</style>


