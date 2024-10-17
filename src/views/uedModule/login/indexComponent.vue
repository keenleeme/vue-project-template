<template>
  <ued-login-layout :forms="forms" :theme="mode" :style="background" @u-submit="handleLogin">
    <ued-logo slot="logo" :src="logo" :width="logoWidth" :height="logoHeight"></ued-logo>
    <ued-select slot="language" v-model="language" :clearable="false" :options="languageOptions"></ued-select>
    <template slot="copyright">
      <p>{{ $t('I18N.login.hangZhouAnHengXin') }}</p>
    </template>
  </ued-login-layout>
</template>

<script setup lang="ts">
  import { defineComponent, watch, defineEmits } from 'vue';
  import { defaultConfig } from '@/store/uedModule/app/defaultConfig';
  import { themeDefaultConfig } from '@/store/uedModule/theme/defaultConfig';

  let language = 'zh';
  const emit = defineEmits(['handleLogin']);

  defineComponent({
    name: 'UedLogin' // 给组件命名
  });
  console.log(defaultConfig,123,themeDefaultConfig)
  const props = defineProps({
    logoWidth: {
      type: String || Number,
      default: '180px'
    },
    logoHeight: {
      type: String || Number,
      default: '100px'
    },
    forms: {
      type: Array,
      default: () => {
        return [
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
        ];
      }
    },
    mode: {
      type: String,
      default: () => {
        return themeDefaultConfig.mode;
      }
    },
    logo: {
      type: String,
      default: '/logo.png'
    },
    background: {
      type: Object,
      default: () => {
        return {
          'background-image': `url(${defaultConfig.loginConfig.bgImage})`,
          'background-size': 'cover',
          'background-repeat': 'no-repeat'
        };
      }
    },
    languageOptions: {
      type: Object,
      default: () => {
        return [
          { label: '中文', value: 'zh' },
          { label: '英文', value: 'en' }
        ];
      }
    },
    languageValue: {
      type: String,
      default: 'zh'
    }
  });

  // const configs = reactive({
  //   copy: 'qwe',
  //   language: 'zh'
  // });

  // const forms = ref([
  //   {
  //     type: 'login-password',
  //     name: '账号密码登录',
  //     btnText: '登录',
  //     items: [
  //       {
  //         type: 'ued-input',
  //         field: 'username',
  //         label: '用户名',
  //         icon: 'user',
  //         rules: [
  //           {
  //             type: 'string',
  //             required: true,
  //             message: '请输入用户名',
  //             min: 3
  //           }
  //         ]
  //       },
  //       {
  //         type: 'ued-password',
  //         field: 'password',
  //         label: '密码',
  //         icon: 'password',
  //         rules: {
  //           type: 'string',
  //           min: 6,
  //           validator: (rule: any, value: any, cab: any) => {
  //             if (value.length < 6) {
  //               cab(new Error('密码不得小于6位'));
  //             }
  //             cab();
  //           }
  //         }
  //       },
  //       {
  //         type: 'ued-code-image',
  //         field: 'verifyCode',
  //         label: '验证码',
  //         icon: 'code'
  //       }
  //     ]
  //   },
  //   {
  //     type: 'login-phone',
  //     name: '手机验证码登录',
  //     btnText: '登录',
  //     items: [
  //       {
  //         type: 'ued-input',
  //         field: 'username',
  //         label: '手机号码',
  //         icon: 'phone',
  //         rules: [
  //           {
  //             type: 'string',
  //             min: 2,
  //             max: 6,
  //             required: true
  //           }
  //         ]
  //       },
  //       {
  //         type: 'ued-password',
  //         field: 'password',
  //         label: '密码',
  //         icon: 'password',
  //         rules: {
  //           type: 'string',
  //           min: 12
  //         }
  //       },
  //       {
  //         type: 'ued-code',
  //         field: 'verifyCode',
  //         label: '验证码',
  //         icon: 'code',
  //         api: () => {
  //           return new Promise((resolve) => {
  //             setTimeout(() => {
  //               resolve(true);
  //             }, 2000);
  //           });
  //         }
  //       },
  //       {
  //         type: 'ued-touch-bar',
  //         field: 'touchVerify',
  //         label: '滑块验证'
  //       }
  //     ]
  //   },
  //   {
  //     type: 'registry-phone',
  //     name: '注册账号',
  //     btnText: '注册',
  //     items: [
  //       { type: 'ued-input', field: 'phone', label: '手机号码', icon: 'phone' },
  //       { type: 'ued-code', field: 'code', label: '手机验证码', icon: 'code-phone' },
  //       { type: 'ued-input', field: 'username', label: '用户名', icon: 'user' },
  //       { type: 'ued-password', field: 'pwd', label: '密码', icon: 'password' },
  //       { type: 'ued-password', field: 'pwdConfirm', label: '确认密码', icon: 'password' }
  //     ]
  //   },
  //   {
  //     type: 'forget-phone',
  //     name: '找回密码',
  //     btnText: '找回密码',
  //     items: [
  //       { type: 'ued-input', field: 'phone', label: '手机号码', icon: 'phone' },
  //       { type: 'ued-code', field: 'code', label: '手机验证码', icon: 'code-phone' },
  //       { type: 'ued-password', field: 'pwd', label: '新密码', icon: 'password' },
  //       { type: 'ued-password', field: 'pwdConfirm', label: '确认密码', icon: 'password' }
  //     ]
  //   },
  //   {
  //     type: 'qr-ding',
  //     name: '钉钉扫码登录'
  //   },
  //   {
  //     type: 'qr-wx',
  //     name: '微信扫码登录'
  //   }
  // ]);
  // const options = ref([
  //   { label: '中文', value: 'zh' },
  //   { label: '英文', value: 'en' }
  // ]);

  // const background = computed(() => {
  //   return {
  //     'background-image': `url(${appConfig.value?.loginBg})`,
  //     'background-size': 'cover',
  //     'background-repeat': 'no-repeat'
  //   };
  // });

  const handleLogin = (e: CustomEvent) => {
    console.log(e.detail);
    emit('handleLogin', e);
    // appStore.setToken('dsadsadsada');
    // router.replace('/');
  };

  watch(
    () => props.languageValue,
    (newV) => {
      language = newV;
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
