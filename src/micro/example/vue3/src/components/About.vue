<template>
  <h1>about页面</h1>
  <button @click="goAbout">返回</button>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
function goAbout() {
  // router.push('/home')
  router.go(-1)
}
</script>
