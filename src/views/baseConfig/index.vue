<!--
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-09-12 15:08:01
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-13 10:43:57
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="base-config-wrap">
    <div v-if="showTabs" class="tabs">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="默认选项1"></a-tab-pane>
        <a-tab-pane key="2" tab="默认选项2"></a-tab-pane>
        <a-tab-pane key="3" tab="默认选项3" disabled></a-tab-pane>
      </a-tabs>
    </div>
    <div class="base-config-content">
      <BlockArea title="密码安全设置" class="block-area">
        <template #description>
          <span class="head-description">（配置密码安全要求，防止弱口令）</span>
        </template>
        <div class="content">
          <div class="content-row">
            <span>最小密码长度设置为</span>
            <a-input-number v-model:value="minPasswordLen" :min="1" :max="80" />
            <span>位，最大密码长度设置为</span>
            <a-input-number v-model:value="maxPasswordLen" :min="1" :max="80" />
            <span>位</span>
          </div>
          <div class="content-row">
            <span>最小密码长度设置为</span>
            <a-checkbox-group v-model:value="state.checkedList" :options="plainOptions" />
          </div>
          <div class="content-row">
            <span>建议设置</span>
            <a-input-number v-model:value="timeCount" :min="1" />
            <span>天更换一次密码</span>
            <a-popover title="提示">
              <template #content>
                <p>建议每3个月更新一次</p>
              </template>
              <InfoCircleOutlined />
            </a-popover>
          </div>
        </div>
      </BlockArea>

      <BlockArea title="登录安全设置" class="block-area">
        <template #description>
          <span class="head-description">（限制用户登录失败频率和锁定方式，保护系统登录安全）</span>
        </template>
        <div class="content">
          <div class="content-row">
            <a-input-number v-model:value="loginSafeConfig.limitTime" :min="1" />
            <span>秒之内，用户尝试登录的失败次数超过</span>
            <a-input-number v-model:value="loginSafeConfig.lockCount" :min="1" />
            <span>次，锁定该</span>
            <a-radio-group v-model:value="loginSafeConfig.lockContent" name="radioGroup">
              <a-radio value="1">账户</a-radio>
              <a-radio value="2">IP</a-radio>
            </a-radio-group>
          </div>
        </div>
      </BlockArea>

      <div class="area-head">已锁定账户/IP</div>
      <BlockArea title="超时设置" class="block-area">
        <template #description>
          <span class="head-description">（保护用户数据安全，防止信息泄露）</span>
        </template>
        <div class="content">
          <div class="content-row">
            <a-input-number v-model:value="overTimeConfig" :min="1" />
            <span>分钟之内，用户无任何操作，系统将退出登录</span>
            <a-popover title="提示">
              <template #content>
                <p>建议...</p>
              </template>
              <InfoCircleOutlined />
            </a-popover>
          </div>
        </div>
      </BlockArea>

      <BlockArea title="磁盘储存设置" class="block-area">
        <template #description>
          <span class="head-description">（自动清理磁盘，防止磁盘过载）</span>
        </template>
        <div class="content">
          <div class="content-row">
            <span>当磁盘存储空间超过</span>
            <a-input-number v-model:value="diskStorageConfig" :min="1" />
            <span>%，数据将自动循环覆盖并产生告警提示</span>
          </div>
        </div>
      </BlockArea>
    </div>
    <div class="page-footer">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import BlockArea from '@/components/blockArea/index.vue';

  const showTabs = ref(true);
  const activeKey = ref('1');
  const minPasswordLen = ref<number>(8);
  const maxPasswordLen = ref<number>(20);

  const plainOptions = ['数字', '字母（大小写）', '特殊字符'];
  const state = reactive({
    indeterminate: true,
    checkAll: false,
    checkedList: ['数字', '字母（大小写）', '特殊字符']
  });
  watch(
    () => state.checkedList,
    (val) => {
      console.log(state.checkedList);
      // state.indeterminate = !!val.length && val.length < plainOptions.length;
      // state.checkAll = val.length === plainOptions.length;
    }
  );

  const timeCount = ref<number>(20);

  // 登录安全设置
  const loginSafeConfig = reactive({
    lockContent: '1', // 1-账户 2-IP
    limitTime: 30, // 限制时间（秒）
    lockCount: 6 // 登录失败次数
  });

  // 超时设置
  const overTimeConfig = ref<number>(30); // 超时时间（分钟）

  // 磁盘存储设置
  const diskStorageConfig = ref<number>(30); // 磁盘存储空间百分比

  // 保存配置信息
  const save = () => {
    console.log('保存配置信息');
  };

  // 取消配置信息
  const cancel = () => {
    console.log('取消配置信息');
  };
</script>

<style lang="less" scoped>
  .base-config-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    .tabs {
      padding: 0 16px;
    }
    .base-config-content {
      padding: 16px;
      flex-grow: 1;
      padding: 16px;
      height: 0;
      overflow-x: hidden;

      .head-description {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: var(--color-text-placeholder);
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 400;
      }

      .content {
        &-row {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 400;
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          &:last-child {
            margin-bottom: 0;
          }
          span {
            margin: 0 8px;
          }
        }
      }

      .area-head {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        // color: #FFFFFF;
        color: var(--color-text-title);
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 400;
        margin-bottom: 8px;
      }
    }

    .page-footer {
      padding: 16px;
      text-align: right;
      // border-top: 1px solid #e9eaf0;
      border-top: 1px solid var(--primary-divider);
      button {
        margin-left: 8px;
        // color: var(--color-text-content);
      }
    }
  }
</style>
