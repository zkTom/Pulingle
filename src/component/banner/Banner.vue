<template>
  <div class="pul-banner" :style="bannerStyle"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
  >
    <div class="pul-banner__container">
      <div class="pul-banner__wrapper" ref="bannerWrapper"
      :class="{' is-animating': animating}"
      :style="{
        msTransform: `translateX(${ translateX }px)`,
        webkitTransform: `translateX(${ translateX }px)`,
        transform: `translateX(${ translateX }px)`
      }"
      >
      <slot></slot>
      </div>
      <!--按钮-->
      <button class="pul-banner__btn--prev" v-show="hover"
        @click.stop="handleBtnPrevClick(activeIndex - 1)">
        <i class="iconfont icon-chevron-left"></i>
      </button>
      <button class="pul-banner__btn--next" v-show="hover"
        @click.stop="handleBtnNextClick(activeIndex + 1)">
        <i class="iconfont icon-chevron-right"></i>
      </button>
      <!--indicator-->
      <ul class="pul-banner__indicators">
        <li v-for="index in indicatorLen" :key="index"  
          @click.stop="handleIndicatorClick(index)"
          class="pul-banner__indicator"
        :class="{'active':index === activeIndex}"></li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pul-banner',
  data(){
    return {
      items: [],
      activeIndex: 1,
      translateX: 0,
      animating: true,
      timer: null,
      hover: false
    }
  },
  props:{
    bannerStyle: {
      type: String
    },
    interval: {
      type: Number,
      default: 1000
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    indicatorLen(){
      let arr = [];
      let len = this.items.length;
      if (len < 1) arr = [1];
      else {
        for (let i = 1; i < len - 1; i++)
          arr.push(i);
      } 
      return arr;
    }
  },
  methods: {
    handleMouseEnter() {
      this.hover = true;
      this.pauseTimer();
    },

    handleMouseLeave() {
      this.hover = false;
      this.startTimer();
    },
    startTimer() {
      if (this.interval <= 0 || !this.autoplay) return;
      this.timer = setInterval(this.playSlides, this.interval);
    },
    pauseTimer() {
      clearInterval(this.timer);
    },
    playSlides() {
      let index = 1;
      if (this.activeIndex < this.items.length - 1) {
        index = this.activeIndex + 1;
      } else {
        index = 1;
      }
      this.setActiveItem(index);
    },
    setActiveItem(index) {
      index = Number(index);
      let length = this.items.length;
      this.translateWrapper(index);
    },
    updateItems() {
      this.items = this.$children.filter(child => child.$options.name === 'pul-banner-item');
    },
    resetItemPosition() {
      this.items.forEach((item, index) => {
        item.translateItem(index, this.activeIndex);
      });
    },
    translateWrapper(index) {
      const offsetWidth = this.$el.offsetWidth;
      let length = this.items.length;
      let dom = this.$refs.bannerWrapper; 

      this.translateX = - offsetWidth * (index - 1);

      clearInterval(dom.timer);
      if (index < 1) {
          this.activeIndex = length - 2;
          dom.timer = setInterval(() => {
            this.animating = false;
            this.translateWrapper(this.activeIndex);
            setInterval(() => {
              this.animating = true;
            },20)
          },400);
      } else if(index >= length - 1) {
          this.activeIndex = 1;
          dom.timer = setInterval(() => {
            this.animating = false;
            this.translateWrapper(this.activeIndex);
            setInterval(() => {
              this.animating = true;
            },20)
          }, 400)
      } else {
         this.activeIndex = index;
      }
    },
    handleIndicatorClick(index) { 
      this.setActiveItem(index);
    },
    handleBtnNextClick(index){
      this.setActiveItem(index);
    },
    handleBtnPrevClick(index){
      this.setActiveItem(index);
    }
  },
  mounted(){
    this.updateItems();
    this.resetItemPosition();

    this.ready = true;
  },
  components:{

  },

}
</script>
<style lang="scss">
.pul-banner__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.pul-banner{
  overflow: hidden;
  position: relative;
}
.pul-banner__container{
  height: 100%;
  position: relative;

  .pul-banner__wrapper{
    width: 100%;
    height: 100%;
    position: relative; 
  }

  .is-animating{
    transition: transform .4s ease-in-out;
  }

  button{
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    height: 36px;
    width: 36px;
    cursor: pointer;
    transition: .3s;
    border-radius: 50%;
    background-color: rgba(31,45,61,.11);
    color: #fff;
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    text-align: center;
    font-size: 12px;
  }

  .pul-banner__btn--prev{
    left: 16px;
  }

  .pul-banner__btn--next{
    right: 16px;
  }

  .pul-banner__indicators{
    position: absolute;
    list-style: none;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    z-index: 2;

    .pul-banner__indicator{
      background-color: rgba(31,45,61,.5);
      border-radius: 50%;
      cursor: pointer;
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 7px;

    }

    .active{
    background-color: rgba(31,45,61,1);
    }
  }
}

</style>


