<template>
  <div class="pul-banner__item"
     :style="{
    msTransform: `translateX(${ translateX }px)`,
    webkitTransform: `translateX(${ translateX }px)`,
    transform: `translateX(${ translateX }px)`
  }">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'pul-banner-item',
  data(){
    let data = {};
   
    data.translateX = 0;
    data.scale = 1;
    data.animating = false;
    data.ready = false;
   
   return data;
  },
  methods: {
    processIndex(index, activeIndex, length){
      
    },
    translateItem(index, activeIndex){
      const parentWidth = this.$parent.$el.offsetWidth;
      const length = this.$parent.items.length;

      this.translateX = parentWidth * (index - activeIndex);
    }
  },
}
</script>
<style lang="scss">
.pul-banner__item{
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  &-img{
    width: 100%;
    height: 100%;
    border: 0;
    margin: 0;
    padding: 0;
  }
}
</style>


