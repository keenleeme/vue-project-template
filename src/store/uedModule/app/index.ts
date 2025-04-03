import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { useThemeStore } from '@/store';
import { LoginConfigDTO } from '@/views/uedModule/login/types';
import { defaultConfig } from './defaultConfig';
import { AppConfigType } from './types';

interface AppStore {
  appConfig: Ref<AppConfigType>;
  watermark: Ref<string>;
  themePanelVisible: Ref<boolean>;
  activeModuleId: Ref<string>;
  fullScreen: Ref<boolean>;
  setAppConfig: (config: AppConfigType) => void;
  setLoginConfig: (config: LoginConfigDTO) => void;
  setWatermark: (watermarkStr: string) => void;
  setThemePanelVisible: (show: boolean) => void;
  changeActiveModuleId: (id: string) => void;
  setFullScreen: (isFull: boolean) => void;
}

export default defineStore<'app', AppStore>(
  'app',
  () => {
    const themeStore = useThemeStore();

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
    // 主题控制面板-锚点
    const activeModuleId = ref<string>('language');
    const changeActiveModuleId = (id: string) => {
      activeModuleId.value = id;
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

    return {
      appConfig,
      setAppConfig,
      setLoginConfig,
      watermark,
      setWatermark,
      themePanelVisible,
      setThemePanelVisible,
      activeModuleId,
      changeActiveModuleId,
      fullScreen,
      setFullScreen
    };
  },
  {
    persist: {
      key: 'app-store',
      storage: localStorage
    }
  }
);
