/* eslint-disable max-classes-per-file */
import { Ref } from 'vue';
import { LoginConfigDTO } from '@/views/uedModule/login/types';

export type LoginConfigStore = {
  name: 'ZQ_LOGIN_CONFIG';
  loginConfig: Ref<LoginConfigDTO>;

  get: (filed: keyof LoginConfigDTO) => LoginConfigDTO[keyof LoginConfigDTO];
  set: (config: Partial<LoginConfigDTO>) => void;
  reset: () => void;
};
