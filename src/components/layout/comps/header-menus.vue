<template>
  <a-layout-header>
    <div class="flex">
      <div>
        <img src="/logo.png" class="h-32" />
        <span class="text-white">VUE3-TS-WEBPACK-PROJECT</span>
      </div>
      <div class="flex-1 px-16">
        <a-menu
          v-model:selectedKeys="selectMenuId"
          :items="headerMenus"
          theme="dark"
          :style="{ lineHeight: '64px' }"
          mode="horizontal"
          @click="handleSelect"
        ></a-menu>
      </div>
      <a-flex align="center" justify="center">
        <a-button type="text" shape="circle">
          <IconI18n></IconI18n>
        </a-button>
        <a-button type="text" shape="circle" @click="handleChangeTheme">
          <IconDark v-if="themeType === ThemeTypes.Dark" />
          <IconLight v-if="themeType === ThemeTypes.Light" />
        </a-button>
      </a-flex>
      <div class="ml-8">
        <a-dropdown>
          <div class="cursor-pointer">
            <a-space>
              <a-avatar>
                <template #icon>
                  <GithubOutlined style="font-size: 30px" />
                </template>
              </a-avatar>
              <span class="text-white"> Admin </span>
            </a-space>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;">{{ $t('I18N.layout.geRenXinXi') }}</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="handleLogout">{{ $t('I18N.layout.tuiChuDengLu') }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
  import { ref, watchEffect, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { GithubOutlined } from '@ant-design/icons-vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore } from '@/store';
  import { ThemeTypes } from '@/theme';

  const menusStore = useMenusStore();
  const appStore = useAppStore();
  // 主题功能
  const { themeType } = storeToRefs(appStore);
  const handleChangeTheme = () => {
    const type = themeType.value === ThemeTypes.Dark ? ThemeTypes.Light : ThemeTypes.Dark;
    appStore.setThemeType(type);
  };
  // 菜单
  const { headerMenus, activeMenus } = storeToRefs(menusStore);
  const selectMenuId = ref<string[]>([]);
  watchEffect(() => {
    if (activeMenus.value.length > 0) {
      const active = activeMenus.value[activeMenus.value.length - 1];
      selectMenuId.value = [active?.id];
    }
  });

  const router = useRouter();
  // @ts-ignore
  const handleSelect = ({ item, key }) => {
    if (item.path) {
      router.push(item.path);
      return;
    }
    const menu = menusStore.findFistSiderMenu(key);
    if (menu && menu.path) {
      router.push(menu.path);
    }
  };

  // 退出登录
  const handleLogout = () => {
    menusStore.reset();
    appStore.reset();
    router.push('/login');
  };
</script>
