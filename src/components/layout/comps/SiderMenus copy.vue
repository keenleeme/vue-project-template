<template>
  <a-layout-sider
    v-show="siderMenus?.length"
    v-model:collapsed="collapsed"
    :style="{ background: token.colorBgBase }"
    width="176"
    collapsedWidth="48"
    :trigger="null"
    collapsible
  >
    <UedSideMenu
      v-if="config.layout !== 'top'"
      :props="{
        label: 'name',
        children: 'submenu'
      }"
      :data="data"
      :activeId.sync="activeId"
      :popActive="popActive"
      :dark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
      :fold.sync="fold"
      :popDark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
      :tooltipDark="tooltipDark"
      :openActive="true"
      :mix="config.layout === 'mix'"
      :accordion="config.accordion"
      popoverClass="side-menu-popover"
      @menu-click="handleMenuClick"
      @update:fold="handleMenuCollapse"
    >
      <template #header>
        <div class="side-menu-header" v-if="config.layout === 'side' && !config.header">
          <span class="logo"><img style="height: 30px;" src="@/assets/images/logo.svg" /></span>
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
              :class="config.lang === 'ZH' ? 'menu-icon-chinese' : 'menu-icon-english'"
              @click="config.lang = config.lang === 'ZH' ? 'EN' : 'ZH'"
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
              <div :class="{ active: config.lang === 'ZH' }" @click="handleLocaleChangeA('ZH')">
                <i class="menuicon menu-icon-chinese" />
              </div>
              <div :class="{ active: config.lang === 'EN' }" @click="handleLocaleChangeA('EN')">
                <i class="menuicon menu-icon-english" />
              </div>
            </div>
          </div>
          <UedUserMenu
            :props="dataProps"
            :data="userMenu"
            :placement="fold ? 'right' : 'top'"
            :dark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
            :popDark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
            name="Admin"
            popoverClass="user-menu-popover"
            @menu-click="userMenuClick"
          />
        </div>
      </template>
    </UedSideMenu>
  </a-layout-sider>

</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
  import { theme } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';
  import { UedSideMenu, UedUserMenu } from '@ued-material/menu';
  import { changeLocale } from '@international/vue3-i18n';

  // 菜单折叠逻辑
  let collapsed = ref(false);
  const tooltipDark = ref(true);
  const fold = ref(false);
  // const activeId = ref('');
  const popActive = ref(true);

  const { useToken } = theme;
  const { token } = useToken();
  console.log(token);

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });
  const changeConfig = (key: string, newConfig: any) => {
    console.log('changeConfig', key, newConfig);
    themeConfig.value = { ...themeConfig.value, [key]: newConfig };
  };


  watch(
    ()=>config.value,
    (val) => {
      console.log('config', config.value)
    }
  )

  const menusStore = useMenusStore();
  const { siderMenus, activeMenus, activeId } = storeToRefs(menusStore);
  // const selectMenuId = ref<string[]>([]);
  // const openKeys = ref<string[]>([]);
  // watchEffect(() => {
  //   if (activeMenus.value.length > 1) {
  //     const menus = activeMenus.value.slice(0, activeMenus.value.length - 1);
  //     selectMenuId.value = menus.filter((item) => item.path).map((item) => item.id);
  //     openKeys.value = menus.filter((item) => !item.path).map((item) => item.id);
  //   }
  // });

  const data = ref([
    {
      id: 1,
      name: I18N.layout.genericTypicalPage,
      submenu: [
        {
          id: 'workBench',
          name: '工作台',
          hideChildren: true,
          url: '/workBench',
          submenu: []
        },
        {
          id: 'baseList',
          name: I18N.layout.lieBiaoYe,
          hideChildren: true,
          url: '/base-list',
          submenu: []
        },
        {
          id: 'baseForm',
          name: I18N.layout.biaoDanYe,
          hideChildren: true,
          url: '/base-form',
          submenu: []
        },
        {
          id: 'baseDetail',
          name: I18N.layout.xiangQingYe,
          hideChildren: true,
          url: '/base-detail',
          submenu: []
        },
        {
          id: 'baseConfig',
          name: I18N.layout.peiZhiYe,
          hideChildren: true,
          url: '/base-config',
          submenu: []
        }
      ]
    },
    {
      id: 'dasvScreen',
      name: I18N.layout.daPingZiDingYi,
      url: '/dasvScreen',
      hideChildren: true,
      submenu: []
    },
    {
      id: 3,
      name: I18N.layout.gongZuoTaiZiDingYi,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 4,
      name: I18N.layout.baoBiaoZiDingYi,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 5,
      name: I18N.layout.tuKeShiHuaChengXian,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 6,
      name: I18N.layout.tuBianJiQi,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 7,
      name: I18N.layout.liuChengBianPai,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 8,
      name: I18N.layout.xiTongSheZhi,
      submenu: [
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
      id: 'sum-more',
      name: I18N.api.common.duoCengCaiDan,
      url: '/sum-more',
      // hideChildren: true,
      submenu: [
        {
          id: 90,
          name: I18N.api.common.erJiCaiDan,
          url: '/sum-more-0'
        },
        {
          id: 'sum-more-1',
          name: I18N.api.common.erJiCaiDanFen2,
          url: 'sum-more-1',
          submenu: [
            {
              id: 'sum-more-1-0',
              name: I18N.api.common.sanJiCaiDan,
              url: '/sum-more-1-0'
            },
            {
              id: 'sum-more-1-1',
              name: I18N.api.common.ziDongTianJiaQian,
              url: '/sum-more/sum-more-1-1'
            }
          ]
        },
        {
          id: 'sum-more-2',
          name: I18N.api.common.erJiCaiDanFen,
          url: '/sum-more-2',
          submenu: [
            {
              id: 'sum-more-2-1',
              name: I18N.api.common.ziDongTianJiaDuo,
              url: '/sum-more/sum-more-2/sum-more-2-1'
            }
          ]
        }
      ]
    }
  ]);

  const router = useRouter();
  // @ts-ignore;
  const handleSelect = ({ item }) => {
    router.push(item.path);
  };

  const handleMenuClick = (e) => {
    console.log('click', e);
    router.push(e.url);
  }
  
  const handleMenuCollapse = (fold: boolean) => {
    collapsed.value = fold;
  }

  const dataProps = ref({
    label: 'name',
    children: 'submenu',
  })
  const userMenu = ref([
    {
      id: 1,
      name: '退出登录',
    },
  ])
  
  const userMenuClick = (item: any) => {
    console.log('>>userMenuClick>>', item)
  }
  
  const appStore = useAppStore();
  const handleThemePanelChange = () => {
    appStore.setThemePanelVisible(true);
  }

  const handleLocaleChangeA = (value: string) => {
    let locale = value === 'ZH'?'zh':'en';
    changeLocale(locale);
    window.location.reload();
  }

</script>
