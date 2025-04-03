<template>
  <UedUserMenu
    :props="dataProps"
    :data="menuData"
    :placement="placement"
    :dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
    :pop-dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
    :name="currentUserName"
    :popover-class="popoverClass"
    @menu-click="userMenuClick"
  />
</template>

<script setup lang="ts">
  import { UedUserMenu } from '@ued-material/menu';
  import { storeToRefs } from 'pinia';
  import { onLogout, verifyToken } from '@/api/common';
  import { useUserStore, useMenusStore, useThemeStore } from '@/store';

  const props = defineProps({
    menuData: {
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
      default: 'user-menu-popover'
    },
    placement: {
      type: String,
      default: 'bottom'
    }
  });
  const menusStore = useMenusStore();
  const userStore = useUserStore();
  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  const currentUserName = computed(() => userStore.userInfo.username || 'Admin');
  // 监听主题配置
  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });

  // 退出登录
  const router = useRouter();
  const handleLogout = async () => {
    await onLogout();
    menusStore.reset();
    userStore.reset();
    themeStore.reset();
    router.push('/login');
  };

  // 用户菜单点击
  const emit = defineEmits(['userMenuClick']);
  const userMenuClick = (item: any) => {
    console.log('>>userMenuClick>>', item);
    if (item.id === 2) {
      verifyToken();
      return;
    }
    emit('userMenuClick', item);
    handleLogout();
  };
</script>
