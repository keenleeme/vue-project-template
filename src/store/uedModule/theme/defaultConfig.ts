import { ThemeConfigType } from './types';

export const themeDefaultConfig: ThemeConfigType = {
  title: '',
  dark: false,
  mode: 'light',
  lang: localStorage.getItem('das-intl-locale') === 'zh' ? 'zh' : 'en',
  primaryColor: '#134BEA',
  // darkPrimaryColor: '#3B71EE',
  lightDarkSwitch: true,
  languageSwitch: true,
  helpCenter: true,
  layout: 'top',
  topStyle: 'dark',
  sideStyle: 'light',
  header: true,
  breadcrumb: true,
  mapMenu: true,
  accordion: true,
  loginMode: 'light'
};
