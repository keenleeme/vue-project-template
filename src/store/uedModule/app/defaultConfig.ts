import { LoginConfigDTO, LogoModeEnums } from '@/views/uedModule/login/types';
import bgImageDark from '@/views/uedModule/loginConfig/login-dark.png';
import bgImage from '@/views/uedModule/loginConfig/login.png';
import { AppConfigType } from './types';

export const defaultConfig: AppConfigType = {
  title: '智启vue3孵化器系统',
  subtitle: 'webpack',

  loginConfig: new LoginConfigDTO({
    mode: 'light',
    logoMode: LogoModeEnums.IMAGE,
    logoName: '智启vue3孵化器系统',
    title: '欢迎登录',
    bgMode: 'image',
    bgImage,
    bgImageDark,
    logoUrl: '/logo.png'
  })
};
