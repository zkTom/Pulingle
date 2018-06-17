<template>
  <div class="pul-loading-wrapper" v-if="visible">
    <div class="pul-loading">
        <div class="pul-loading-x">
            <div class="pul-loading-y"></div>
        </div>
    </div>
    <p class="pul-loading-text">{{ text }}</p>
  </div>
</template>
<script>
import { addClass,removeClass } from '../../../util/DomUtil'
export default {
  name:'pul-loading',
  data(){
    return {
      text: '数据加载中...',
      fullscreen: true,
      visible: false,
      target: document.body
    }
  },
  methods: {
    setText(text) {
      this.text = text;
    },
    destroyElement(){
      this.$el.removeEventListener('animationend', this.destroyElement);
      if (this.fullscreen) {
        fullscreenLoading = undefined;
      }
      let parent = this.fullscreen ? document.body : this.target;
      removeClass(target, 'el-loading-parent--hidden');
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  watch:{
    visible(val){
      if (!val) {
        this.$el.addEventListener('animationend', this.destroyElement);
      }
    }
  }
}
</script>
<style lang="scss">
.pul-loading-wrapper{
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  z-index: 100;
  margin: 0;

  .pul-loading{
    width: 25px;
    height: 25px;
    position: relative;
    top: 50%;
    left:50%;
    margin-left: -12.5px;
    display: flex;
    justify-content: center;
    align-items: center;

    &-x{
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 2px solid #2196F3;
      border-top-color: transparent;
      border-bottom-color: transparent;
      animation: aniSix-x 1s ease-in-out .2s infinite;
    }

    &-y{
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: #2196F3;
      -webkit-animation: aniSix-y 1s ease-in-out .2s infinite;
      animation: aniSix-y 1s ease-in-out .2s infinite;
    }

    &-text{
      color: #409eff;
      margin: 3px 0;
      font-size: 14px;
      position: relative;
      top: 50%;
      text-align: center;
    }
  }
}
.pul-loading-parent--hidden{
  overflow: hidden;
}
</style>
    
    
    