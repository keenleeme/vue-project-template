import { ref } from 'vue';
import { setI18n, setTheme } from '@ued-material/ued-wbc/api';
import { defineStore } from 'pinia';
import { LoginConfigDTO } from '@/views/uedModule/login/types';
import { defaultLoginConfig } from './defaultConfig';
import { LoginConfigStore } from './types';

export default defineStore<'login', LoginConfigStore>(
  'login',
  () => {
    const name = 'ZQ_LOGIN_CONFIG';
    let ZQ_LOGIN_CONFIG = JSON.parse(localStorage.getItem(name) || '{}');
    const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO({ ...defaultLoginConfig, ...ZQ_LOGIN_CONFIG }));

    function setLoginConfig() {
      localStorage.setItem('ZQ_LOGIN_CONFIG', JSON.stringify(loginConfig.value));
      ZQ_LOGIN_CONFIG = loginConfig.value;
    }

    const get = (filed: keyof LoginConfigDTO): LoginConfigDTO[keyof LoginConfigDTO] => {
      return loginConfig.value[filed];
    };

    const reset = () => {
      loginConfig.value = new LoginConfigDTO({ ...defaultLoginConfig });
      setLoginConfig();
    };

    const set = (config: Partial<LoginConfigDTO>) => {
      loginConfig.value = new LoginConfigDTO({ ...loginConfig.value, ...config });
      setLoginConfig();
      console.log(123, loginConfig.value.language, loginConfig.value.mode);
      setTheme(loginConfig.value.mode);
      setI18n(loginConfig.value.language);
    };

    onMounted(() => {
      const { mode = 'light', lang = 'zh' } = JSON.parse(localStorage.getItem(name) || '{}');
      setI18n(lang);
      setTheme(mode);
    });

    return {
      name,
      loginConfig,
      get,
      reset,
      set
    };
  },
  {
    persist: [
      {
        key: process.env.TOKEN_NAME || 'token',
        paths: ['token']
      }
    ]
  }
);
