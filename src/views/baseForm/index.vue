<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="base-form-box">
    <div class="base-form-wrapper">
      <div class="base-form-header">{{ $t('I18N.base_form.baseInfo') }}</div>
      <div class="base-form-content">
        <a-form
          :model="formState"
          :colon="false"
          name="basic"
          :label-col="{ style: { width: '120px' } }"
          autocomplete="off"
        >
          <a-form-item
            :label="$t('I18N.base_form.name')"
            name="name"
            :rules="[{ required: true, message: `${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.name')}` }]"
          >
            <a-input
              v-model:value="formState.name"
              :placeholder="`${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.name')}`"
            />
          </a-form-item>
          <a-form-item
            :label="$t('I18N.base_form.desc')"
            name="desc"
            :rules="[{ required: true, message: `${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.desc')}` }]"
          >
            <a-textarea
              v-model:value="formState.desc"
              :rows="2"
              :placeholder="`${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.desc')}`"
            />
          </a-form-item>
          <a-form-item :label="$t('I18N.base_form.level')" name="level">
            <a-radio-group v-model:value="formState.level" :options="levelOptions" />
          </a-form-item>
          <a-form-item :label="$t('I18N.base_form.scene')" name="scene">
            <a-select
              v-model:value="formState.scene"
              :options="[]"
              :placeholder="`${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.scene')}`"
            />
          </a-form-item>
          <a-form-item :label="$t('I18N.base_form.action')" name="action">
            <a-radio-group v-model:value="formState.action" :options="actionOptions" />
          </a-form-item>
          <a-form-item :label="$t('I18N.base_form.address')" name="address">
            <div class="form-item-address">
              <a-select
                v-model:value="formState.address"
                class="address-select"
                :options="[{ label: '地址', value: 'location' }]"
              />
              <a-input v-model:value="formState.ip" :placeholder="$t('I18N.base_form.pleaseEnterContent')" />
            </div>
          </a-form-item>
          <a-form-item :label="$t('I18N.base_form.attachment')" name="attachment">
            <a-upload v-model="formState.attachment" name="file" action="">
              <a-button>
                <template #icon>
                  <UploadOutlined />
                </template>
                {{ $t('I18N.base_form.uplaodFile') }}
              </a-button>
            </a-upload>
            <span class="upload-tip">{{ $t('I18N.base_form.uploadLimit') }}</span>
          </a-form-item>
        </a-form>

        <div class="base-form-footer">
          <a-button class="submit-btn" type="primary">{{ $t('I18N.base_form.save') }}</a-button>
          <a-button>{{ $t('I18N.base_form.resetDefault') }}</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { UploadOutlined } from '@ant-design/icons-vue';

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
      background: var(--primary-bg);
    }
    .base-form-header {
      text-indent: 16px;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      font-weight: 600;
      border-bottom: 1px solid var(--primary-divider);
    }
    .base-form-content {
      width: 50%;
      padding: 24px 0;
      .form-item-address {
        display: flex;
        .address-select {
          width: 120px;
          margin-right: 8px;
        }
      }
      .upload-tip {
        font-size: 12px;
        color: #9096a5;
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 400;
        font-size: 12px;
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
