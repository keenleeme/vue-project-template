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
  import { ref, defineProps, computed } from 'vue';
  import { theme } from 'ant-design-vue';
  import SideMenu from '@/components/menu/sideMenu.vue'

  const props = defineProps({
    menuData: {
      type: Array,
      // required: true
      default: () => [],
    },
    userMenu: {
      type: Array,
      // required: true,
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
  });
  
  const { useToken } = theme;
  const { token } = useToken();

  // 用户菜单配置和数据
  const userMenuConfig = computed(() => {
    console.log('props.userMenu',props.userMenu)
    return {
      dataProps: props.dataProps,
      userMenuData: props.userMenu
    };
  });

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
