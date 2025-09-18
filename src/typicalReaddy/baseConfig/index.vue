<template>
  <div class="base-config-wrap">
    <div v-if="showTabs" class="tabs">
      <a-tabs v-model:active-key="activeKey">
        <a-tab-pane key="1" tab="默认选项1"></a-tab-pane>
        <a-tab-pane key="2" tab="默认选项2"></a-tab-pane>
        <a-tab-pane key="3" tab="默认选项3" disabled></a-tab-pane>
      </a-tabs>
    </div>
    <div class="base-config-content">
      <div class="block-area">
        <div class="block-header">
          <div class="block-title">密码安全设置</div>
          <div class="block-description">（配置密码安全要求）</div>
        </div>
        <div class="block-content">
          <div class="content-row">
            <span>最小密码长度</span>
            <a-input-number v-model:value="minPasswordLen" :min="1" :max="80" />
            <span>位，最大密码长度</span>
            <a-input-number v-model:value="maxPasswordLen" :min="1" :max="80" />
            <span>位</span>
          </div>
          <div class="content-row">
            <span>密码复杂度</span>
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
      </div>

      <div class="block-area">
        <div class="block-header">
          <div class="block-title">登录安全设置</div>
          <div class="block-description">（限制用户登录方式）</div>
        </div>
        <div class="block-content">
          <div class="content-row">
            <a-input-number v-model:value="loginSafeConfig.limitTime" :min="1" />
            <span>秒之内</span>
            <a-input-number v-model:value="loginSafeConfig.lockCount" :min="1" />
            <span>次锁定</span>
            <a-radio-group v-model:value="loginSafeConfig.lockContent" name="radioGroup">
              <a-radio value="1">账户</a-radio>
              <a-radio value="2">IP</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <div class="area-head">锁定账户/IP</div>
      <div class="block-area">
        <div class="block-header">
          <div class="block-title">超时设置</div>
          <div class="block-description">（保护用户数据安全）</div>
        </div>
        <div class="block-content">
          <div class="content-row">
            <a-input-number v-model:value="overTimeConfig" :min="1" />
            <span>分钟之内用户无操作</span>
            <a-popover title="提示">
              <template #content>
                <p>建议...</p>
              </template>
              <InfoCircleOutlined />
            </a-popover>
          </div>
        </div>
      </div>

      <div class="block-area">
        <div class="block-header">
          <div class="block-title">磁盘存储设置</div>
          <div class="block-description">（自动清理磁盘）</div>
        </div>
        <div class="block-content">
          <div class="content-row">
            <span>当磁盘空间超过</span>
            <a-input-number v-model:value="diskStorageConfig" :min="1" />
            <span>%，数据将自动循环覆盖</span>
          </div>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';

  const showTabs = ref(true);
  const activeKey = ref('1');
  const minPasswordLen = ref<number>(8);
  const maxPasswordLen = ref<number>(20);
  const plainOptions = ['数字', '字母大小写', '特殊字符'];
  const state = reactive({
    checkedList: ['数字', '字母大小写', '特殊字符']
  });
  watch(
    () => state.checkedList,
    () => {
      console.log(state.checkedList);
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
      background-color: var(--color-bg-container);
      :deep(.ant-tabs) {
        .ant-tabs-nav {
          margin-bottom: 0;
          padding: 0 16px;
        }
      }
    }
    .base-config-content {
      padding: 16px;
      flex-grow: 1;
      height: 0;
      overflow-x: hidden;

      .head-description {
        font-size: var(--font-size-base);
        color: var(--color-text-placeholder);
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 400;
      }

      .content {
        &-row {
          font-size: var(--font-size-base);
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 400;
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          &:last-child {
            margin-bottom: 0;
          }
          span:not(:first-child) {
            margin: 0 8px;
          }
          span:first-child {
            margin-right: 8px;
          }
          .ant-radio-wrapper,
          :deep(.ant-checkbox-wrapper) {
            font-size: var(--font-size-small) !important;
          }
        }
      }

      .block-area {
        margin-bottom: 16px;
        background: var(--color-bg-container);
        // border-radius: 6px;
        // border: 1px solid var(--color-component-stroke);

        .block-header {
          padding: 16px 16px 8px;
          border-bottom: 1px solid var(--color-component-stroke);
          display: flex;
          align-items: baseline;
          gap: 8px;

          .block-title {
            font-size: 12px;
            color: var(--color-text-primarys);
            line-height: 24px;
            margin: 0;
            font-weight: bold;
          }

          .block-description {
            font-size: 12px;
            color: var(--color-text-placeholder);
            letter-spacing: 0;
            line-height: 20px;
            font-weight: 400;
            margin: 0;
          }
        }

        .block-content {
          padding: 24px;
        }
      }

      .area-head {
        font-size: 14px;
        color: var(--color-text-primarys);
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 600;
        margin-bottom: 12px;
        padding-left: 8px;
      }
    }

    .page-footer {
      padding: 16px;
      text-align: right;
      border-top: 1px solid var(--color-component-stroke);
      background-color: var(--color-bg-container);
      button {
        margin-left: 8px;
      }
    }
  }
</style>
