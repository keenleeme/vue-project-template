import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getRegistryUrl } from './microApi/helper';

export interface SubApp {
  name: string;
  url: string;
  baseroute: string;
  custom?: boolean;
  routerMode?: 'hash' | 'history';
}

export const useMicroStore = defineStore('micro', () => {
  const apps = ref<SubApp[]>([
    {
      name: 'vue2',
      url: getRegistryUrl('vue2', '7001'), //'/subapp/vue2/', // 如果是同源的 子应用需要有一个公共的文件夹在服务器上；
      custom: true,
      baseroute: '/vue2'
    },
    {
      name: 'vue3',
      url: getRegistryUrl('vue3', '7002'),
      baseroute: '/vue3',
      routerMode: 'history'
    },
    {
      name: 'react',
      url: getRegistryUrl('react', '7003'),
      baseroute: '/react',
      routerMode: 'history'
    },
    {
      name: 'angular',
      url: getRegistryUrl('angular', '7004'),
      baseroute: '/angular'
    }
  ]);
  return {
    apps
  };
});
