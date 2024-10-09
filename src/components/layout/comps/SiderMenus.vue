<!--
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-10-08 10:18:29
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-10-09 14:40:34
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
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
      <template v-if="config.layout === 'side' && !config.header">
        <!-- header -->
        <div slot="header" class="side-menu-header">
          <!-- <span class="logo">LOGO</span> -->
          <span class="logo"><img src="@/assets/images/logo.svg" /></span>
        </div>
        <!-- footer -->
        <div slot="footer" class="side-menu-footer">
          <div v-if="config.helpCenter" class="side-menu-footer-item">
            <i class="menuicon menu-icon-help" />
            <span>帮助</span>
          </div>
          <div class="side-menu-footer-item">
            <i class="menuicon menu-icon-bell" />
            <span>消息</span>
          </div>
          <div class="side-menu-footer-item" @click="themePanelVisible = true">
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
              <div :class="{ active: config.mode === 'dark' }" @click="config.mode = 'dark'">
                <i class="menuicon menu-icon-black" />
              </div>
              <div :class="{ active: config.mode === 'light' }" @click="config.mode = 'light'">
                <i class="menuicon menu-icon-light" />
              </div>
            </div>
            <div v-if="config.languageSwitch" class="switch-item">
              <div :class="{ active: config.lang === 'ZH' }" @click="config.lang = 'ZH'">
                <i class="menuicon menu-icon-chinese" />
              </div>
              <div :class="{ active: config.lang === 'EN' }" @click="config.lang = 'EN'">
                <i class="menuicon menu-icon-english" />
              </div>
            </div>
          </div>
          <ued-user-menu
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
  import { useMenusStore, useThemeStore } from '@/store';
  import { UedSideMenu, UedUserMenu } from '@ued-material/menu';

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

  watch(
    ()=>config.value,
    (val) => {
      console.log('config', config.value)
    }
  )

  const menusStore = useMenusStore();
  const { siderMenus, activeMenus, activeId } = storeToRefs(menusStore);
  const selectMenuId = ref<string[]>([]);
  const openKeys = ref<string[]>([]);
  watchEffect(() => {
    if (activeMenus.value.length > 1) {
      const menus = activeMenus.value.slice(0, activeMenus.value.length - 1);
      selectMenuId.value = menus.filter((item) => item.path).map((item) => item.id);
      openKeys.value = menus.filter((item) => !item.path).map((item) => item.id);
    }
  });

  const data = ref([
    {
      id: 1,
      name: '通用典型页面',
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
          name: '列表页',
          hideChildren: true,
          url: '/base-list',
          submenu: []
        },
        {
          id: 'baseForm',
          name: '基础表单',
          hideChildren: true,
          url: '/base-form',
          submenu: []
        },
        {
          id: 'baseDetail',
          name: '基础详情',
          hideChildren: true,
          url: '/base-detail',
          submenu: []
        },
        {
          id: 'baseConfig',
          name: '基础配置',
          hideChildren: true,
          url: '/base-config',
          submenu: []
        }
      ]
    },
    {
      id: 'dasvScreen',
      name: '大屏自定义',
      url: '/dasvScreen',
      hideChildren: true,
      submenu: []
    },
    {
      id: 3,
      name: '工作台自定义',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 4,
      name: '报表自定义',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 5,
      name: '图可视化呈现',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 6,
      name: '图编辑器',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 7,
      name: '流程编排',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 'themeConfig1',
      name: '系统设置',
      submenu: [
        {
          id: 'themeConfig',
          name: '主题配置页',
          url: '/themeConfig'
        },
        {
          id: 'loginConfig',
          name: '登录配置页',
          url: '/loginConfig'
        },
        {
          id: 'dasUpgrade',
          name: '在线升级',
          url: '/dasUpgrade'
        },
        {
          id: 'vueTour',
          name: '用户引导',
          url: '/vueTour'
        }
      ]
    },
    {
      id: 'sum-more',
      name: '多层菜单',
      url: '/sum-more',
      // hideChildren: true,
      submenu: [
        {
          id: 'sum-more-0',
          name: '二级菜单',
          url: '/sum-more-0'
        },
        {
          id: 'sum-more-1',
          name: '二级菜单分类1',
          url: 'sum-more-1',
          submenu: [
            {
              id: 'sum-more-1-0',
              name: '三级菜单',
              url: '/sum-more-1-0'
            },
            {
              id: 'sum-more-1-1',
              name: '自动添加前缀三级菜单',
              url: '/sum-more/sum-more-1-1'
            }
          ]
        },
        {
          id: 'sum-more-2',
          name: '二级菜单分类2',
          url: '/sum-more-2',
          submenu: [
            {
              id: 'sum-more-2-1',
              name: '自动添加多个前缀三级菜单',
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
  const handleMenuCollapse = (fold) => {
    collapsed.value = fold;
  }
</script>
