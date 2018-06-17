<template>
  <div class="pul-loadmore">
    <slot></slot>
    <div class="pul-loadmore--footer">
      <button class="btn btn-primary"  v-show="hasNextPage"
        @click="handleClick"
      :disabled="loading">
      <span class="iconfont" :class="{'icon-loading': loading}"></span>{{btnText}}</button>
      <div class="pul-divider" v-show="!hasNextPage">
        <span>已经到底了哦</span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'pul-loadmore',
  data(){
    let data = {};
    data.loading = false;

    return data;
  },
  props:{
    pageNum: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 1 
    },
    bottomMethod: Function
  },
  computed: {
    btnText(){
      let text = this.loading ? '加载中...' : '加载下一页';

      return text;
    },
    hasNextPage(){
      return this.currentPage < this.pageNum;
    }
  },
  methods: {
    //检查是否还有更多数据
    doCheck(){
      let scrollTop = this.getScrollTop();
      let offsetHeight = this.getVisibleHeight();
      let scrollHeight = this.getScrollHeight();
      var scrollBottom = 260;//你可以自己定义距离底部的距离
      let downTrigger = scrollTop + offsetHeight >= scrollHeight - scrollBottom;
      if (downTrigger && this.hasNextPage) {
        console.log("$loadmore")
        this.bottomMethod();
      }
    },
    getScrollTop(event, el) {
      var scrollTop = el ? el.scrollTop : (document.documentElement.scrollTop || document.body.scrollTop);
      return scrollTop;
    },
    //获取可视区高度
    getVisibleHeight(event, el){
      let height = el ? el.offsetHeight : window.innerHeight;
      return height;
    },
    //获取滚动条高度信息
    getScrollHeight(event, el) {
      let height = el ? el.scrollHeight : (document.documentElement.scrollHeight || document.body.scrollHeight);
      return height;
    },
    /**
     * 防抖动函数
     * 作用:在一定时间(wait)内某个事件(scroll,resize)没有被连续出发两次及以上，那么才会出发func
     * @param func 某个要执行防抖动的函数
     * @param func 延迟时间
     * */
    debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    handleClick(){
      this.bottomMethod();
      //this.$emit("loadmore")
    },

    bottomLoaded(){
      this.loading = false 
    }
  },
  mounted(){
    window.addEventListener('scroll', this.debounce(this.doCheck, 300));
  }
}
</script>
<style lang="scss">
.pul-loadmore{
  position: relative;

  .pul-loadmore--footer{
    margin: 10px 0;

    .btn{
      display: block;
      width: 100%;
    }

    .icon-loading{
      margin-right: 5px;
      display: inline-block;
      animation: loading-rotate 1s linear infinite;
    }
  }
}
.pul-divider{
  display: table;
  white-space: nowrap;
  height: auto;
  overflow: hidden;
  line-height: 1;
  text-align: center;
  padding: 10px 15px;
  color: #666;
  font-size: 14px;

  span{
    padding: 0px 0.5em;
  }
}
.pul-divider:after,.pul-divider:before {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 50%;
  background-repeat: no-repeat;
  background-size: 120% 1px;
}
.pul-divider:before {
  background-image:-webkit-linear-gradient(-90deg,#d9d9d9,#f0f0f0 45%,#fafafa 75%,#fafafa);
  background-image:linear-gradient(to left,#d9d9d9,#f0f0f0 45%,#fafafa 75%,#fafafa);
  background-position: center right;
}
.pul-divider:after {
  background-image:-webkit-linear-gradient(90deg,#d9d9d9,#f0f0f0 45%,#fafafa 75%,#fafafa);
  background-image:linear-gradient(to right,#d9d9d9,#f0f0f0 45%,#fafafa 75%,#fafafa);
  background-position: center left;
}
</style>

