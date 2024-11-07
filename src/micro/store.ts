import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface SubApp {
  name: string;
  url: string;
  baseroute: string;
  custom?: boolean;
  routerMode?: 'hash' | 'history'
}

export const useMicroStore = defineStore('micro', () => {
  const apps = ref<SubApp[]>([
    {
      name: 'vue2',
      url: '/vue2',
      custom: true,
      baseroute: '/vue2',
    },
    {
      name: 'vue3',
      url: '/vue3/',
      baseroute: '/vue3',
      routerMode:'history'
    },
    {
      name: 'react',
      url: '/react/',
      baseroute: '/react',
      routerMode:'history'
    },
    {
      name: 'angular',
      url: '/angular/',
      baseroute: '/angular'
    }
  ]);
  return {
    apps
  };
});
