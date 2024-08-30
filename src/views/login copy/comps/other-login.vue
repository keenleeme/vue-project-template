<template>
  <div class="cursor-pointer h-27 inline-block">
    <img class="w-27" :src="props.icon" />
    <span class="text-#555B66 ml-4 line-height-27 font-size-12">{{ props.text }}</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  });
</script>
