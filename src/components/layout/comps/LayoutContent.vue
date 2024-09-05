<!--
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-22 16:50:45
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-04 17:06:37
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <a-layout>
    <div class="p2 pl-16 page-top">
      <!-- :style="{ 'background-color': token.colorBgBase, borderLeft: `1px solid ${token.colorBorder}` }" -->
      <a-breadcrumb v-if="themeConfig.breadcrumb" class="breadcrumb">
        <template #separator>
          <RightOutlined style="vertical-align: revert-layer; font-size: 14px" />
        </template>
        <a-breadcrumb-item v-for="item in activeBreadcrumb" :key="item.title">
          <template v-if="!item.path">
            {{ item.title }}
          </template>
          <template v-else>
            <RouterLink :to="item.path">{{ item.title }}</RouterLink>
          </template>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div class="page-title">
        <LeftSquareOutlined size="14" class="page-icon" />
        <div class="page-title-text">{{ $route.meta.title }}</div>
      </div>
    </div>
    <a-layout-content>
      <div class="h-full w-full">
        <RouterView />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
  // import { useRouter } from 'vue-router';
  import { LeftSquareOutlined } from '@ant-design/icons-vue';
  // import { RightOutlined } from '@ant-design/icons-vue';
  // import { theme } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useMenusStore, useThemeStore } from '@/store';

  // const { useToken } = theme;
  // const { token } = useToken();

  // const router = useRouter();
  const menusStore = useMenusStore();
  const themeStore = useThemeStore();
  const { activeBreadcrumb } = storeToRefs(menusStore);
  const { themeConfig } = storeToRefs(themeStore);
  // 监听activeBreadcrumb的变化，当activeBreadcrumb发生变化时，更新面包屑导航的显示内容
  watch(
    () => activeBreadcrumb.value,
    (newValue) => {
      console.log('activeBreadcrumb changed:', newValue);
    }
  );
</script>

<style lang="less" scoped>
  .breadcrumb {
    height: 40px;
    line-height: 40px;
    a {
      height: 40px;
    }
  }
  .page-top {
    background-color: var(--primary-bg);
    border-left: 1px solid var(--primary-bg);
    .page-title {
      display: flex;
      height: 40px;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;
      background-color: var(--primary-bg);
      .page-icon {
        color: var(--color-text-placeholder);
      }
      .page-title-text {
        color: var(--color-text-title);
        margin-left: 8px;
      }
    }
  }

  .w-full {
    background-color: var(--color-page-bg);
    border-left: 1px solid var(--primary-bg);
  }
</style>
