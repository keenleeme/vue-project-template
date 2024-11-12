<template>
  <div grid grid-cols-2>
    <micro-app
      v-for="app in appData"
      :key="app.name"
      :name="app.name"
      :url="app.url"
      :baseroute="app.baseroute"
      disable-memory-router
      iframe
      fiber
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
 import { getAppRealUrl,getRegistryUrl} from '../../microApi/helper'
  const appData = ref([
    {
      name: 'vue2',
      url: getAppRealUrl(getRegistryUrl('vue2', '7001')),
      baseroute: '/vue2'
    },
    {
      name: 'vue3',
      url: getAppRealUrl(getRegistryUrl('vue3', '7002')),
      baseroute: '/multiple'
    }
  ]);
</script>
