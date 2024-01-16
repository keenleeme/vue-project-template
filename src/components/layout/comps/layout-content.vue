<template>
  <a-layout>
    <div
      class="p2 pl-16 h-28 flex"
      :style="{ 'background-color': token.colorBgBase, borderLeft: `1px solid ${token.colorBorder}` }"
    >
      <a-breadcrumb>
        <template #separator>
          <RightOutlined style="vertical-align: revert-layer; font-size: 14px" />
        </template>
        <a-breadcrumb-item v-for="item in activeBreadcrumb" :key="item.title">
          <template v-if="!item.path">
            {{ item.title }}
          </template>
          <template v-else>
            <RouterLink :to="item.path">{{ item.title }}</RouterLink>
          </template>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-layout-content>
      <div class="h-full w-full p16px">
        <RouterView />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
  import { RouterView, useRouter } from 'vue-router';
  import { RightOutlined } from '@ant-design/icons-vue';
  import { theme } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useMenusStore } from '@/store';

  const { useToken } = theme;
  const { token } = useToken();

  const router = useRouter();
  const menusStore = useMenusStore();
  const { activeBreadcrumb } = storeToRefs(menusStore);
</script>
