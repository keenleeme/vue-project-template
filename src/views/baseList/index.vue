<template>
  <div class="table-wrap">
    <div v-if="showTabs" class="tabs">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Tab 1">{{ $t('I18N.layout.moRenXuanXiang') }}</a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" disabled>{{ $t('I18N.layout.yiXuanXuanXiang') }}</a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">{{ $t('I18N.layout.moRenXuanXiang') }}</a-tab-pane>
      </a-tabs>
    </div>

    <ListComponent></ListComponent>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ListComponent from './components/list.vue';

  const showTabs = ref(false);
  const activeKey = ref('1');
</script>
