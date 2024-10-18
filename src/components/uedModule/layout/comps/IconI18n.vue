<template>
  <div class="i18n-select">
    <das-i18n-select @on-locale-change="handleLocaleChange"></das-i18n-select>
  </div>
</template>

<script setup lang="ts">
  const handleLocaleChange = (locale: string) => {
    window.location.reload();
  };
</script>

<style scoped>
  .i18n-select span {
    display: inline-block;
    margin-top: 3px;
  }
</style>
