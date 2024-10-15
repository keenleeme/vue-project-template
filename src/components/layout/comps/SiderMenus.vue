<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :style="{ background: token.colorBgBase }"
    width="176"
    collapsedWidth="48"
    :trigger="null"
    collapsible
  >
    <SideMenu 
      :menuData="menuData" 
      v-bind="userMenuConfig" 
      @menuCollapse="handleMenuCollapse"
      @userMenuClick="handleUserMenuClick"
    >
    </SideMenu>
  </a-layout-sider>

</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { theme } from 'ant-design-vue';
  import SideMenu from '@/components/menu/sideMenu.vue'

  
  const { useToken } = theme;
  const { token } = useToken();

  // 侧边菜单数据
  const menuData = ref([
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

  // 用户菜单配置和数据
  const userMenuConfig = ref({
    dataProps: {
      label: 'name',
      children: 'submenu',
    },
    userMenuData:[
      {
        id: 1,
        name: I18N.layout.tuiChuDengLu,
      },
    ]
  })

  // 菜单折叠逻辑
  let collapsed = ref(false);
  const handleMenuCollapse = (fold: boolean) => {
    collapsed.value = fold;
  }

  //  用户菜单点击
  const handleUserMenuClick = (menuData: any ) => {
    // console.log('>>userMenuClick>>', menuData)
  }


</script>
