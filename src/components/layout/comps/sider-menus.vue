<template>
  <a-layout-sider
    v-show="siderMenus?.length"
    v-model:collapsed="collapsed"
    :style="{ background: token.colorBgBase }"
    :trigger="null"
    collapsible
  >
    <div class="h-40 flex justify-center items-center">
      <MenuFoldOutlined v-if="!collapsed" style="font-size: 20px" @click="collapsed = true" />
      <MenuUnfoldOutlined v-if="collapsed" style="font-size: 20px" @click="collapsed = false" />
    </div>
    <a-menu
      v-model:selectedKeys="selectMenuId"
      v-model:openKeys="openKeys"
      style="height: calc(100% - 40px)"
      mode="inline"
      :items="siderMenus"
      @click="handleSelect"
    ></a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
  import { theme } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useMenusStore } from '@/store';

  // 菜单折叠逻辑
  const collapsed = ref(false);

  const { useToken } = theme;
  const { token } = useToken();
  console.log(token);

  const menusStore = useMenusStore();
  const { siderMenus, activeMenus } = storeToRefs(menusStore);
  const selectMenuId = ref<string[]>([]);
  const openKeys = ref<string[]>([]);
  watchEffect(() => {
    if (activeMenus.value.length > 1) {
      const menus = activeMenus.value.slice(0, activeMenus.value.length - 1);
      selectMenuId.value = menus.filter((item) => item.path).map((item) => item.id);
      openKeys.value = menus.filter((item) => !item.path).map((item) => item.id);
    }
  });

  const router = useRouter();
  // @ts-ignore;
  const handleSelect = ({ item }) => {
    router.push(item.path);
  };
</script>
