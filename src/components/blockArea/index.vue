<!--
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-09-02 09:22:41
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-13 10:14:33
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
import UedMaterialMenu from '@ued-material/menu';
<template>
  <div class="page-item">
    <div class="page-item-title">
      <span>{{ title }}</span>
      <div>
        <slot name="description"></slot>
      </div>
    </div>
    <div class="page-item-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({ title: String });
</script>

<style lang="less" scoped>
  .page-item {
    // background-color: #fff;
    background-color: var(--primary-bg);
    margin-bottom: 16px;
    &-title {
      display: flex;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      // color: #1e2345;
      color: var(--color-text-title);
      line-height: 24px;
      font-weight: 600;
      padding: 12px 16px;
      // border-bottom: 1px solid #e9eaf0;
      border-bottom: 1px solid var(--primary-divider);
    }

    &-content {
      padding: 24px;
      display: flex;
      flex-direction: row;
      color: var(--color-text-title);

      & > div {
        width: 50%;
      }
    }
  }
</style>
