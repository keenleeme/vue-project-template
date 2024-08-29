/*
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-28 19:19:55
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-08-29 09:38:47
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { ThemeConfigType } from './types';

export const themeDefaultConfig: ThemeConfigType = {
  mode: 'light',
  lang: 'ZH',
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
  accordion: true
};
