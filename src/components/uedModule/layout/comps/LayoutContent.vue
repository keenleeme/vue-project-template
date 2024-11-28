<template>
  <div v-if="themeConfig.layout !== 'top'" class="setting-nav" :class="{ expand: themePanelVisible }">
    <div class="expand-switch-button">
      <i
        :class="`menuicon ${config.mode === 'dark' ? 'menu-icon-chevron-left-black' : 'menu-icon-chevron-left-light'}`"
        @click="handleThemePanelChange"
      />
    </div>
    <div class="setting-nav-content">
      <div class="setting-nav-title">
        {{ $t('I18N.layout.zhuTi') }}
      </div>
      <div class="setting-nav-item">
        <div>{{ $t('I18N.layout.jieMianPeiZhi') }}</div>
        <div
          class="setting-nav-sub-item"
          :class="{ active: activeModuleId === 'language' }"
          @click="handleChangeActiveModuleId('language')"
        >
          {{ $t('I18N.layout.duoYuYanSheZhi') }}
        </div>
        <div
          class="setting-nav-sub-item"
          :class="{ active: activeModuleId === 'theme' }"
          @click="handleChangeActiveModuleId('theme')"
        >
          {{ $t('I18N.layout.zhuTiFengGe') }}
        </div>
        <div
          class="setting-nav-sub-item"
          :class="{ active: activeModuleId === 'nav' }"
          @click="handleChangeActiveModuleId('nav')"
        >
          {{ $t('I18N.layout.daoHangSheZhi') }}
        </div>
      </div>
    </div>
  </div>
  <a-layout>
    <!-- <div class="setting-content"> -->
    <div class="p2 pl-16 page-top">
      <a-breadcrumb v-if="themeConfig.breadcrumb" class="breadcrumb">
        <a-breadcrumb-item v-for="item in activeBreadcrumb" :key="item.title">
          <template v-if="!item.path">
            {{ item.title }}
          </template>
          <template v-else>
            <RouterLink :to="item.path">{{ item.title }}</RouterLink>
          </template>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div class="page-title">
        <i class="zq-icon zq-icon-arrow-left"></i>
        <LeftSquareOutlined size="14" class="page-icon" />
        <!-- <div class="page-title-text">{{ $t(`${$route.meta.title}`) }}</div> -->
        <!-- 改成获取面包屑的以后一级 -->
        <div class="page-title-text">{{ pageTitle }}</div>
      </div>
    </div>
    <a-layout-content>
      <div class="h-full w-full pos-reactive">
        <RouterView />
      </div>
    </a-layout-content>
    <!-- </div> -->
  </a-layout>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';

  const menusStore = useMenusStore();
  const themeStore = useThemeStore();
  const { activeBreadcrumb } = storeToRefs(menusStore);
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  // 监听主题配置
  watchEffect(() => {
    config.value = { ...themeConfig.value };
    // menuActiveId.value = menusStore.activeId;
  });
  // 监听activeBreadcrumb的变化，当activeBreadcrumb发生变化时，更新面包屑导航的显示内容

  // activeBreadcrumb.value.push({  path: 'string',
  // title: 'string',
  // component:true,
  // })
  watch(
    () => activeBreadcrumb.value,
    (newValue) => {
      console.log('activeBreadcrumb changed:', newValue);
    }
  );

  const pageTitle = computed(() => {
    return activeBreadcrumb.value[activeBreadcrumb.value.length - 1]?.title;
  });

  const appStore = useAppStore();
  const { appConfig, themePanelVisible, activeModuleId } = storeToRefs(appStore);
  // 打开主题设置面板
  const handleThemePanelChange = () => {
    appStore.setThemePanelVisible(!themePanelVisible.value);
  };
  // 更改锚点id
  const handleChangeActiveModuleId = (id: string) => {
    appStore.changeActiveModuleId(id);
  };

  watch(
    () => [themePanelVisible.value, activeModuleId.value],
    () => {
      if (themePanelVisible.value) window.location.hash = activeModuleId.value;
    }
  );
</script>

<style lang="less" scoped>
  .setting-nav {
    width: 0;
    margin-left: 1px;
    position: relative;
    transition: width 0.3s;
    background-color: var(--color-bg-container);
    z-index: 0;

    &.expand {
      width: 198px;
      border-right: 1px solid var(--color-component-border);

      .expand-switch-button i {
        transform: rotate(0);
        transform-origin: center center;
      }
    }
    .expand-switch-button {
      position: absolute;
      right: 0;
      top: 24px;
      transform: translateX(50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      // border: 1px solid var(--color-risk-no-disabled);
      border: 1px solid var(--color-component-stroke);
      background-color: var(--color-bg-container);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-sizing: border-box;
      i {
        font-size: 16px;
        transform: rotate(180deg);
        transform-origin: center center;
      }
    }
    .setting-nav-content {
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;

      & > div {
        padding: 0 20px;
      }

      .setting-nav-title {
        font-size: 16px;
        color: var(--color-text-primarys);
        font-weight: 600;
        line-height: 24px;
        margin: 18px 0 20px;
      }

      .setting-nav-item {
        line-height: 20px;
        font-size: 12px;

        & > div:first-child {
          color: var(--color-text-placeholder);
          margin-bottom: 16px;
        }

        .setting-nav-sub-item {
          color: var(--color-text-secondary);
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          cursor: pointer;

          &::before {
            content: '';
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: var(--color-text-secondary);
            margin: 0 8px;
          }

          &.active {
            color: var(--um-primary-color-normal);

            &::before {
              background: var(--um-primary-color-normal);
            }
          }
        }
      }
    }
  }
  .breadcrumb {
    height: 40px;
    line-height: 40px;
    a {
      height: 40px;
    }
  }
  .page-top {
    background-color: var(--color-bg-container);
    border-left: 1px solid var(--color-component-stroke);
    .page-title {
      display: flex;
      height: 40px;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;
      background-color: var(--color-bg-container);
      .page-icon {
        color: var(--color-text-placeholder);
      }
      .page-title-text {
        color: var(--color-text-primarys);
        margin-left: 8px;
      }
    }
  }

  .w-full {
    background-color: var(--color-bg-page);
    border-left: 1px solid var(--color-bg-container);
  }
</style>
