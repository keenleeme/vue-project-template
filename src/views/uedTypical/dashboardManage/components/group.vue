<template>
  <div class="group-wrap">
    <div class="group-title">仪表盘挂载分组</div>
    <div class="group-list">
      <div
        class="group-item"
        :class="{ active: activeKey === item.key }"
        v-for="item in props.dataSource"
        :key="item.key"
        @click="handleClick(item)"
      >
        <FolderOutlined></FolderOutlined>
        <span class="name">{{ item.name }}</span>
        <span class="count">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { FolderOutlined } from '@ant-design/icons-vue';

  const activeKey = ref<string>('1');

  const router = useRouter();
  console.log(router);

  interface IProps {
    dataSource?: any[];
  }

  const props = withDefaults(defineProps<IProps>(), {
    dataSource: () => []
  });

  function handleClick(item: any) {
    activeKey.value = item.key;
  }
</script>

<style lang="less" scoped>
  .group-wrap {
    width: 208px;
    .group-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 46px;
      font-size: 14px;
      color: var(--color-text-primarys);
      line-height: 22px;
      font-weight: 600;
      border-bottom: 1px solid var(--color-component-stroke);
      padding: 0 16px;
    }
    .group-list {
      padding: 16px 16px;
      .group-item {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 176px;
        height: 34px;
        font-size: 14px;
        padding: 0 8px;
        cursor: pointer;
        &.active {
          background-color: var(--color-brand-light);
        }
        .name {
          display: inline-block;
          width: calc(100% - 64px);
          height: 34px;
          line-height: 34px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0 8px 0 8px;
        }
        .count {
          position: absolute;
          right: 8px;
          top: 0;
          display: inline-block;
          height: 34px;
          line-height: 34px;
          color: var(--color-text-placeholder);
        }
      }
    }
  }
</style>
