<template>
  <div class="base-form-box">
    <div class="base-form-wrapper">
      <div class="base-form-header">基础信息</div>
      <div class="base-form-content">
        <a-form
          :model="formState"
          :colon="false"
          name="basic"
          :label-col="{ style: { width: '120px' } }"
          autocomplete="off"
          layout="horizontal"
          class="base-form"
        >
          <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
            <a-input v-model:value="formState.name" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item label="描述" name="desc" :rules="[{ required: true, message: '请输入描述' }]">
            <a-textarea v-model:value="formState.desc" :rows="2" placeholder="请输入描述" />
          </a-form-item>
          <a-form-item label="等级" name="level">
            <a-radio-group v-model:value="formState.level" :options="levelOptions" />
          </a-form-item>
          <a-form-item label="场景" name="scene">
            <a-select v-model:value="formState.scene" :options="[]" placeholder="请输入场景"
              ><template #suffixIcon><i class="zq-icon zq-icon-chevron-down ant-select-suffix-new"></i></template>
            </a-select>
          </a-form-item>
          <a-form-item label="动作" name="action">
            <a-radio-group v-model:value="formState.action" :options="actionOptions" />
          </a-form-item>
          <a-form-item label="地址" name="address">
            <a-select
              v-model:value="formState.address"
              class="address-select"
              :options="[{ label: '地址', value: 'location' }]"
            >
              <template #suffixIcon><i class="zq-icon zq-icon-chevron-down"></i></template>
            </a-select>
          </a-form-item>
          <a-form-item label="IP" name="ip">
            <a-input v-model:value="formState.ip" placeholder="请输入内容" />
          </a-form-item>
          <a-form-item label="附件" name="attachment">
            <a-upload v-model="formState.attachment" name="file" action="">
              <a-button>
                <template #icon>
                  <i class="zq-icon zq-icon-export up-form-icon"></i>
                </template>
                上传文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item-rest>
            <div class="upload-tip-wrapper">
              <span class="upload-tip">上传限制</span>
            </div>
          </a-form-item-rest>
        </a-form>

        <div class="base-form-footer">
          <a-button class="submit-btn" type="primary">保存</a-button>
          <a-button>恢复默认</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';

  interface FormState {
    name: string;
    desc: string;
    level: string;
    scene: string;
    action: boolean;
    address: string;
    ip: string;
    attachment: string;
  }

  const levelOptions = [
    { label: '高风险', value: 'high' },
    { label: '中风险', value: 'middle' },
    { label: '低风险', value: 'low' }
  ];
  const actionOptions = [
    { label: '允许访问', value: true },
    { label: '命令阻断', value: false }
  ];

  const formState = reactive<FormState>({
    name: '',
    desc: '',
    level: 'middle',
    scene: '',
    action: false,
    address: 'location',
    ip: '',
    attachment: ''
  });
</script>

<style lang="less" scoped>
  .base-form-box {
    padding: 24px 16px;
    height: 100%;
    .base-form-wrapper {
      height: 100%;
      background: var(--color-bg-container);
    }
    .base-form-header {
      text-indent: 16px;
      height: 46px;
      line-height: 46px;
      font-size: var(--font-size-large);
      font-weight: 600;
      color: var(--color-text-primarys);
      border-bottom: 1px solid var(--color-component-stroke);
    }
    .base-form-content {
      width: 50%;
      padding: 24px 32px;
      .base-form {
        .ant-form-item {
          margin-bottom: 24px;

          .ant-form-item-control {
            padding-left: 8px;
          }
        }
      }

      .form-item-address {
        display: flex;
        .address-select {
          width: 120px;
          margin-right: 8px;
        }
      }
      .upload-tip-wrapper {
        padding-left: 120px;
        // margin-top: 8px;
      }

      .upload-tip {
        font-size: var(--font-size-base);
        color: var(--color-text-placeholder);
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 400;
      }
      .up-form-icon {
        margin-right: 8px;
        position: relative;
        top: 1px;
      }
    }
    .base-form-footer {
      text-indent: 120px;
      margin-top: 48px;
      .submit-btn {
        margin-right: 8px;
      }
    }
  }
</style>
