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
      <a-layout v-if="!fullScreen" class="ant-layout-has-sider">
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
  import { routeCenter } from '@/micro';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';
  import type { RouteItemType } from '@/store/uedModule/menus/types';
  import HeaderMenus from './comps/HeaderMenus.vue';
  import LayoutContent from './comps/LayoutContent.vue';
  import SiderMenus from './comps/SiderMenus.vue';

  const appStore = useAppStore();
  const { watermark, fullScreen } = storeToRefs(appStore);
  const menusStore = useMenusStore();
  const { siderMenus } = storeToRefs(menusStore);
  const route = useRoute();
  watchEffect(() => {
    const routes = (route.meta.parentRoutes as RouteItemType[]) || [];
    // if (!routes || routes.length === 0) {
    //   routes = [
    //     {
    //       path: route.fullPath,
    //       title: route.meta.title as string,
    //       component: true
    //     }
    //   ];
    // }
    menusStore.setActiveRoutes(routes);
  });

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  // watchEffect(() => {
  //   const { layout, topStyle } = themeConfig.value;
  // });

  watch(route, () => {
    if (route.meta.fullScreen) {
      appStore.setFullScreen(true);
      return true;
    }
    const customMeta = routeCenter.getMeta(route.fullPath, route.name as string, route.hash);
    appStore.setFullScreen(!!customMeta?.fullScreen);
  });
  // const fullScreen = computed(() => {
  //   if (route.meta.fullScreen) {
  //     return true;
  //   }
  //   const customMeta = routeCenter.getMeta(route.fullPath, route.name as string, route.hash);
  //   return customMeta?.fullScreen || false;
  // });

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
        id: 'example',
        name: I18N.layout.gongZuoTaiZiDingYi,
        icon: 'zq-icon zq-icon-jiancerenwuzhongxin',
        url: '/custom-workbench',
        hideChildren: true,
        children: []
      },
      {
        id: 'dasvScreen',
        name: I18N.layout.daPingZiDingYi,
        icon: 'zq-icon zq-icon-shebeiguanli',
        url: '/dasvScreen',
        hideChildren: true,
        children: []
      },
      {
        id: 'example1',
        name: I18N.layout.baoBiaoZiDingYi,
        icon: 'zq-icon zq-icon-jiankangzhishucesuan',
        url: '/custom-report',
        hideChildren: true,
        children: []
      },
      {
        id: 5,
        name: I18N.layout.tuKeShiHuaChengXian,
        icon: 'zq-icon zq-icon-image',
        url: '/example',
        hideChildren: true,
        children: []
      },
      {
        id: 6,
        name: I18N.layout.tuBianJiQi,
        icon: 'zq-icon zq-icon-chart',
        url: '/example',
        hideChildren: true,
        children: []
      },
      {
        id: 7,
        name: I18N.layout.liuChengBianPai,
        icon: 'zq-icon zq-icon-share',
        url: '/example',
        hideChildren: true,
        children: []
      },
      {
        id: 8,
        name: I18N.layout.xiTongSheZhi,
        icon: 'zq-icon zq-icon-setting',
        children: [
          {
            id: 'themeConfig',
            name: I18N.layout.zhuTiPeiZhiYe,
            icon: 'zq-icon zq-icon-setting',
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
          }
          // {
          //   id: 'vueTour',
          //   name: I18N.layout.yongHuYinDao,
          //   url: '/vueTour'
          // }
        ]
      },
      {
        id: 'micro',
        name: I18N.layout.MicroApp,
        icon: 'zq-icon zq-icon-liuliangdaili',
        children: [
          {
            id: 'vue2',
            name: `vue2${I18N.layout.App}`,
            icon: 'zq-icon zq-icon-liuliangdaili',
            url: '',
            children: [
              {
                id: 'vue-home',
                name: `home${I18N.layout.Page}`,
                url: '/vue2/#/home',
                module: 'vue2'
              },
              {
                id: 'vue-about',
                name: `about${I18N.layout.Page}`,
                url: '/vue2/#/about',
                module: 'vue2'
              }
            ]
          },
          {
            id: 'vue3',
            name: `vue3${I18N.layout.App}`,
            url: '',
            children: [
              {
                id: 'vue3-home',
                name: `home${I18N.layout.Page}`,
                url: '/vue3/home',
                module: 'vue3'
              },
              {
                id: 'vue3-about',
                name: `about${I18N.layout.Page}`,
                url: '/vue3/about',
                module: 'vue3'
              }
            ]
          },
          {
            id: 'react',
            name: `react${I18N.layout.App}`,
            url: '',
            children: [
              {
                id: 'react-home',
                name: `home${I18N.layout.Page}`,
                url: '/react/home',
                module: 'react'
              },
              {
                id: 'react-about',
                name: `about${I18N.layout.Page}`,
                url: '/react/about',
                module: 'react'
              }
            ]
          },
          {
            id: 'angular',
            name: `angular${I18N.layout.App}`,
            url: '/angular/home'
          },
          {
            id: 'multiple',
            name: `multiple${I18N.layout.App}`,
            url: '/multiple'
          },
          {
            id: 'custom',
            name: `${I18N.layout.Custom}${I18N.layout.Page}`,
            icon: 'zq-icon zq-icon-yewudingyi',
            url: '/custom'
          }
        ]
      },
      {
        id: 1,
        name: I18N.layout.genericTypicalPage,
        icon: 'zq-icon zq-icon-zhihuitiaodu',
        children: [
          {
            id: 'workBench',
            name: I18N.layout.gongZuoTai,
            hideChildren: true,
            icon: 'zq-icon zq-icon-zhihuitiaodu',
            url: '/workBench',
            children: []
          },
          {
            id: 'dashboard',
            name: I18N.layout.yiBiaoPan,
            hideChildren: true,
            icon: 'zq-icon zq-icon-zhihuitiaodu',
            url: '/dashboard',
            children: []
          },
          {
            id: 'workBenchList',
            name: I18N.layout.yiBiaoPanGuanLi,
            hideChildren: true,
            url: '/workBench-list',
            children: []
          },
          {
            id: 'workList',
            name: I18N.layout.lieBiaoYe,
            hideChildren: true,
            url: '/work-list',
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
      }
    ]
  });
</script>
