<template>
  <div class="home">
    <my-head></my-head>
  </div>
</template>
<script>
  import Head from "../component/head/Head.vue";

  export default {
    name: 'index',
    components: {
      [Head.name]: Head
    }
  }
</script>
<style lang="scss">
.home{
  background-color: #EAEDEA;
}
</style>

