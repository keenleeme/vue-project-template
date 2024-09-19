<template>
  <div class="search-wrap">
    <a-radio-group v-model:value="tabPosition" style="margin: 8px">
      <a-radio-button value="1">默认</a-radio-button>
      <a-radio-button value="2">自定义</a-radio-button>
    </a-radio-group>
    <div class="sql-input ml-8">
      <SqlTipTree :props_allFieldList="dataSource"></SqlTipTree>
    </div>
    <a-range-picker v-model:value="timeValue" class="ml-8" />
    <a-button class="ml-8">
      <template #icon>
        <SettingOutlined />
      </template>
      设置偏好
    </a-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { SettingOutlined } from '@ant-design/icons-vue';
  import SqlTipTree from '@/components/sql/sql-tip-tree.vue';
  import { DataSource, InputTipExplanation } from './../options';

  const tabPosition = ref('1');
  const timeValue = ref();
  const dataSource = ref(DataSource);
</script>

<style lang="less" scoped>
  .search-wrap {
    display: flex;
    height: 64px;
    align-items: center;
    padding: 0 16px;
    background: var(--primary-bg);
  }
  .sql-input {
    flex: 1;
  }
</style>
