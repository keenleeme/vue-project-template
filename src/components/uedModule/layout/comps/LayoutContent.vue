<template>
  <a-layout>
    <div class="p2 pl-16 page-top">
      <a-breadcrumb v-if="themeConfig.breadcrumb" class="breadcrumb">
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
        <i class="zq-icon zq-icon-arrow-left"></i>
        <LeftSquareOutlined size="14" class="page-icon" />
        <div class="page-title-text">{{ $t(`${$route.meta.title}`) }}</div>
      </div>
    </div>
    <a-layout-content>
      <div class="h-full w-full pos-reactive">
        <RouterView />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useMenusStore, useThemeStore } from '@/store';

  const menusStore = useMenusStore();
  const themeStore = useThemeStore();
  const { activeBreadcrumb } = storeToRefs(menusStore);
  const { themeConfig } = storeToRefs(themeStore);
  // 监听activeBreadcrumb的变化，当activeBreadcrumb发生变化时，更新面包屑导航的显示内容

  // activeBreadcrumb.value.push({  path: 'string',
  // title: 'string',
  // component:true,
  // })
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
    background-color: var(--color-bg-container);
    border-left: 1px solid var(--color-component-stroke);
    .page-title {
      display: flex;
      height: 40px;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;
      background-color: var(--color-bg-container);
      .page-icon {
        color: var(--color-text-placeholder);
      }
      .page-title-text {
        color: var(--color-text-primarys);
        margin-left: 8px;
      }
    }
  }

  .w-full {
    background-color: var(--color-bg-page);
    border-left: 1px solid var(--color-bg-container);
  }
</style>
