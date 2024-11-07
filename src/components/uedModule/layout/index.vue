<template>
  <a-watermark :content="watermark">
    <a-layout
      class="h-screen"
      :class="{
        dark: themeConfig.mode === 'dark',
        'header-dark': themeConfig.mode === 'dark' || (themeConfig.mode === 'light' && themeConfig.topStyle === 'dark')
      }"
    >
      <HeaderMenus v-if="!fullScreen" v-bind="menuConfig"></HeaderMenus>
      <a-layout v-if="!fullScreen">
        <SiderMenus
          v-if="themeConfig.layout === 'side' || (siderMenus && siderMenus.length > 0 && themeConfig.layout === 'mix')"
          v-bind="menuConfig"
        ></SiderMenus>
        <LayoutContent></LayoutContent>
      </a-layout>
      <RouterView v-if="fullScreen"></RouterView>
    </a-layout>
  </a-watermark>
</template>

<script setup lang="ts">
  import { computed, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';
  import type { RouteItemType } from '@/store/uedModule/menus/types';
  import HeaderMenus from './comps/HeaderMenus.vue';
  import LayoutContent from './comps/LayoutContent.vue';
  import SiderMenus from './comps/SiderMenus.vue';

  const appStore = useAppStore();
  const { watermark } = storeToRefs(appStore);
  const menusStore = useMenusStore();
  const { siderMenus } = storeToRefs(menusStore);
  const route = useRoute();
  watchEffect(() => {
    const routes = route.meta.parentRoutes as RouteItemType[];
    menusStore.setActiveRoutes(routes);
  });

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  // watchEffect(() => {
  //   const { layout, topStyle } = themeConfig.value;
  // });

  const fullScreen = computed(() => {
    return route.meta.fullScreen;
  });

  const menuConfig = ref({
    // 不传按默认配置字段，如要修改请补充对应字段的key/value
    dataProps: {
      label: 'name',
      children: 'children'
    },
    userMenu: [
      {
        id: 1,
        name: I18N.layout.tuiChuDengLu
      }
    ],
    menuData: [
      {
        id: 1,
        name: I18N.layout.genericTypicalPage,
        icon: 'menu-icon-desktop',
        children: [
          {
            id: 'workBench',
            name: I18N.layout.gongZuoTai,
            hideChildren: true,
            icon: 'menu-icon-desktop',
            url: '/workBench',
            children: []
          },
          {
            id: 'baseList',
            name: I18N.layout.lieBiaoYe,
            hideChildren: true,
            url: '/base-list',
            children: []
          },
          {
            id: 'baseForm',
            name: I18N.layout.biaoDanYe,
            hideChildren: true,
            url: '/base-form',
            children: []
          },
          {
            id: 'baseDetail',
            name: I18N.layout.xiangQingYe,
            hideChildren: true,
            url: '/base-detail',
            children: []
          },
          {
            id: 'baseConfig',
            name: I18N.layout.peiZhiYe,
            hideChildren: true,
            url: '/base-config',
            children: []
          }
        ]
      },
      {
        id: 'dasvScreen',
        name: I18N.layout.daPingZiDingYi,
        url: '/dasvScreen',
        hideChildren: true,
        children: []
      },
      {
        id: 'example',
        name: I18N.layout.gongZuoTaiZiDingYi,
        url: '/custom-workbench',
        hideChildren: true,
        children: []
      },
      {
        id: 'example1',
        name: I18N.layout.baoBiaoZiDingYi,
        url: '/custom-report',
        hideChildren: true,
        children: []
      },
      {
        id: 5,
        name: I18N.layout.tuKeShiHuaChengXian,
        url: '/example',
        hideChildren: true,
        children: []
      },
      {
        id: 6,
        name: I18N.layout.tuBianJiQi,
        url: '/example',
        hideChildren: true,
        children: []
      },
      {
        id: 7,
        name: I18N.layout.liuChengBianPai,
        url: '/example',
        hideChildren: true,
        children: []
      },
      {
        id: 8,
        name: I18N.layout.xiTongSheZhi,
        children: [
          {
            id: 'themeConfig',
            name: I18N.layout.zhuTiPeiZhiYe,
            url: '/themeConfig'
          },
          {
            id: 'loginConfig',
            name: I18N.layout.dengLuPeiZhiYe,
            url: '/loginConfig'
          },
          {
            id: 'dasUpgrade',
            name: I18N.layout.zaiXianShengJi,
            url: '/dasUpgrade'
          },
          {
            id: 'vueTour',
            name: I18N.layout.yongHuYinDao,
            url: '/vueTour'
          }
        ]
      },
      {
        id: 'micro',
        name: '微服务应用',
        children: [
          {
            id: 'vue2',
            name: 'vue2应用',
            url: '',
            children: [
              {
                id: 'vue-home',
                name: 'home页面',
                url: '/vue2/#/home',
                module: 'vue2'
              },
              {
                id: 'vue-about',
                name: 'about页面',
                url: '/vue2/#/about',
                module: 'vue2'
              }
            ]
          },
          {
            id: 'vue3',
            name: 'vue3应用',
            url: '',
            children: [
              {
                id: 'vue3-home',
                name: 'home页面',
                url: '/vue3/home',
                module: 'vue3'
              },
              {
                id: 'vue3-about',
                name: 'about页面',
                url: '/vue3/about',
                module: 'vue3'
              }
            ]
          },
          {
            id: 'react',
            name: 'react应用',
            url: '',
            children: [
              {
                id: 'react-home',
                name: 'home页面',
                url: '/react/home',
                module: 'react'
              },
              {
                id: 'react-about',
                name: 'about页面',
                url: '/react/about',
                module: 'react'
              }
            ]
          },
          {
            id: 'angular',
            name: 'angular应用',
            url: '/angular/home'
            // children:[
            //   {
            //     id: 'angular-home',
            //     name: 'home页面',
            //     url: '/angular/home',
            //     module:'angular'
            //   },
            //   {
            //     id: 'angular-material',
            //     name: 'material页面',
            //     url: '/angular/material',
            //     module:'angular'
            //   },
            //   {
            //     id: 'angular-page3',
            //     name: 'page3页面',
            //     url: '/angular/page3',
            //     module:'angular'
            //   }
            // ]
          },
          {
            id: 'multiple',
            name: '多个应用',
            url: '/multiple'
          }
        ]
      },
      {
        id: 'custom',
        name: '定制页面',
        url: '/custom'
      }
    ]
  });
</script>
