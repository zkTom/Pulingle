<template>
    <div class="pul-select-dropdown pul-popper"
    :class="popperClass">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'pul-select-dropdown',
  data(){
    return {

    }
  },
  props: {
    popperClass: String
  }
}
</script>
<style lang="scss">
.pul-select-dropdown{
  position: absolute;
  z-index: 1001;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-sizing: border-box;
  margin: 5px 0;

  &.pul-popper{
    margin-top: 0;
  }
}
</style>

