/*
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-28 19:05:12
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-08-29 13:36:00
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { themeTokens, ThemeTypes } from '@/theme';
import { themeDefaultConfig } from './defaultConfig';
import { ThemeConfigType } from './types';

export default defineStore('theme', () => {
  // 主题数据
  const themeConfig = ref<ThemeConfigType>({ ...themeDefaultConfig });
  const setThemeConfig = (config: ThemeConfigType) => {
    const value = { ...themeDefaultConfig, ...config };
    themeConfig.value = value;
  };
  // 主题模式
  const themeType = ref<ThemeTypes>(ThemeTypes.Light);
  const setThemeType = (theme: ThemeTypes) => {
    themeType.value = theme;
  };
  function setTheme(theme: string) {}

  function getTheme() {
    return themeType.value;
  }

  function reset() {}

  return { setThemeConfig, setThemeType, setTheme, getTheme, reset, themeConfig };
});
