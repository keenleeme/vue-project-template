// import { defaultConfig } from './../app/defaultConfig';
import { ref, watch, computed } from 'vue';
import { generate } from '@ant-design/colors';
import { theme as theme1 } from 'ant-design-vue';
import Color from 'color';
import { defineStore } from 'pinia';
import { themeTokens, ThemeTypes } from '@/theme';
import { themeDefaultConfig } from './defaultConfig';
import { ThemeConfigType } from './types';

const { darkAlgorithm, defaultAlgorithm } = theme1;
export default defineStore('theme', () => {
  // 主题配置项-布局，面包屑，明暗切换，地图导航，多语言，帮助中心，顶栏
  const localThemeConfig = JSON.parse(localStorage.getItem('ZQTHEMECONFIG') || '{}');
  const themeConfig = ref<ThemeConfigType>({ ...themeDefaultConfig, ...localThemeConfig });

  watch(themeConfig, (newValue) => {
    localStorage.setItem('ZQTHEMECONFIG', JSON.stringify(newValue));
  });
  const setThemeConfig = (config: ThemeConfigType) => {
    const value = { ...themeDefaultConfig, ...config };
    themeConfig.value = value;
  };

  function resetThemePrimaryColor() {
    themeConfig.value.primaryColor = themeDefaultConfig.primaryColor;
  }

  function reset() {
    themeConfig.value = { ...themeDefaultConfig };
  }

  // 主题色
  const themeType = ref<ThemeTypes>(ThemeTypes.Light);
  const setThemeType = (theme: ThemeTypes) => {
    themeType.value = theme;
    console.log('themeType', themeType.value);
  };

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
    return { primaryColors, darkPrimaryColors };
  }

  const themeTokenType = computed(() => {
    return themeConfig.value.mode;
  });

  const theme = computed(() => {
    // let token = themeTokenType.value === 'dark' ? themeTokens.dark : themeTokens.light;
    let token = themeTokens[themeTokenType.value as keyof typeof themeTokens];
    const { primaryColors, darkPrimaryColors } = getPrimaryColors();
    const isDark = themeTokenType.value === 'dark';
    token = {
      ...token,
      colorPrimary: themeConfig.value.primaryColor,
      colorPrimaryActive: isDark ? darkPrimaryColors[5] : primaryColors[5],
      colorPrimaryHover: isDark ? darkPrimaryColors[4] : primaryColors[4]
    };
    return {
      token,
      // algorithm: themeType.value === ThemeTypes.Dark ? darkAlgorithm : defaultAlgorithm
      algorithm: themeTokenType.value === ThemeTypes.Dark ? darkAlgorithm : defaultAlgorithm
    };
  });

  return {
    themeType,
    setThemeType,
    themeTokenType,
    theme,
    setThemeConfig,
    reset,
    resetThemePrimaryColor,
    themeConfig
  };
});
