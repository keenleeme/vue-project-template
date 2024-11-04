<template>
  <a-button v-if="appInfo.name ==='vue2'" @click="sendData">动态发送基座数据</a-button>
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
  <div v-if="showSpin" pos-absolute inset-0 f-c-c z-1 style="background-color: rgba(55, 55, 55, 0.6)">
    <a-spin class="" tip="资源加载中..."> </a-spin>
  </div>
</template>

<script setup lang="ts">
  import 'zone.js'
  import { computed } from 'vue';
  import microApp from '@/micro/microApi'
  import { SubApp } from './store';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  type PushStateFunction = (path: string) => void;

  const globaldata = ref<{
    language: 'zh' | 'en';
    token:string;
    pushState: PushStateFunction // 子应用跳转基座或者其他子应用使用  也可以使用数据通信，没有唯一，参考https://micro-zoe.github.io/micro-app/0.x/docs.html#/zh-cn/data
  }>({
    language:'zh',
    token:'11111',
    pushState: (path:string) => {
      router.push(path)
    }
  })

  const props = withDefaults(
    defineProps<{
      appInfo: SubApp;
    }>(),
    {}
  );


  const url = computed(() => {
    if (props.appInfo.url.startsWith('http')) return props.appInfo.url;
    if (props.appInfo.url.startsWith('//')) {
      return window.location.protocol + props.appInfo.url;
    }
    return `${window.location.protocol}//${window.location.host}${props.appInfo.url}`;
  });


  const showSpin = ref(false)
  function appCreated() {
    showSpin.value = true;
  }
  function appMounted() {
    showSpin.value = false;
  }
 // 更多请参考https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/data
  function sendData() {
    // 发送给特定子应用的数据
    microApp.setData('vue2', { uuid: Math.random()})
  }
</script>
