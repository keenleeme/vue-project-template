import { ref } from 'vue';
import { defineStore } from 'pinia';

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
      url: '/subapp/vue2/', // 如果是同源的 子应用需要有一个公共的文件夹在服务器上；
      custom: true,
      baseroute: '/vue2'
    },
    {
      name: 'vue3',
      url: '/subapp/vue3/',
      baseroute: '/vue3',
      routerMode: 'history'
    },
    {
      name: 'react',
      url: '/subapp/react/',
      baseroute: '/react',
      routerMode: 'history'
    },
    {
      name: 'angular',
      url: '/subapp/angular/',
      baseroute: '/angular'
    }
  ]);
  return {
    apps
  };
});
