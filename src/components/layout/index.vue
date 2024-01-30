<template>
  <a-watermark :content="watermark">
    <a-layout class="h-screen w-screen">
      <HeaderMenus v-if="!fullScreen"></HeaderMenus>
      <a-layout v-if="!fullScreen">
        <SiderMenus></SiderMenus>
        <LayoutContent></LayoutContent>
      </a-layout>
      <RouterView v-if="fullScreen"></RouterView>
    </a-layout>
  </a-watermark>
</template>

<script setup lang="ts">
  import { computed, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore } from '@/store';
  import type { RouteItemType } from '@/store/modules/menus/types';
  import HeaderMenus from './comps/HeaderMenus.vue';
  import LayoutContent from './comps/LayoutContent.vue';
  import SiderMenus from './comps/SiderMenus.vue';

  const appStore = useAppStore();
  const { watermark } = storeToRefs(appStore);
  const menusStore = useMenusStore();
  const route = useRoute();
  watchEffect(() => {
    const routes = route.meta.parentRoutes as RouteItemType[];
    menusStore.setActiveRoutes(routes);
  });

  const fullScreen = computed(() => {
    return route.meta.fullScreen;
  });
</script>
