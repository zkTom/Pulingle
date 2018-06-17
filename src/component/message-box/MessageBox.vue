<template>
  <div class="pul-message-box__wrapper">
    <pul-dialog :title="title" custom-class="dialog-messagebox-class" top="50px" 
     :visible.sync="visible">
      <div>你确定删除该好友吗？</div>
      <div slot="footer" style="text-align:right;">
        <button class="btn btn-primary" @click.stop="confirm">确定</button>
        <button class="btn btn-info" @click.stop="cancel">取消</button>
      </div>
    </pul-dialog>
  </div>
</template>
<script>
import Dialog from '../common/Dialog.vue'
  // let messageBox;
  // let typeMap = {
  //   success: 'success',
  //   info: 'info',
  //   warning: 'warning',
  //   error: 'error'
  // };
export default {
  name: 'pul-message-box',
  data(){
    let data = {};

    data.visible = false;
    data.title = '提醒';

    return data;
  },
  props:{
    // boxVisible:Boolean,
  },
  watch:{

  },
  methods:{
    confirm(){
      this.$emit('confirm')
      this.hide()
    },
    cancel(){
      this.$emit('cancel')
      this.hide()
    },
    show(){
      this.visible = true;
    },
    hide(){
      this.visible = false;
    }
  },
  components:{
    [Dialog.name]: Dialog
  }
};
</script>
<style lang="scss">
.dialog-messsagebox-class{
  max-width: 400px;
}
.pul-message-box__wrapper{

}
</style>


