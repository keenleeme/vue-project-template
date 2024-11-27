import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useThemeStore } from '@/store';
import { LoginConfigDTO } from '@/views/uedModule/login/types';
import { defaultConfig } from './defaultConfig';
import { AppConfigType } from './types';

export default defineStore(
  'app',
  () => {
    const themeStore = useThemeStore();

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
        Object.assign(defaultConfig.loginConfig, appConfig.value.loginConfig, config)
      );
      themeStore.setThemeConfig({ ...themeStore.themeConfig, loginMode: appConfig.value.loginConfig.mode });
    };
    // 主题控制面板
    const themePanelVisible = ref<boolean>(false);
    const setThemePanelVisible = (show: boolean) => {
      themePanelVisible.value = show;
    };
    // 水印
    const watermark = ref<string>('');
    const setWatermark = (watermarkStr: string) => {
      watermark.value = watermarkStr;
    };

    const fullScreen = ref(false);
    const setFullScreen = (isFull: boolean) => {
      fullScreen.value = isFull;
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
      watermark,
      setWatermark,
      themePanelVisible,
      setThemePanelVisible,
      fullScreen,
      setFullScreen
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
