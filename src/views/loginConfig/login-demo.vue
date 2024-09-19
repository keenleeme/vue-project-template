<template>
  <ued-login-layout
    :class="{ 'is-small': !fullscreen }"
    :forms="forms"
    :theme="loginConfig.mode"
    :bg-image="loginConfig.bgImage"
    :bg-video="loginConfig.bgVideo"
    :bg-attrs="{
      poster: loginConfig.bgPoster
    }"
  >
    <div v-if="loginConfig.logoMode" slot="logo">
      <ued-logo
        :key="loginConfig.logoMode"
        :src="loginConfig.logoUrl"
        :mode="loginConfig.logoMode"
        width="110px"
        height="60px"
      >
        {{ [LogoModeEnums.IMAGE].includes(loginConfig.logoMode) ? '' : loginConfig.logoName }}
      </ued-logo>
    </div>
    <ued-select
      v-if="loginConfig.showLanguage"
      slot="language"
      :clearable="false"
      :options="config.languages"
    ></ued-select>
    <div slot="copyright">
      <div>{{ loginConfig.slogan }}</div>
      <div>{{ loginConfig.copyright }}</div>
      <div>
        <a style="color: #333; margin-top: 6px" target="_blank" :src="loginConfig.filingUrl || 'javascript:;'">{{
          loginConfig.filing
        }}</a>
      </div>
      <div>
        <a style="color: #333; margin-top: 6px" target="_blank" :src="loginConfig.icpUrl || 'javascript:;'">{{
          loginConfig.icp
        }}</a>
      </div>
    </div>
  </ued-login-layout>
</template>

<script setup lang="ts">
  import type { FormDto } from '@ued-material/ued-wbc/dist/types/types';
  import { LoginConfigDTO, LogoModeEnums } from '../login/types';
  import * as config from './index';

  withDefaults(
    defineProps<{
      fullscreen?: boolean;
      forms: FormDto[];
      loginConfig: LoginConfigDTO;
    }>(),
    {}
  );
</script>

<style lang="less" scoped>
  ued-login-layout {
    --ued-login-primary-color: var(--um-primary-color-normal);
    height: 100%;
    ued-select {
      --ued-control-bg: transparent;
      --ued-control-border-width: 0;
      --ued-control-inner-width: 100px;
      :deep(input) {
        text-align: right;
      }
      :deep(.ued-form-control),
      :deep(.ued-form-control):hover {
        box-shadow: none !important;
      }
    }
    :deep(.dark) {
      --ued-login-primary-color: var(--um-dark-primary-color-normal);
    }
  }

  ued-login-layout.is-small {
    --ued-login-primary-color: var(--um-primary-color-normal);
    --ued-login-form-width: 400px;
    --ued-login-form-height-min: 400px;
    --ued-login-form-right: 0;
    --ued-logo-top: 16px;
    --ued-logo-left: 16px;
    --ued-language-top: 0;
    --ued-language-right: 0;
    position: relative;
    width: 100%;
    height: 400px;
    :deep(.ued-login),
    :deep(.ued-login-bg) {
      position: absolute;
    }
    :deep(.login-form-box) {
      transform: scale(0.5);
    }
    :deep(.ued-login-language) {
      transform: scale(0.6);
      .ued-popover {
        top: 41px !important;
        left: 50px !important;
        right: 0 !important;
      }
    }
  }
</style>
