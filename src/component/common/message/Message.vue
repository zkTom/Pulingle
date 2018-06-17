<template>
  <transition name="message-fadeInDown">
    <div v-show="visible" 
      :class="['pul-message', type ? `pul-message--${ type }` : '',showClose ? 'is-closable' : '']"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="pul-message__content">{{ message }}</p>
        <p v-else v-html="message" class="pul-message__content"></p>
      </slot>
      <i v-if="showClose" class="pul-message__closeBtn iconfont icon-close" @click="close"></i>
    </div> 
  </transition>
</template>
<script>
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};
export default {
  name:'pul-message',
  data() {
    return {
      visible: false,
      message: '',
      duration: 3000,
      type: 'error',
      showClose: true,
      onClose: null,
      dangerouslyUseHTMLString: false,
      timer: null,
      closed: false
    }
  },
  computed: {
    typeClass() {
      // 扩展message的图标
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        this.$el.addEventListener('transitionend', this.destroyElement);
      }
    }
  },  
  methods: {
    destroyElement() {
      this.$el.removeEventListener('transitionend', this.destroyElement);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },

    clearTimer() {
      clearTimeout(this.timer);
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) this.close();
        }, this.duration);
      }
    }
  },
  mounted() {
  this.startTimer();
  },
}
</script>
<style lang="scss">
.pul-message{
  min-width: 380px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  background-color: #edf2fc;
  transition: opacity .3s,transform .4s;
  overflow: hidden;
  padding: 15px 15px 15px 20px;
  display: flex;
  align-items: center;
}
.pul-message--info {
  .pul-message__content{
    color: #909399;
  }  
}
.pul-message--success {
  background-color: #f0f9eb;
  border-color: #e1f3d8;

  .pul-message__content{
    color: #67c23a;;
  }
}
.pul-message--warning {
  background-color: #fdf6ec;
  border-color: #faecd8;

  .pul-message__content{
    color: #e6a23c;
  }
}
.pul-message--error {
  background-color: #fef0f0;
  border-color: #fde2e2;

  .pul-message__content{
    color: #f56c6c;
  }
}
.pul-message__content {
  padding: 0;
  margin: 0;
  font-size: 14px;
  line-height: 1;
}
.pul-message__closeBtn {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #c0c4cc;
  font-size: 12px;
}
.pul-message.is-closable .pul-message__content {
    padding-right: 16px;
}
.message-fadeInDown-enter-active{
  animation: message-fadeInDown .4s;
}
.message-fadeInDown-leave-active{
  animation: message-fadeInDown .4s reverse;
}
@keyframes message-fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(-50%, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
}
</style>


