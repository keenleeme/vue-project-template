<template>
    <UedSideMenu
      v-if="config.layout !== 'top'"
      :props="dataProps"
      :data="menuData"
      :activeId.sync="activeId"
      :popActive="popActive"
      :dark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
      :fold.sync="fold"
      :popDark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
      :tooltipDark="tooltipDark"
      :openActive="true"
      :mix="config.layout === 'mix'"
      :accordion="config.accordion"
      :popoverClass="popoverClass"
      @menu-click="handleMenuClick"
      @update:fold="updateFold"
    >
      <template #header>
        <div class="side-menu-header" v-if="config.layout === 'side' && !config.header">
          <!-- <span class="logo"><img style="height: 30px;" src="@/assets/images/logo.svg" /></span> -->
          <span class="logo"><img style="height: 24px;" :src="loginConfig.logoUrl" /></span>
        </div>
      </template>
      <template #footer>
        <div class="side-menu-footer">
          <div v-if="config.helpCenter" class="side-menu-footer-item">
            <i class="menuicon menu-icon-help" />
            <span>帮助</span>
          </div>
          <div class="side-menu-footer-item">
            <i class="menuicon menu-icon-bell" />
            <span>消息</span>
          </div>
          <div class="side-menu-footer-item" @click="handleThemePanelChange">
            <i class="menuicon menu-icon-cog" />
            <span>设置</span>
          </div>
          <div v-if="fold && config.lightDarkSwitch" class="side-menu-footer-item">
            <i
              class="menuicon"
              :class="config.mode === 'dark' ? 'menu-icon-black' : 'menu-icon-light'"
              @click="config.mode = config.mode === 'dark' ? 'light' : 'dark'"
            />
          </div>
          <div v-show="fold && config.languageSwitch" class="side-menu-footer-item">
            <i
              class="menuicon"
              :class="config.lang === 'zh' ? 'menu-icon-chinese' : 'menu-icon-english'"
              @click="config.lang = config.lang === 'zh' ? 'en' : 'zh'"
            />
          </div>
          <div v-show="!fold" class="side-menu-switch-group">
            <div v-if="config.lightDarkSwitch" class="switch-item">
              <div :class="{ active: config.mode === 'dark' }" @click="changeConfig('mode','dark')">
                <i class="menuicon menu-icon-black" />
              </div>
              <div :class="{ active: config.mode === 'light' }" @click="changeConfig('mode','light')">
                <i class="menuicon menu-icon-light" />
              </div>
            </div>
            <div v-if="config.languageSwitch" class="switch-item">
              <div :class="{ active: config.lang === 'zh' }" @click="handleLocaleChangeA('zh')">
                <i class="menuicon menu-icon-chinese" />
              </div>
              <div :class="{ active: config.lang === 'en' }" @click="handleLocaleChangeA('en')">
                <i class="menuicon menu-icon-english" />
              </div>
            </div>
          </div>
          <UserMenu 
            :menuData="userMenuData" 
            :dataProps="dataProps" 
            :placement="fold ? 'right' : 'top'"
            :popoverClass="popoverClassUser">
          </UserMenu>
        </div>
      </template>
    </UedSideMenu>
</template>
<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';
  import { UedSideMenu, UedUserMenu } from '@ued-material/menu';
  import { LoginConfigDTO } from '@/views/uedModule/login/types';
  import { changeLocale } from '@international/vue3-i18n';
  import UserMenu from '@/components/uedModule/menu/userMenu.vue'

  const props = defineProps({
    menuData: {
      type: Array,
      required: true,
      default: () => [],
    },
    userMenuData: {
      type: Array,
      required: true,
      default: () => [],
    },
    dataProps: {
      type: Object,
      default: {
        id: 'id',
        label: 'name',
        children: 'submenu',
        icon: 'icon',
        hide: 'hide',
        html: 'html',
        hideChildren: 'hideChildren',
        disabled: 'disabled',
      },
    },
    // 展示 popover 菜单激活状态
    popActive: {
      type: Boolean,
      default: true,
    },
    // tooltip暗色主题
    tooltipDark: {
      type: Boolean,
      default: true,
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
  const { appConfig } = storeToRefs(appStore);
  const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO(appConfig.value?.loginConfig));
  const fold = ref(false);

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  // 监听主题配置
  watchEffect(() => {
    config.value = { ...themeConfig.value };
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

  const menusStore = useMenusStore();
  const { activeId } = storeToRefs(menusStore);

  // 侧边栏菜单点击
  const router = useRouter();
  const handleMenuClick = (e) => {
    console.log('sideMenu click', e);
    router.push(e.url);
  }

  // 侧边栏展开收起
  const emit = defineEmits(['menuCollapse','userMenuClick'])
  const updateFold = (fold:boolean) => {
    emit('menuCollapse',fold)
  }
  // 打开主题设置面板
  // const appStore = useAppStore();
  const handleThemePanelChange = () => {
    appStore.setThemePanelVisible(true);
  }

  // 中英文切换
  const handleLocaleChangeA = (value: string) => {
    let locale = value === 'zh'?'zh':'en';
    changeConfig('lang',locale)
    changeLocale(locale);
    window.location.reload();
  }

    // 用户菜单点击
  // const userMenuClick = (item: any) => {
  //   console.log('>>userMenuClick>>', item)
  //   emit('userMenuClick', item)
  // }
</script>
<style>
.side-menu-wrapper.is-fold .side-menu-header .logo {
  transform: unset !important;
}
</style>