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

// Ant Design Vue 字号系数表（以 text-md 为基准，指数算法）
// 公式: base × e^(index/5)，index 相对于 text-md（text-md=0）
// 格式: 系数 -> 12px基准=取整值, 14px基准=取整值
const FONT_SIZE_RATIOS: Record<string, number> = {
  'text-xs': 0.6703, // 12px=8, 14px=10, JSON=10 (index=-2, 缩小)
  'text-sm': 0.8187, // 12px=10, 14px=12, JSON=12 (index=-1, 缩小)，对应原有--font-size-small
  'text-md': 1.0, // 12px=12, 14px=14, JSON=14 (index=0, 基准) ，对应原有--font-size-base
  'text-lg': 1.2214, // 12px=14, 14px=16, JSON=16 (index=1, 放大) ，对应原有--font-size-large
  'text-xl': 1.4918, // 12px=18, 14px=20, JSON=20 (index=2, 放大) ，对应原有--font-size-xl
  'text-2xl': 1.8221, // 12px=22, 14px=26, JSON=24 (index=3, 放大)
  'heading-xs': 1.8221, // 12px=22, 14px=26, JSON=24 (index=3)
  'heading-sm': 2.2255, // 12px=26, 14px=32, JSON=28 (index=4)
  'heading-md': 2.7183, // 12px=32, 14px=38, JSON=40 (index=5)
  'heading-lg': 3.3201, // 12px=40, 14px=46, JSON=48 (index=6)
  'heading-xl': 4.0552, // 12px=48, 14px=56, JSON=64 (index=7)
  'heading-2xl': 4.953, // 12px=60, 14px=70, JSON=72 (index=8)
  'display-xs': 2.2255, // 12px=26, 14px=32, JSON=32 (index=4)
  'display-sm': 6.0496 // 12px=72, 14px=84, JSON=96 (index=9)
};

// 取整策略：向最近偶数取整
function roundToNearestEven(val: number): number {
  const rounded = Math.round(val);
  // 如果已经是偶数，直接返回
  if (rounded % 2 === 0) return rounded;
  // 奇数时，根据小数部分决定向上或向下取偶
  return val - Math.floor(val) >= 0.5 ? rounded + 1 : rounded - 1;
}

// 动态更新字号CSS变量的函数
function updateFontSizeCSS(fontSize: string) {
  const root = document.documentElement;
  const base = parseInt(fontSize, 10);

  // 设置基准字号
  root.style.setProperty('--font-size-base', `${base}px`);

  // 计算并设置所有字号（覆盖CSS calc结果）
  for (const [key, ratio] of Object.entries(FONT_SIZE_RATIOS)) {
    const rawSize = base * ratio;
    const finalSize = key === 'text-md' ? base : roundToNearestEven(rawSize);
    root.style.setProperty(`--font-size-${key}`, `${finalSize}px`);
  }
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
