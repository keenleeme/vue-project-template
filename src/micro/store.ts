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
      url: 'http://localhost:8080/vue2/',
      baseroute: '/vue2',
    },
    {
      name: 'vue3',
      url: 'http://localhost:8090/vue3/',
      baseroute: '/vue3',
      routerMode:'history'
    },
    {
      name: 'react',
      url: 'http://localhost:3000/react/',
      baseroute: '/react',
      custom: true,
      routerMode:'history'
    },
    {
      name: 'angular',
      url: 'http://localhost:6002/angular/',
      baseroute: '/angular'
    }
  ]);
  return {
    apps
  };
});
