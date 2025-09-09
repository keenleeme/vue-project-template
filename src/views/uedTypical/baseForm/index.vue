<template>
  <div class="base-form-box">
    <div class="base-form-wrapper">
      <div class="base-form-header">{{ $t('I18N.base_form.baseInfo') }}</div>
      <div class="base-form-content">
        <das-form
          :model="formState"
          :colon="false"
          name="basic"
          :label-col="{ style: { width: '120px' } }"
          autocomplete="off"
          layout="horizontal"
          class="base-form"
        >
          <das-form-item
            :label="$t('I18N.base_form.name')"
            name="name"
            :rules="[{ required: true, message: `${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.name')}` }]"
          >
            <a-input
              v-model:value="formState.name"
              :placeholder="`${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.name')}`"
            />
          </das-form-item>
          <das-form-item
            :label="$t('I18N.base_form.desc')"
            name="desc"
            :rules="[{ required: true, message: `${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.desc')}` }]"
          >
            <a-textarea
              v-model:value="formState.desc"
              :rows="2"
              :placeholder="`${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.desc')}`"
            />
          </das-form-item>
          <das-form-item :label="$t('I18N.base_form.level')" name="level">
            <a-radio-group v-model:value="formState.level" :options="levelOptions" />
          </das-form-item>
          <das-form-item :label="$t('I18N.base_form.scene')" name="scene">
            <a-select
              v-model:value="formState.scene"
              :options="[]"
              :placeholder="`${$t('I18N.base_form.pleaseEnter')}${$t('I18N.base_form.scene')}`"
              ><template #suffixIcon><i class="zq-icon zq-icon-chevron-down ant-select-suffix-new"></i></template>
            </a-select>
          </das-form-item>
          <das-form-item :label="$t('I18N.base_form.action')" name="action">
            <a-radio-group v-model:value="formState.action" :options="actionOptions" />
          </das-form-item>
          <das-form-item :label="$t('I18N.base_form.address')" name="address">
            <a-select
              v-model:value="formState.address"
              class="address-select"
              :options="[{ label: $t('I18N.layout.diZhi'), value: 'location' }]"
            >
              <template #suffixIcon><i class="zq-icon zq-icon-chevron-down"></i></template>
            </a-select>
          </das-form-item>
          <das-form-item :label="$t('I18N.base_form.ip')" name="ip">
            <a-input v-model:value="formState.ip" :placeholder="$t('I18N.base_form.pleaseEnterContent')" />
          </das-form-item>
          <das-form-item :label="$t('I18N.base_form.attachment')" name="attachment">
            <a-upload v-model="formState.attachment" name="file" action="">
              <a-button>
                <template #icon>
                  <i class="zq-icon zq-icon-upload up-form-icon"></i>
                </template>
                {{ $t('I18N.base_form.uploadFile') }}
              </a-button>
            </a-upload>
          </das-form-item>
          <a-form-item-rest>
            <div class="upload-tip-wrapper">
              <span class="upload-tip">{{ $t('I18N.base_form.uploadLimit') }}</span>
            </div>
          </a-form-item-rest>
        </das-form>

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
    { label: I18N.layout.gaoFengXian, value: 'high' },
    { label: I18N.layout.zhongFengXian, value: 'middle' },
    { label: I18N.layout.diFengXian, value: 'low' }
  ];
  const actionOptions = [
    { label: I18N.layout.yunXuFangWen, value: true },
    { label: I18N.layout.mingLingZuDuan, value: false }
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
        color: #9096a5;
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 400;
        font-size: var(--font-size-base);
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
