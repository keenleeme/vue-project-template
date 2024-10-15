/*
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-28 19:05:12
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-25 20:52:35
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { ref } from 'vue';
import { theme as theme1 } from 'ant-design-vue';
import { defineStore } from 'pinia';
import { themeTokens, ThemeTypes } from '@/theme';
import { themeDefaultConfig } from './defaultConfig';
import { ThemeConfigType } from './types';
import Color from 'color';
import { generate } from '@ant-design/colors';

const { darkAlgorithm, defaultAlgorithm } = theme1;
export default defineStore('theme', () => {
  // 主题配置项-布局，面包屑，明暗切换，地图导航，多语言，帮助中心，顶栏
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

  // 主题色
  const themeType = ref<ThemeTypes>(ThemeTypes.Light);
  console.log('themeType', themeType.value);
  const setThemeType = (theme: ThemeTypes) => {
    themeType.value = theme;
    console.log('themeType', themeType.value);
  };

  // let darkOriginColor = ref<string>('') ; // 暗黑模式下的原始颜色，用于计算其他颜色值，如背景色，分割线等
  function getPrimaryColors() {
    let primaryColors: string[] = [];
    let darkPrimaryColors: string[] = [];
    const color = Color(themeConfig.value.primaryColor);
    const darkOriginColor = color
      .saturate(15 / 85)
      .lighten(0.25)
      .hex();
      primaryColors = generate(themeConfig.value.primaryColor);
      darkPrimaryColors = generate(darkOriginColor, { theme: 'dark', backgroundColor: '#020C1E' });
    return {primaryColors, darkPrimaryColors}
  }

  // const primaryColors = computed(() => generate(themeConfig.value.primaryColor));
  // const darkPrimaryColors = computed(() => generate(getPrimaryColors(), { theme: 'dark', backgroundColor: '#020C1E' };
  const themeTokenType = ref('light');
  const setThemeTokenType = (theme: string) => {
    themeTokenType.value = theme;
  };
  const theme = computed(() => {
    // let token = themeTokenType.value === 'dark' ? themeTokens.dark : themeTokens.light;
    let token = themeTokens[themeTokenType.value as keyof typeof themeTokens];
    const {primaryColors, darkPrimaryColors} = getPrimaryColors();
    const isDark = themeTokenType.value === 'dark' ? true : false;
    token = { 
      ...token,
      colorPrimary: themeConfig.value.primaryColor,
      colorPrimaryActive: isDark ? darkPrimaryColors[5] : primaryColors[5],
      colorPrimaryHover: isDark ? darkPrimaryColors[4] : primaryColors[4],
    };
    return {
      token,
      algorithm: themeType.value === ThemeTypes.Dark ? darkAlgorithm : defaultAlgorithm
    };
  });

  return {
    themeType,
    setThemeType,
    themeTokenType,
    setThemeTokenType,
    theme,
    setThemeConfig,
    reset,
    resetThemePrimaryColor,
    themeConfig
  };
});
