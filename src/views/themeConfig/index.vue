import UedMaterialMenu from '@ued-material/menu'; import UedMaterialMenu from '@ued-material/menu';
<!--
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-23 15:08:02
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-08-29 17:01:47
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <UedMaterialMenu />

  <h1>主题配置页themeConfig</h1>
  <suspense>
    <ThemePanelItem
      type="mode"
      primary-color="red"
      :dark="true"
      mode="dark"
      :help-center="true"
      @reset-primary-color="resetPrimaryColor"
    />
  </suspense>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ThemePanelItem } from '@ued-material/menu';

  // 重置主题色
  const resetPrimaryColor = () => {
    console.log('重置主题色');
    // config.value.primaryColor = '#134BEA';
  };
</script>
