<template>
  <div class="pul-badge">
    <slot></slot>
    <transition name="zoomIn">
      <sup
        v-show="!hidden && (content || content === 0 || isDot)"
        v-text="content"
        class="pul-badge__content"
        :class="{ 'is-fixed': $slots.default, 'is-dot': isDot }">
      </sup>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'pul-badge',

  props: {
    value: {},
    max: Number,
    isDot: Boolean,
    hidden: Boolean
  },

  computed: {
    content() {
      if (this.isDot) return;

      const value = this.value;
      const max = this.max;

      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value;
      }

      return value;
    }
  }
};
</script>

<style lang="scss">
.pul-badge{
    position: relative;
    vertical-align: middle;
    display: inline-block;
}
.pul-badge__content {
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;

  &.is-fixed{
    position: absolute;
    top: 0;
    right: 10px;
    transform: translateY(-50%) translateX(100%);
  }
}
</style>


