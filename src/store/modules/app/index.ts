import { computed, ref } from 'vue';
// import { theme } from 'ant-design-vue';
import { defineStore } from 'pinia';
import { LoginConfigDTO } from '@/views/login/types';
// import { themeTokens, ThemeTypes } from '@/theme';
import { defaultConfig } from './defaultConfig';
import { AppConfigType } from './types';

// const { darkAlgorithm, defaultAlgorithm } = theme;

export default defineStore(
  'app',
  () => {
    // token
    const token = ref<string>();
    const setToken = (tokenStr: string) => {
      token.value = tokenStr;
    };
    // 权限 code
    const permissionIds = ref<string[]>([]);
    const setPermissionIds = (ids: string[]) => {
      permissionIds.value = ids;
    };
    // 系统配置
    const appConfig = ref<AppConfigType>({ ...defaultConfig });
    const setAppConfig = (config: AppConfigType) => {
      const value = { ...defaultConfig, ...config };
      appConfig.value = value;
    };
    const setLoginConfig = (config: LoginConfigDTO) => {
      appConfig.value.loginConfig = new LoginConfigDTO(
        Object.assign(defaultConfig.loginConfig, appConfig.value.loginConfig, defaultConfig.loginConfig, config)
      );
    };
    // 主题控制面板
    const themePanelVisible = ref<boolean>(false);
    const setThemePanelVisible = (show: boolean) => {
      themePanelVisible.value = show;
    }
    // // 主题
    // const themeType = ref<ThemeTypes>(ThemeTypes.Light);
    // const setThemeType = (theme: ThemeTypes) => {
    //   themeType.value = theme;
    // };
    // const themeTokenType = ref('blue');
    // const setThemeTokenType = (theme: string) => {
    //   themeTokenType.value = theme;
    // };
    // const theme = computed(() => {
    //   return {
    //     // token: themeTokenType.value === 'red' ? themeTokens.red : themeTokens.blue,
    //     algorithm: themeType.value === ThemeTypes.Dark ? darkAlgorithm : defaultAlgorithm
    //   };
    // });
    // 水印
    const watermark = ref<string>('');
    const setWatermark = (watermarkStr: string) => {
      watermark.value = watermarkStr;
    };
    // 重置数据
    const reset = () => {
      token.value = '';
      permissionIds.value = [];
    };
    return {
      reset,
      token,
      setToken,
      permissionIds,
      setPermissionIds,
      appConfig,
      setAppConfig,
      setLoginConfig,
      // themeType,
      // setThemeType,
      // theme,
      watermark,
      setWatermark,
      // themeTokenType,
      // setThemeTokenType
      themePanelVisible,
      setThemePanelVisible
    };
  },
  {
    // 持久化存储
    persist: [
      {
        key: process.env.TOKEN_NAME || 'token',
        paths: ['token']
      }
    ]
  }
);
