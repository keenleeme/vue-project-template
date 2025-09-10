// import { defaultConfig } from './../app/defaultConfig';
import { ref, watch, computed, nextTick } from 'vue';
import { generate } from '@ant-design/colors';
import { theme as theme1 } from 'ant-design-vue';
import Color from 'color';
import { defineStore } from 'pinia';
import { themeTokens, ThemeTypes } from '@/theme';
import { themeDefaultConfig } from './defaultConfig';
import { ThemeConfigType } from './types';

const { darkAlgorithm, defaultAlgorithm } = theme1;

// 动态更新字号CSS变量的函数
function updateFontSizeCSS(fontSize: string) {
  const root = document.documentElement;
  root.style.setProperty('--font-size-base', fontSize);
}

export default defineStore('theme', () => {
  // 主题配置项-布局，面包屑，明暗切换，地图导航，多语言，帮助中心，顶栏
  const localThemeConfig = JSON.parse(localStorage.getItem('ZQTHEMECONFIG') || '{}');
  const themeConfig = ref<ThemeConfigType>({ ...themeDefaultConfig, ...localThemeConfig });

  // 立即设置默认字号
  updateFontSizeCSS(themeConfig.value.fontSize);

  // 初始化时设置字号 - 使用nextTick确保DOM已准备好
  nextTick(() => {
    updateFontSizeCSS(themeConfig.value.fontSize);
  });

  watch(
    themeConfig,
    (newValue) => {
      localStorage.setItem('ZQTHEMECONFIG', JSON.stringify(newValue));
      // 动态更新字号CSS变量
      updateFontSizeCSS(newValue.fontSize);
    },
    { deep: true }
  );
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
      .lighten(0.3)
      .hex();
    primaryColors = generate(themeConfig.value.primaryColor);
    darkPrimaryColors = generate(darkOriginColor, { theme: 'dark', backgroundColor: '#1c222e' });
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
      colorPrimary: isDark ? primaryColors[4] : primaryColors[5],
      colorPrimaryActive: isDark ? primaryColors[4] : primaryColors[5],
      colorPrimaryHover: isDark ? darkPrimaryColors[4] : primaryColors[4],
      fontFamily:
        'PingFangSC-Regular, PingFangSC-Semibold,-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
      fontSize: parseInt(themeConfig.value.fontSize, 10),
      fontSizeSM: parseInt(themeConfig.value.fontSize, 10) - 2,
      fontSizeLG: parseInt(themeConfig.value.fontSize, 10) + 2,
      fontSizeXL: parseInt(themeConfig.value.fontSize, 10) + 4
    } as any;
    return {
      token,
      // algorithm: themeType.value === ThemeTypes.Dark ? darkAlgorithm : defaultAlgorithm
      algorithm: themeTokenType.value === ThemeTypes.Dark ? darkAlgorithm : defaultAlgorithm,
      components: {
        Slider: {
          colorPrimaryBorder: isDark ? darkPrimaryColors[5] : primaryColors[5]
        },
        Table: {
          colorTextHeading: token.colorTextBase,
          fontWeightStrong: 400,
          colorBgContainer: token.colorBgElevated,
          padding: 24,
          paddingContentVerticalLG: 12,
          controlHeight: 24,
          colorFillAlter: token.colorFill,
          controlItemBgActive: token.colorBgElevated,
          controlItemBgActiveHover: token.colorFill
        },
        Select: {
          colorBgElevated: token.colorBgSelect,
          colorFillSecondary: token.colorFill,
          colorSplit: token.colorBgSelect,
          controlItemBgHover: token.colorBgSelectHover,
          controlItemBgActive: isDark ? darkPrimaryColors[0] : primaryColors[0]
        },
        Dropdown: {
          colorBgElevated: token.colorBgSelect,
          controlItemBgHover: token.colorBgSelectHover,
          controlItemBgActive: isDark ? darkPrimaryColors[0] : primaryColors[0]
        },
        Cascader: {
          fontWeightStrong: 400
        },
        Tabs: {
          colorText: token.colorTextSecondary
        },
        Button: {
          colorLink: isDark ? darkPrimaryColors[5] : primaryColors[5],
          colorLinkActive: isDark ? darkPrimaryColors[5] : primaryColors[5],
          colorLinkHover: isDark ? darkPrimaryColors[4] : primaryColors[4]
        },
        Modal: {
          borderRadiusLG: 8,
          borderRadiusSM: 8
        },
        Popover: {
          colorBgElevated: token.colorBgSelect
        }
      }
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
