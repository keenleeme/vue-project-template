<template>
  <div class="search-wrap divider">
    <a-radio-group v-model:value="tabPosition" style="margin: 8px">
      <a-radio-button value="1">{{ $t('I18N.layout.moRen') }}</a-radio-button>
      <a-radio-button value="2">{{ $t('I18N.layout.ziDingYi') }}</a-radio-button>
    </a-radio-group>
    <div class="sql-input ml-8">
      <SqlTipTree :props_allFieldList="dataSource"></SqlTipTree>
    </div>
    <a-range-picker v-model:value="timeValue" class="ml-8" :placeholder="[$t('I18N.layout.kaiShiRiQi'), $t('I18N.layout.jieShuRiQi')]" />
    <a-button class="ml-8">
      <template #icon>
        <Icon :style="{ position: 'relative', top: '2px' }">
          <template #component>
            <svg
              data-v-4c45684f=""
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
            >
              <g data-v-4c45684f="" fill="currentColor">
                <rect data-v-4c45684f="" width="16" height="16" fill="currentColor" opacity="0"></rect>
                <path
                  data-v-4c45684f=""
                  fill="currentColor"
                  fill-opacity=".9"
                  d="M8,1.2 L14.1,4.6 L14.1,11.4 L8,14.8 L1.9,11.4 L1.9,4.6 L8,1.2 Z M8,2.4 L2.9,5.2 L2.9,10.8 L8,13.6 L13.1,10.8 L13.1,5.2 L8,2.4 Z M8,5 C9.7,5 11,6.3 11,8 C11,9.7 9.7,11 8,11 C6.3,11 5,9.7 5,8 C5,6.3 6.3,5 8,5 Z M8,6 C6.9,6 6,6.9 6,8 C6,9.1 6.9,10 8,10 C9.1,10 10,9.1 10,8 C10,6.9 9.1,6 8,6 Z"
                ></path>
              </g>
            </svg>
          </template>
        </Icon>
      </template>
      {{ $t('I18N.layout.sheZhiPianHao') }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Icon, { HomeOutlined } from '@ant-design/icons-vue';
  import SqlTipTree from '@/components/sql/sql-tip-tree.vue';
  import { DataSource, InputTipExplanation } from '../options';

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
    &.divider {
      border-left: 1px solid var(--primary-divider);
      border-bottom: 1px solid var(--primary-divider);
    }
  }
  .sql-input {
    flex: 1;
  }
</style>
