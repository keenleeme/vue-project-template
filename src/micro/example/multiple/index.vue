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
 import { getAppRealUrl} from '../../microApi/helper'
  const appData = ref([
    {
      name: 'vue2',
      url: getAppRealUrl('/subapp/vue2'),
      baseroute: '/vue2'
    },
    {
      name: 'vue3',
      url: getAppRealUrl('/subapp/vue3'),
      baseroute: '/multiple'
    }
  ]);
</script>
