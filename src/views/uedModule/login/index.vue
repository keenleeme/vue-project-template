<template>
  <ued-login-layout
    :forms="forms"
    :theme="loginConfig.mode"
    :bg-image="loginConfig.bgImage"
    :bg-video="loginConfig.bgVideo"
    :bg-attrs="{
      poster: loginConfig.bgPoster
    }"
    @u-submit="handleLogin"
  >
    <ued-logo
      slot="logo"
      :key="loginConfig.logoMode"
      :src="loginConfig.logoUrl"
      :mode="loginConfig.logoMode"
      width="110px"
      height="60px"
    >
      {{ loginConfig.logoMode && [LogoModeEnums.IMAGE].includes(loginConfig.logoMode) ? '' : loginConfig.logoName }}
    </ued-logo>
    <ued-select
      v-if="loginConfig.showLanguage"
      slot="language"
      v-model="loginConfig.language"
      :clearable="false"
      :options="options"
    ></ued-select>
    <div slot="copyright">
      <div>{{ loginConfig.slogan }}</div>
      <div>{{ loginConfig.copyright }}</div>
      <div>
        <a target="_blank" :src="loginConfig.filingUrl || 'javascript:;'">{{
          loginConfig.filing
        }}</a>
      </div>
      <div>
        <a target="_blank" :src="loginConfig.icpUrl || 'javascript:;'">{{
          loginConfig.icp
        }}</a>
      </div>
    </div>
  </ued-login-layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/store';
  import { LoginConfigDTO, LogoModeEnums } from './types';

  const appStore = useAppStore();
  const router = useRouter();
  const { appConfig } = storeToRefs(appStore);

  const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO(appConfig.value.loginConfig));

  const forms = ref([
    {
      type: 'login-password',
      name: '账号密码登录',
      btnText: '登录',
      items: [
        {
          type: 'ued-input',
          field: 'username',
          label: '用户名',
          icon: 'user',
          rules: [
            {
              type: 'string',
              required: true,
              message: '请输入用户名',
              min: 3
            }
          ]
        },
        {
          type: 'ued-password',
          field: 'password',
          label: '密码',
          icon: 'password',
          rules: {
            type: 'string',
            min: 6,
            validator: (rule: any, value: any, cab: any) => {
              if (value.length < 6) {
                cab(new Error('密码不得小于6位'));
              }
              cab();
            }
          }
        },
        {
          type: 'ued-code-image',
          field: 'verifyCode',
          label: '验证码',
          icon: 'code'
        }
      ]
    },
    {
      type: 'login-phone',
      name: '手机验证码登录',
      btnText: '登录',
      items: [
        {
          type: 'ued-input',
          field: 'username',
          label: '手机号码',
          icon: 'phone',
          rules: [
            {
              type: 'string',
              min: 2,
              max: 6,
              required: true
            }
          ]
        },
        {
          type: 'ued-password',
          field: 'password',
          label: '密码',
          icon: 'password',
          rules: {
            type: 'string',
            min: 12
          }
        },
        {
          type: 'ued-code',
          field: 'verifyCode',
          label: '验证码',
          icon: 'code',
          api: () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(true);
              }, 2000);
            });
          }
        },
        {
          type: 'ued-touch-bar',
          field: 'touchVerify',
          label: '滑块验证'
        }
      ]
    },
    {
      type: 'registry-phone',
      name: '注册账号',
      btnText: '注册',
      items: [
        { type: 'ued-input', field: 'phone', label: '手机号码', icon: 'phone' },
        { type: 'ued-code', field: 'code', label: '手机验证码', icon: 'code-phone' },
        { type: 'ued-input', field: 'username', label: '用户名', icon: 'user' },
        { type: 'ued-password', field: 'pwd', label: '密码', icon: 'password' },
        { type: 'ued-password', field: 'pwdConfirm', label: '确认密码', icon: 'password' }
      ]
    },
    {
      type: 'forget-phone',
      name: '找回密码',
      btnText: '找回密码',
      items: [
        { type: 'ued-input', field: 'phone', label: '手机号码', icon: 'phone' },
        { type: 'ued-code', field: 'code', label: '手机验证码', icon: 'code-phone' },
        { type: 'ued-password', field: 'pwd', label: '新密码', icon: 'password' },
        { type: 'ued-password', field: 'pwdConfirm', label: '确认密码', icon: 'password' }
      ]
    },
    {
      type: 'qr-ding',
      name: '钉钉扫码登录'
    },
    {
      type: 'qr-wx',
      name: '微信扫码登录'
    }
  ]);
  const options = ref([
    { label: '中文', value: 'zh' },
    { label: '英文', value: 'en' }
  ]);

  const handleLogin = (e: CustomEvent) => {
    console.log(e.detail);
    appStore.setToken('dsadsadsada');
    router.replace('/');
  };

  watch(
    appConfig.value.loginConfig,
    (v) => {
      loginConfig.value = Object.assign(loginConfig.value, v);
      console.log('appConfig-changes:', loginConfig.value);
    },
    { deep: true, immediate: true }
  );
  watch(
    loginConfig,
    (v) => {
      console.log('loginConfig-changes:', v);
    },
    { deep: true }
  );
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
