<template>
  <div class="app" id="app">
    <router-view></router-view>
  </div>
</template>
<script>
    export default {
      name: "app-view",
      data() {
        let data = {};

        return data;
      },
      mounted() {
      }
    }
</script>
<style lang='scss'>
body{
  font-size: 14px;
  line-height: 1.2;
  font-family: Microsoft YaHei;
  background: #fff;
}
</style>
