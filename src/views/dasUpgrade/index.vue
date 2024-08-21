<template>
  <div class="das-upgrade">
    <iframe src="http://10.50.28.10:8599/das-upgrade/#/upgrade?activeName=offline" class="iframe"></iframe>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'App'
  });
</script>

<style scoped lang="less">
  .das-upgrade {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .iframe {
      display: block;
      width: 100%;
      height: calc(100vh - 50px);
      border: none;
    }
  }
</style>
