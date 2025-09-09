<template>
  <div class="das-upgrade">
    <iframe :src="inline" class="iframe"></iframe>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useThemeStore, useUserStore } from '@/store';

  const route = useRoute();
  const themeStore = useThemeStore();
  const themeTokenType = computed(() => themeStore.themeTokenType);
  const userStore = useUserStore();

  // 将 urlMappings 改为计算属性，确保它能够响应 themeTokenType 的变化
  const urlMappings = computed(() => {
    const theme = themeTokenType.value === 'dark' ? 'dark' : 'default';
    const { token } = userStore;
    return {
      '/dasUpgrade': `http://10.50.28.10:8199/das-upgrade/#/upgrade?activeName=online&lang=zh-CN&theme=${theme}`,

      '/das-readdy': `https://10.20.114.19:8888?readdyAuthToken=${token}`
    };
  });

  // 使用计算属性动态生成 iframe 的 src
  const inline = computed(() => {
    return urlMappings.value[route.fullPath] || urlMappings.value['/dasUpgrade'];
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
      height: calc(100vh - 150px);
      border: none;
    }
  }
</style>
