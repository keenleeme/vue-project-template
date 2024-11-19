<template>
  <ued-login-layout
    :forms="forms"
    :theme="loginConfig.mode"
    :bgImage="loginConfig.bgImage"
    :bg-video="loginConfig.bgVideo"
    :bg-attrs="{
      poster: loginConfig.bgPoster
    }"
    @u-submit="handleLogin"
    :class="loginConfig.language === 'en'?'loginEnglish':''"
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useAppStore,useThemeStore } from '@/store';
  import { LoginConfigDTO, LogoModeEnums } from './types';
  import { changeLocale } from '@international/vue3-i18n';
  import { setI18n } from '@ued-material/ued-wbc/api'

  const appStore = useAppStore();
  const router = useRouter();
  const { appConfig } = storeToRefs(appStore);
  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);

  const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO(appConfig.value.loginConfig));
  const language = ref()
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
            validator: (rule: any, value: any, cab: any) => {
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
          label: I18N.layout.huaKuaiYanZheng,
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
        { type: 'ued-password', field: 'pwd', label: I18N.common.password, icon: 'password' },
        { type: 'ued-password', field: 'pwdConfirm', label: I18N.layout.queRenMiMa, icon: 'password' }
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
    },
    {
      type: 'qr-wx',
      name: I18N.layout.weiXinSaoMa,
    }
  ]);
  const options = ref([
    { label: '中文', value: 'zh' },
    { label: 'English', value: 'en' }
  ]);

  const handleLogin = (e: CustomEvent) => {
    console.log(e.detail);
    appStore.setToken('dsadsadsada');
    router.replace('/');
  };

  const handleLocaleChangeA = (e: CustomEvent<{ data: string }>)=>{
    let locale = e.detail.data === 'en'?'en':'zh';
    changeLocale(locale);
    window.location.reload();
  }

  watch(
    appConfig.value.loginConfig,
    (v) => {
      loginConfig.value = Object.assign(loginConfig.value, v);
      // loginConfig.value.language = themeConfig.value.lang;
      loginConfig.value.language = window.localStorage.getItem('das-intl-locale') || 'zh';
      language.value = loginConfig.value.language
      console.log('appConfig-changes:', loginConfig.value, loginConfig.value.language);
    },
    { deep: true, immediate: true }
  );
  watch(
    loginConfig,
    (v) => {
      console.log('loginConfig-changes:', v);
      // handleLocaleChangeA(v.language);
    },
    { deep: true }
  );

  onMounted(() => {
    setI18n(loginConfig.value.language)
  })
</script>

<style lang="less" scoped>
  @import './index.less';
</style>
