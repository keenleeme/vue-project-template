<template>
  <ued-login-layout
    ref="loginLayout"
    :forms="forms"
    :theme="loginConfig.mode"
    :bgImage="loginConfig.mode === 'dark' ? loginConfig.bgImageDark : loginConfig.bgImage"
    :bg-video="loginConfig.bgVideo"
    :bg-attrs="{
      poster: loginConfig.bgPoster
    }"
    :class="loginConfig.language === 'en' ? 'loginEnglish' : ''"
    @u-submit="handleSubmit"
  >
    <ued-logo
      slot="logo"
      :key="loginConfig.logoMode"
      :src="loginConfig.logoUrl"
      :mode="loginConfig.logoMode"
      width="auto"
      height="60px"
    >
      {{ loginConfig.logoMode && [LogoModeEnums.IMAGE].includes(loginConfig.logoMode) ? '' : loginConfig.logoName }}
    </ued-logo>
    <ued-select
      v-if="loginConfig.showLanguage"
      slot="language"
      v-model="language"
      :clearable="false"
      :options="options"
      @u-change="handleLocaleChangeA"
    ></ued-select>
    <div slot="copyright">
      <template v-for="(item, idx) in loginConfig.copyright" :key="idx">
        <a v-if="item.link" target="_blank" :href="item.link">{{ item.text }}</a>
        <div v-else>{{ item.text }}</div>
      </template>
    </div>
  </ued-login-layout>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { changeLocale } from '@international/vue3-i18n';
  import { message } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { onLogin, onRegister, getCaptcha, getLoginRedirectUrl } from '@/api/common';
  import { useAppStore, useLoginStore, useThemeStore, useUserStore } from '@/store';
  import { LoginConfigDTO, LogoModeEnums } from './types';

  const appStore = useAppStore();
  const loginStore = useLoginStore();
  const userStore = useUserStore();
  const router = useRouter();
  const { themeConfig } = storeToRefs(useThemeStore());

  const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO(loginStore.loginConfig));
  const language = ref();
  const resiterPassword = ref('');
  const loginLayout = ref();
  const captchaId = ref('');
  const forms = ref([
    {
      type: 'login-password',
      name: I18N.layout.zhangHaoMiMaDengLu,
      btnText: I18N.common.login,
      items: [
        {
          type: 'ued-input',
          field: 'username',
          label: `${I18N.common.username}`,
          icon: 'user',
          rules: [
            {
              type: 'string',
              required: true,
              message: I18N.login.qingShuRuYongHu,
              min: 3
            }
          ]
        },
        {
          type: 'ued-password',
          field: 'password',
          label: I18N.common.password,
          icon: 'password',
          rules: {
            type: 'string',
            min: 6,
            validator: (_, value: any, cab: any) => {
              if (value.length < 6) {
                cab(new Error(I18N.layout.miMaBuDeXiaoYu));
              }
              cab();
            }
          }
        },
        {
          type: 'ued-code-image',
          field: 'verifyCode',
          label: I18N.layout.yanZhengMa,
          icon: 'code',
          api: () => {
            return new Promise((resolve) => {
              getCaptcha().then((res) => {
                captchaId.value = res.data.captchaId;
                resolve(res.data.captchaBase64);
              });
            });
          }
        }
      ]
    },
    {
      type: 'login-phone',
      name: I18N.layout.shouJiYanZhengMaDengLu,
      btnText: I18N.common.login,
      items: [
        {
          type: 'ued-input',
          field: 'username',
          label: I18N.layout.shouJiHaoMa,
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
          label: I18N.common.password,
          icon: 'password',
          rules: {
            type: 'string',
            min: 12
          }
        },
        {
          type: 'ued-code',
          field: 'verifyCode',
          label: I18N.layout.yanZhengMa,
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
          label: I18N.layout.huaKuaiYanZheng
        }
      ]
    },
    {
      type: 'registry-phone',
      name: I18N.layout.zhuCeZhangHao,
      btnText: I18N.common.signup,
      items: [
        { type: 'ued-input', field: 'phone', label: I18N.layout.shouJiHaoMa, icon: 'phone' },
        { type: 'ued-code', field: 'code', label: I18N.layout.shouJiYanZhengMa, icon: 'code-phone' },
        { type: 'ued-input', field: 'username', label: I18N.common.username, icon: 'user' },
        {
          type: 'ued-password',
          field: 'password',
          label: I18N.common.password,
          icon: 'password',
          rules: [
            {
              type: 'string',
              min: 6,
              required: true,
              validator: (rule: any, value: any, cab: any) => {
                resiterPassword.value = value;
                if (value.length < 6) {
                  cab(new Error(I18N.layout.miMaBuDeXiaoYu));
                }
                cab();
              }
            }
          ]
        },
        {
          type: 'ued-password',
          field: 'passwordConfirm',
          label: I18N.layout.queRenMiMa,
          icon: 'password',
          rules: [
            {
              type: 'string',
              min: 6,
              required: true,
              validator: (rule: any, value: any, cab: any) => {
                if (value !== resiterPassword.value) {
                  cab(new Error(I18N.layout.miMaBuXiangTong));
                }
                cab();
              }
            }
          ]
        }
      ]
    },
    {
      type: 'forget-phone',
      name: I18N.layout.zhaoHuiMiMa,
      btnText: I18N.layout.zhaoHuiMiMa,
      items: [
        { type: 'ued-input', field: 'phone', label: I18N.layout.shouJiHaoMa, icon: 'phone' },
        { type: 'ued-code', field: 'code', label: I18N.layout.shouJiYanZhengMa, icon: 'code-phone' },
        { type: 'ued-password', field: 'pwd', label: I18N.layout.xinMiMa, icon: 'password' },
        { type: 'ued-password', field: 'pwdConfirm', label: I18N.layout.queRenMiMa, icon: 'password' }
      ]
    },
    {
      type: 'qr-ding',
      name: I18N.layout.dingDingSaoMa,
      items: [
        {
          api: () => {
            return new Promise(async (resolve) => {
              await handleLoginRedirect();
              resolve(true);
            });
          }
        }
      ]
    }
  ]);
  const options = ref([
    { label: '中文', value: 'zh' },
    { label: 'English', value: 'en' }
  ]);

  const handleSubmit = (e: CustomEvent) => {
    console.log(e.detail);
    const { data } = e.detail;
    if (e.detail.type === 'login-password') {
      handleLogin(data);
    } else if (e.detail.type === 'registry-phone') {
      handleRegistry(data);
    }
  };

  const handleLogin = (data) => {
    onLogin({ ...data, captchaId: captchaId.value }).then((res) => {
      if (res.code === 200) {
        userStore.setToken(res.data.accessToken);
        userStore.setUserInfo(res.data.user);
        message.success(res.message);
        setTimeout(() => {
          router.replace('/');
        }, 1000);
      } else {
        message.error(res.message);
      }
    });
  };

  const handleRegistry = (data) => {
    onRegister(data).then((res) => {
      if (res.code === 200) {
        message.success(res.message);
        loginLayout.value.setType('login-password');
      } else {
        message.error(res.message);
      }
    });
  };

  const handleLocaleChangeA = (e: CustomEvent<{ data: string }>) => {
    const locale = e.detail.data === 'en' ? 'en' : 'zh';
    themeConfig.value = { ...themeConfig.value, lang: locale };
    changeLocale(locale);
    loginStore.set({ language: locale });
    window.location.reload();
  };

  const handleLoginRedirect = async () => {
    const res = await getLoginRedirectUrl();
    if (res.code === 200) {
      window.location.href = res.data.redirectUrl;
    }
  };

  watch(
    loginStore.loginConfig,
    (v) => {
      loginConfig.value = Object.assign(loginConfig.value, v);
      loginConfig.value.language = window.localStorage.getItem('das-intl-locale') || 'zh';
      language.value = loginConfig.value.language;
      // console.log('appConfig-changes:', loginConfig.value, loginConfig.value.language);
    },
    { deep: true, immediate: true }
  );
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
