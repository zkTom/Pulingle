<template>
    <li class="pul-select-dropdown__item"
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled,
      'hover': hover
    }">
    <slot>
      <!-- <span>{{ currentLabel }}</span> -->
    </slot>
  </li>
</template>
<script>
export default {
  name: 'pul-option',
  data() {
    return {
      visible: true,
      disabled: false,
      itemSelected: false,
      hover: false
    }
  },
  methods: {
    hoverItem(){

    },
    selectOptionClick(){
      if (this.disabled !== true) {
        this.$emit('selectOption');
      }
    }
  }
}
</script>
<style lang="scss">
.pul-select-dropdown__item {
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
    text-align: left;
    
    &.hover, &:hover {
      background-color: #f5f7fa;
    }

    &.selected{
      color: #409eff;
      font-weight: 700;
    }

    .is-disabled{
      cursor: not-allowed;
    }
}
</style>


