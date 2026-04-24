<template>
  <div :class="['micro-content', {'full-screen': isFullScreen}]">
    <a-button v-if="appInfo.name === 'vue2'" @click="sendData">动态发送基座数据</a-button>
    <micro-app
      :name="appInfo.name"
      :url="url"
      :baseroute="props.appInfo.baseroute"
      :data="globaldata"
      disable-memory-router
      iframe
      fiber
      @created="appCreated"
      @beforemount="appCreated"
      @mounted="appMounted"
    ></micro-app>
  </div>
  <div v-if="showSpin" pos-absolute inset-0 f-c-c z-1 style="background-color: rgba(55, 55, 55, 0.6)">
    <a-spin class="" tip="资源加载中..."> </a-spin>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  /** 勿在基座引入 zone.js：会全局打补丁，与 Vue 3 调度/antdv 弹层冲突；子应用（如 Angular）在 iframe 内自带 zone */
  import microApp from '@/micro/microApi';
  import { useThemeStore } from '@/store';
  import { getAppRealUrl } from './microApi/helper';
  import { SubApp } from './store';

  const router = useRouter();
  type PushStateFunction = (path: string) => void;

  const globaldata = ref<{
    language: 'zh' | 'en';
    token: string;
    pushState: PushStateFunction; // 子应用跳转基座或者其他子应用使用  也可以使用数据通信，没有唯一，参考https://micro-zoe.github.io/micro-app/0.x/docs.html#/zh-cn/data
    themeMode: string;
  }>({
    language: 'zh',
    token: '11111',
    themeMode: useThemeStore().themeConfig.mode,
    pushState: (path: string) => {
      router.push(path);
    }
  });

  const props = withDefaults(
    defineProps<{
      appInfo: SubApp;
    }>(),
    {}
  );

  const url = computed(() => {
    return getAppRealUrl(props.appInfo.url);
  });

  const isFullScreen = computed(() => {
    return props.appInfo.meta?.fullScreen === true;
  });

  const showSpin = ref(false);
  function appCreated() {
    showSpin.value = true;
  }
  function appMounted() {
    showSpin.value = false;
  }
  // 更多请参考https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/data
  function sendData() {
    // 发送给特定子应用的数据
    microApp.setData('vue2', { uuid: Math.random() });
  }
</script>
<style lang="less">
  .micro-content {
    padding: 16px;
    height: calc(100vh - 132px);
    overflow: auto;
    
    &.full-screen {
      padding: 0;
      height: 100vh;
    }
  }
</style>
