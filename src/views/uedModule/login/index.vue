<template>
  <ued-login-layout
    ref="loginLayout"
    :forms="forms"
    :mode="forms[0].type"
    :props="{
      title: loginConfig.title,
      theme: loginConfig.mode,
      bgImage: loginConfig.mode === 'dark' ? loginConfig.bgImageDark : loginConfig.bgImage,
      bgVideo: loginConfig.bgVideo,
      bgAttrs: {
        poster: loginConfig.bgPoster
      }
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
  import { useLoginStore, useThemeStore, useUserStore } from '@/store';
  import { LoginConfigDTO, LogoModeEnums } from './types';

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
              if (value?.length < 6) {
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
            return new Promise((resolve, reject) => {
              console.log('开始获取验证码');
              getCaptcha()
                .then((res) => {
                  console.log('验证码API响应:', res);
                  console.log('响应类型:', typeof res);
                  console.log('响应数据结构:', Object.keys(res));

                  // 检查响应格式，支持多种格式
                  if (res.data && res.data.captchaId && res.data.captchaBase64) {
                    // 标准格式：{data: {captchaId, captchaBase64}}
                    console.log('使用标准格式处理验证码');
                    captchaId.value = res.data.captchaId;
                    resolve(res.data.captchaBase64);
                  } else if (res.captchaId && res.captchaBase64) {
                    // 直接格式：{captchaId, captchaBase64}
                    console.log('使用直接格式处理验证码');
                    captchaId.value = res.captchaId;
                    resolve(res.captchaBase64);
                  } else {
                    console.error('验证码响应格式不正确:', res);
                    console.error('期望的字段:', {
                      captchaId: !!res.data?.captchaId,
                      captchaBase64: !!res.data?.captchaBase64
                    });
                    reject(new Error('验证码响应格式不正确'));
                  }
                })
                .catch((error) => {
                  console.error('获取验证码失败:', error);
                  reject(error);
                });
            });
          }
        }
      ]
    },
    // {
    //   type: 'login-phone',
    //   name: I18N.layout.shouJiYanZhengMaDengLu,
    //   btnText: I18N.common.login,
    //   items: [
    //     {
    //       type: 'ued-input',
    //       field: 'username',
    //       label: I18N.layout.shouJiHaoMa,
    //       icon: 'phone',
    //       rules: [
    //         {
    //           type: 'string',
    //           min: 2,
    //           max: 6,
    //           required: true
    //         }
    //       ]
    //     },
    //     {
    //       type: 'ued-password',
    //       field: 'password',
    //       label: I18N.common.password,
    //       icon: 'password',
    //       rules: {
    //         type: 'string',
    //         min: 12
    //       }
    //     },
    //     {
    //       type: 'ued-code',
    //       field: 'verifyCode',
    //       label: I18N.layout.yanZhengMa,
    //       icon: 'code',
    //       api: () => {
    //         return new Promise((resolve) => {
    //           setTimeout(() => {
    //             resolve(true);
    //           }, 2000);
    //         });
    //       }
    //     },
    //     {
    //       type: 'ued-touch-bar',
    //       field: 'touchVerify',
    //       label: I18N.layout.huaKuaiYanZheng
    //     }
    //   ]
    // },
    {
      type: 'registry-phone',
      name: '注册账号',
      btnText: '注册',
      items: [
        { type: 'ued-input', field: 'username', label: '用户名', icon: 'user' },
        {
          type: 'ued-password',
          field: 'password',
          label: '密码',
          icon: 'password',
          rules: [
            {
              type: 'string',
              min: 6,
              required: true,
              validator: (rule: any, value: any, cab: any) => {
                resiterPassword.value = value;
                if (value?.length < 6) {
                  cab(new Error('密码不能小于6位'));
                }
                cab();
              }
            }
          ]
        },
        {
          type: 'ued-password',
          field: 'passwordConfirm',
          label: '确认密码',
          icon: 'password',
          rules: [
            {
              type: 'string',
              min: 6,
              required: true,
              validator: (rule: any, value: any, cab: any) => {
                if (value !== resiterPassword.value) {
                  cab(new Error('密码不一致'));
                }
                cab();
              }
            }
          ]
        }
      ]
    },
    // {
    //   type: 'forget-phone',
    //   name: I18N.layout.zhaoHuiMiMa,
    //   btnText: I18N.layout.zhaoHuiMiMa,
    //   items: [
    //     { type: 'ued-input', field: 'phone', label: I18N.layout.shouJiHaoMa, icon: 'phone' },
    //     { type: 'ued-code', field: 'code', label: I18N.layout.shouJiYanZhengMa, icon: 'code-phone' },
    //     { type: 'ued-password', field: 'pwd', label: I18N.layout.xinMiMa, icon: 'password' },
    //     { type: 'ued-password', field: 'pwdConfirm', label: I18N.layout.queRenMiMa, icon: 'password' }
    //   ]
    // },
    {
      type: 'qr-ding',
      name: I18N.layout.dingDingSaoMa,
      items: [
        {
          api: () => {
            return new Promise(async (resolve, reject) => {
              try {
                await handleLoginRedirect();
                resolve(true);
              } catch (error) {
                console.error('钉钉登录跳转失败:', error);
                reject(error);
              }
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

  const handleLogin = async (data) => {
    try {
      console.log('开始登录，输入数据:', data);
      const res = await onLogin({ ...data, captchaId: captchaId.value });
      console.log('登录响应:', res);

      // 检查响应格式，支持多种格式
      const isSuccess = res.code === 200 || (res.data && res.data.accessToken && res.data.user);

      if (isSuccess) {
        // 确保数据完整性
        const loginData = res.data || res;
        if (!loginData.accessToken || !loginData.user) {
          throw new Error('登录响应数据不完整');
        }

        console.log('设置用户token:', loginData.accessToken);
        console.log('设置用户信息:', loginData.user);

        // 设置用户信息
        userStore.setToken(loginData.accessToken);
        userStore.setUserInfo(loginData.user);

        // 验证数据是否设置成功
        console.log('验证token设置:', userStore.token);
        console.log('验证用户信息设置:', userStore.userInfo);

        // 验证localStorage中的数据
        const storedData = localStorage.getItem('user-store');
        console.log('localStorage中的数据:', storedData);

        message.success(res.message || '登录成功');

        // 延迟跳转，确保数据保存完成
        setTimeout(() => {
          try {
            console.log('准备跳转到首页');
            router.replace('/');
          } catch (routerError) {
            console.error('路由跳转失败:', routerError);
            // 如果路由跳转失败，尝试使用window.location
            window.location.href = '/';
          }
        }, 1000);
      } else {
        console.error('登录失败，响应码:', res.code, '消息:', res.message);
        loginLayout.value.refresh('verifyCode');
        message.error(res.message || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      const errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
      message.error(errorMessage);
      loginLayout.value.refresh('verifyCode');
    }
  };

  const handleRegistry = async (data) => {
    try {
      const res = await onRegister(data);
      console.log('注册响应:', res);

      // 检查响应格式，支持多种格式
      const isSuccess = res.code === 200 || res.message;

      if (isSuccess) {
        message.success(res.message || '注册成功');
        loginLayout.value.setType('login-password');
      } else {
        message.error(res.message || '注册失败');
      }
    } catch (error) {
      console.error('注册失败:', error);
      const errorMessage = error instanceof Error ? error.message : '注册失败，请重试';
      message.error(errorMessage);
    }
  };

  const handleLocaleChangeA = (e: CustomEvent<{ data: string }>) => {
    const locale = e.detail.data === 'en' ? 'en' : 'zh';
    themeConfig.value = { ...themeConfig.value, lang: locale };
    changeLocale(locale);
    loginStore.set({ language: locale });
    window.location.reload();
  };

  const handleLoginRedirect = async () => {
    try {
      console.log('开始获取钉钉登录URL');
      const res = await getLoginRedirectUrl({
        state: 'relogin',
        redirectUri: window.location.origin
      });
      console.log('钉钉登录URL响应:', res);

      // 检查响应格式，支持多种格式
      const redirectUrl = res.data?.redirectUrl || res.redirectUrl;
      const isSuccess = res.code === 200 || redirectUrl;

      if (isSuccess && redirectUrl) {
        console.log('跳转到钉钉登录页面:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        throw new Error(res.message || '获取钉钉登录URL失败');
      }
    } catch (error) {
      console.error('获取钉钉登录URL失败:', error);
      const errorMessage = error instanceof Error ? error.message : '获取钉钉登录URL失败';
      message.error(errorMessage);
      throw error;
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
