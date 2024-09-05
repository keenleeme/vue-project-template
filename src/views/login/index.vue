<template>
  <ued-login-layout :forms="forms" :style="background" @u-submit="handleLogin">
    <ued-logo slot="logo" src="/logo.png" width="180" height="100"></ued-logo>
    <ued-select slot="language" v-model="configs.language" :clearable="false" :options="options"></ued-select>
    <div slot="copyright">
      <p>{{ $t('I18N.login.hangZhouAnHengXin') }}</p>
    </div>
  </ued-login-layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
  const router = useRouter();
  const { appConfig } = storeToRefs(appStore);
  const configs = reactive({
    copy: 'qwe',
    language: 'zh'
  });

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

  const background = computed(() => {
    return {
      'background-image': `url(${appConfig.value?.loginBg})`,
      'background-size': 'cover',
      'background-repeat': 'no-repeat'
    };
  });

  const handleLogin = (e: CustomEvent) => {
    console.log(e.detail);
    appStore.setToken('dsadsadsada');
    router.replace('/');
  };

  watch(
    configs,
    (v) => {
      console.log('config-changes:', v);
    },
    { deep: true }
  );
</script>

<style lang="less" scoped>
  ued-login-layout {
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
  }
</style>
