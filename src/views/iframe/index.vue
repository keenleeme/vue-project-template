<template>
  <div class="das-upgrade">
    <iframe :src="inline" class="iframe"></iframe>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';

  const inline = ref('http://10.50.28.10:8599/das-upgrade/#/upgrade?activeName=offline');

  const route = useRoute();
  const currentUrl = computed(() => route.fullPath);

  const updateInline = (url: string) => {
    inline.value = url;
  };

  if (currentUrl.value === '/dasUpgrade') {
    updateInline('http://10.50.28.10:8599/das-upgrade/#/upgrade?activeName=offline');
  } else if (currentUrl.value === '/dasvScreen') {
    updateInline('https://10.20.178.18/login');
  }
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
