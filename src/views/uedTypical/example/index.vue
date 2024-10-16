<template>
  <div class="table-wrap">
    <h1>功能开发中，敬请期待～</h1>
    <h2>{{ route.fullPath }}</h2>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  const route = useRoute();
</script>

<style lang="less" scoped>
  h1 {
    text-align: center;
    padding: 200px 0;
  }
  h2{
    text-align: center;
  }
</style>
