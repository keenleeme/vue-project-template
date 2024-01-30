<template>
  <h1>{{ route.fullPath }}</h1>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route = useRoute();
</script>
