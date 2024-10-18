<template>
  <UedLogin languageValue="en" :forms="from" @handleLogin="handleLogin" systemTitle="123" :logo="logoUrl"></UedLogin>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from '@/store';
  import UedLogin from '../uedModule/login/indexComponent.vue';
  import logoUrl from '@/assets/images/demo/logo-d0293ac3.svg';

  const router = useRouter();
  const appStore = useAppStore();
  const from = ref([
    {
      type: 'login-password',
      name: '账号密码登录123',
      btnText: '登录222',
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
    // {
    //   type: 'registry-phone',
    //   name: '注册账号',
    //   btnText: '注册',
    //   items: [
    //     { type: 'ued-input', field: 'phone', label: '手机号码', icon: 'phone' },
    //     { type: 'ued-code', field: 'code', label: '手机验证码', icon: 'code-phone' },
    //     { type: 'ued-input', field: 'username', label: '用户名', icon: 'user' },
    //     { type: 'ued-password', field: 'pwd', label: '密码', icon: 'password' },
    //     { type: 'ued-password', field: 'pwdConfirm', label: '确认密码', icon: 'password' }
    //   ]
    // },
    // {
    //   type: 'forget-phone',
    //   name: '找回密码',
    //   btnText: '找回密码',
    //   items: [
    //     { type: 'ued-input', field: 'phone', label: '手机号码', icon: 'phone' },
    //     { type: 'ued-code', field: 'code', label: '手机验证码', icon: 'code-phone' },
    //     { type: 'ued-password', field: 'pwd', label: '新密码', icon: 'password' },
    //     { type: 'ued-password', field: 'pwdConfirm', label: '确认密码', icon: 'password' }
    //   ]
    // },
    {
      type: 'qr-ding',
      name: '钉钉扫码登录'
    },
    {
      type: 'qr-wx',
      name: '微信扫码登录'
    }
  ]);

  const handleLogin = (e) => {
    console.log('登录事件', e);
    appStore.setToken('dsadsadsada');
    router.replace('/');
  };
</script>
