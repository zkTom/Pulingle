<template>
  <div class="pul-select">
    <!--  :style="{ minWidth: minWidth }"> -->
    <div class="pul-input" :class="customerClass" :style="styleObj">
      <input type="text" class="pul-input__inner" readonly="readonly" value="公开" />
      <span class="iconfont icon-arrow-down-o input__suffix"></span>
    </div>
    <pul-select-dropdown :popper-class="popperClass">
      <slot></slot>
    </pul-select-dropdown>
</div>
</template>
<script>
import Option from './Option.vue'
import SelectDropDown from './Select-DropDown.vue'

export default {
  name: 'pul-select',
  data() {
    return {

    }
  },
  props: {
    width: String,
    popperClass: String,
    customerClass: String
  },
  computed: {
    styleObj(){
      let styleObj = {};
      if (this.width)  styleObj = {width: this.width}
      return styleObj      
    }
  },
  components: {
    [SelectDropDown.name]: SelectDropDown,
    [Option.name]: Option
  }
}
</script>
<style lang="scss">
.pul-select{
  display: inline-block;
  position: relative;

  .pul-input{
    border: none;
    cursor: pointer;
    margin: 0;

    .pul-input__inner {
      cursor: pointer;
      padding: 0;
      text-align: right;
      width: 100%;
    }

    .iconfont{
      font: bold 12px/40px 'Microsoft YaHei';
    }
  }
}
.customerClass{
  
}
</style>



