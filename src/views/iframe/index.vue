<template>
  <div class="das-upgrade">
    <iframe :src="inline" class="iframe"></iframe>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';

  const inline = ref('http://10.50.28.10:8599/das-upgrade/#/upgrade?activeName=offline');

  const route = useRoute();

  watchEffect(() => {
    const currentUrl = route.fullPath;
    if (currentUrl === '/dasUpgrade') {
      inline.value = 'http://10.50.28.10:8599/das-upgrade/#/upgrade?activeName=offline';
    } else if (currentUrl === '/dasvScreen') {
      inline.value = 'https://10.20.178.18/login';
    }
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
