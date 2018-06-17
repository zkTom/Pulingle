<template>
  <transition name="zoomIn">
    <div class="pul-dialog__wrapper mask-wrapper" v-show="visible" 
      @click.self="handleWrapperClick">
      <div class="pul-dialog__container mask" :style="style"
          :class="[{'pul-dialog--center': center }, customClass]">
        <div class="pul-dialog__header">
          <slot name="title" v-if="title">
            <span class="pul-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="pul-dialog__headerbtn"
            @click="handleClose">
            <i class="pul-dialog__close iconfont icon-close"></i>
          </button>
        </div>
        <div class="pul-dialog__body"><slot></slot></div>
        <div class="pul-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'pul-dialog',
  data(){
    return{
      closed: false
    }
  },
  props:{
    visible:{
      type: Boolean,
      default: false
    },
    top: {
      type:String,
      default: '95px'
    },
    width: {
      type: String,
      default: '50%'
    },
    lockScroll:{
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '请输入标题'
    },
    customClass: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    style() {
      let style = {};
      if (this.width) {
        style.width = this.width;
      }
      if (this.top) {
        style.marginTop = this.top;
      }
      return style;
    }
  },
  methods:{
    hide(){
      this.$emit('update:visible', false);
      this.closed = true;
    },
    handleClose(){
      this.hide();
      this.$emit('close');
    },
    handleWrapperClick(){
      this.hide();
    },
    lock(flag){
      let app = document.getElementById("app");  
      let body = document.body;
      if (!flag) {
        if (this.appendToBody) body.style = 'overflow:auto';
        else app.style = 'overflow:auto';
        return;
      }
      if (this.lockScroll) {
        if (this.appendToBody) body.style = 'overflow-y:hidden';
        else app.style = 'overflow-y:hidden';
      } 
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        if (this.appendToBody) {
          document.body.appendChild(this.$el);  
        }
      } else {
        if (!this.closed) this.$emit('close');
      }
      this.lock(val);
    }
  },
  mounted(){
    
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>
<style lang="scss">
.pul-dialog__container{
  border-radius: 10px;
  width: 50%;

  .pul-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
  }
  .pul-dialog__title {
    line-height: 24px;
    font-size: 18px;
    font-weight: bold;
    color: #303133;
  }
  .pul-dialog__headerbtn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-weight: bold;
    outline: none;
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 0;
    font-size: 16px;
  }

  .pul-dialog__body {
    color: #606266;
    line-height: 24px;
    font-size: 14px;
    text-align: initial;
    padding: 20px;
  }
  .pul-dialog__footer{
    text-align: inherit;
  }
}

.pul-dialog--center{
  text-align: center;
}

.pul-dialog__footer{
  padding: 20px;
  padding-top: 10px;
  text-align: right;
  box-sizing: border-box;
}
</style>


