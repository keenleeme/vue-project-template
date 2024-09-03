/*
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-28 19:05:12
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-03 16:33:35
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { themeDefaultConfig } from './defaultConfig';
import { ThemeConfigType } from './types';

export default defineStore('theme', () => {
  // 主题数据
  const themeConfig = ref<ThemeConfigType>({ ...themeDefaultConfig });
  const setThemeConfig = (config: ThemeConfigType) => {
    const value = { ...themeDefaultConfig, ...config };
    themeConfig.value = value;
  };

  function resetThemePrimaryColor() {
    console.log(themeDefaultConfig);
    themeConfig.value.primaryColor = themeDefaultConfig.primaryColor;
  }

  function reset() {
    themeConfig.value = { ...themeDefaultConfig };
  }

  return { setThemeConfig, reset, resetThemePrimaryColor, themeConfig };
});
