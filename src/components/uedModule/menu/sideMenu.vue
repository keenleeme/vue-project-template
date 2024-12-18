<template>
  <UedSideMenu
    v-if="config.layout !== 'top'"
    v-model:active-id="menuActiveId"
    v-model:fold="fold"
    :active="!themePanelVisible"
    :props="dataProps"
    :data="menuData"
    :pop-active="popActive"
    :dark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
    :pop-dark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
    :tooltip-dark="tooltipDark"
    :open-active="true"
    :mix="config.layout === 'mix'"
    :accordion="config.accordion"
    :popover-class="popoverClass"
    @menu-click="handleMenuClick"
    @update:fold="updateFold"
  >
    <template #mapmenu v-if="config.layout === 'side' && config.mapMenu">
      <MapMenu :fold="fold" :menuData="menuData" />
    </template>
    <template #header>
      <div
        v-if="config.layout === 'side' && !config.header"
        class="side-menu-header"
        @click="handleLogoClick('/custom-workbench')"
      >
        <img class="logo" :src="loginConfig.logoUrl" />
        <span v-if="!fold" class="title">{{
          config.lang === 'zh' ? loginConfig.logoName : 'security management system'
        }}</span>
      </div>
    </template>
    <template #footer v-if="config.layout === 'side' && !config.header">
      <div v-if="config.helpCenter" class="side-menu-footer-item">
        <i class="menuicon menu-icon-help" />
        <span>{{ config.lang === 'zh' ? '帮助文档' : 'Document' }}</span>
      </div>
      <div v-if="config.languageSwitch" class="side-menu-footer-item">
        <a-dropdown class="side-menu-footer-item" :placement="fold ? 'bottomRight' : 'top'">
          <div>
            <i class="menuicon menu-icon-multilingual"></i>
            <span class="ant-dropdown-link" @click.prevent>
              {{ config.lang === 'zh' ? '多语言' : 'Multilingual' }}
            </span>
          </div>
          <template #overlay>
            <a-menu @click="handleLocaleChangeA">
              <a-menu-item key="zh">简体中文</a-menu-item>
              <a-menu-item key="en">English</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <div class="side-menu-footer-item flex">
        <div class="side-menu-footer-item" :class="{ active: themePanelVisible }" @click="handleThemePanelChange">
          <i class="menuicon menu-icon-theme" />
          <span>{{ config.lang === 'zh' ? '主题' : 'Theme' }}</span>
        </div>
        <div v-if="config.lightDarkSwitch && !fold" class="side-menu-footer-item switch" @click="handleChangeMode">
          <div :class="{ active: config.mode === 'light' }">
            <i class="menuicon menu-icon-light" />
          </div>
          <div :class="{ active: config.mode === 'dark' }">
            <i class="menuicon menu-icon-black" />
          </div>
        </div>
      </div>
      <div v-if="config.lightDarkSwitch && fold" class="side-menu-footer-item" @click="handleChangeMode">
        <i class="menuicon" :class="config.mode === 'light' ? 'menu-icon-light' : 'menu-icon-black'" />
        <span>{{ config.mode === 'light' ? '明亮' : '暗黑' }}</span>
      </div>
      <UserMenu
        :menu-data="userMenuData"
        :data-props="dataProps"
        :placement="fold ? 'right' : 'top'"
        :popover-class="popoverClassUser"
      />
    </template>
  </UedSideMenu>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { changeLocale } from '@international/vue3-i18n';
  import { UedSideMenu } from '@ued-material/menu';
  import type { MenuProps } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import MapMenu from '@/components/uedModule/menu/mapMenu.vue';
  import UserMenu from '@/components/uedModule/menu/userMenu.vue';
  import { microMenuNavigation } from '@/micro/microApi/helper';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';
  import { LoginConfigDTO } from '@/views/uedModule/login/types';

  const props = defineProps({
    menuData: {
      type: Array,
      required: true,
      default: () => []
    },
    userMenuData: {
      type: Array,
      required: true,
      default: () => []
    },
    dataProps: {
      type: Object,
      default() {
        return {
          id: 'id',
          label: 'name',
          children: 'children',
          icon: 'icon',
          hide: 'hide',
          html: 'html',
          hideChildren: 'hideChildren',
          disabled: 'disabled'
        };
      }
    },
    // 展示 popover 菜单激活状态
    popActive: {
      type: Boolean,
      default: true
    },
    // tooltip暗色主题
    tooltipDark: {
      type: Boolean,
      default: true
    },
    popoverClass: {
      type: String,
      default: 'side-menu-popover'
    },
    popoverClassUser: {
      type: String,
      default: 'user-menu-popover'
    }
  });

  const appStore = useAppStore();
  const { appConfig, themePanelVisible } = storeToRefs(appStore);
  const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO(appConfig.value?.loginConfig));
  const fold = ref(false);

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  const menusStore = useMenusStore();
  const menuActiveId = ref('');
  // 监听主题配置
  watchEffect(() => {
    console.log('themeConfig changed11', themeConfig.value);
    config.value = { ...themeConfig.value };
    menuActiveId.value = menusStore.activeId;
  });
  // 修改主题配置
  const changeConfig = (key: string, newConfig: any) => {
    themeConfig.value = { ...themeConfig.value, [key]: newConfig };
  };

  // watch(
  //   ()=>config.value,
  //   (val) => {
  //     console.log('config', config.value)
  //   }
  // )

  // 侧边栏菜单点击
  const handleMenuClick = (e) => {
    console.log('sideMenu click', e);
    // 如果点击的是微应用菜单，则设置侧边栏激活路由，不清楚微应用是否都设置了module参数，微应用得有个单独标识
    // if (e.module && config.value.layout !== 'top') {
    //   menusStore.setActiveRoutes([
    //     {
    //       path: e.url,
    //       title: e.name,
    //       component: true
    //     }
    //   ]);
    // }
    // router.push(e.url);
    microMenuNavigation(e);
  };

  // 侧边栏展开收起
  const emit = defineEmits(['menuCollapse']);
  const updateFold = (fold: boolean) => {
    emit('menuCollapse', fold);
  };
  // 打开主题设置面板
  const router = useRouter();
  const handleThemePanelChange = () => {
    if (router.currentRoute.value.path !== '/themeConfig') {
      router.push('/themeConfig');
    }
    appStore.setThemePanelVisible(!themePanelVisible.value);
  };

  // 中英文切换
  const handleLocaleChangeA: MenuProps['onClick'] = ({ key }) => {
    changeConfig('lang', key);
    changeLocale(key);
    window.location.reload();
  };

  const handleChangeMode = () => {
    themeStore.setThemeConfig({
      ...themeConfig.value,
      mode: config.value.mode === 'light' ? 'dark' : 'light'
    });
  };

  // 点击logo跳转-》工作台自定义
  const handleLogoClick = (url) => {
    router.push(url);
  };
</script>

<style>
  .side-menu-wrapper {
    width: 233px !important;
  }

  .side-menu-wrapper.is-fold .side-menu-header .logo {
    transform: unset !important;
    cursor: pointer;
  }

  .side-menu-wrapper .side-menu-content {
    z-index: 1;
  }
</style>
