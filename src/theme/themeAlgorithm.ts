import Color from 'color';
import { storeToRefs } from 'pinia';
import { generate } from '@ant-design/colors';
import { useThemeStore } from './../store';
const themeAlgorithm = () => {
  // 物料库组件 主题色设置
  let primaryColors: string[] = [];
  let darkPrimaryColors: string[] = [];
  const themeStore = useThemeStore();
  const { themeConfig, theme } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });

  watch(
    () => config.value.primaryColor,
    () => {
      const color = Color(config.value.primaryColor);
      const darkOriginColor = color
        .saturate(15 / 85)
        .lighten(0.25)
        .hex();
      primaryColors = generate(config.value.primaryColor);
      darkPrimaryColors = generate(darkOriginColor, { theme: 'dark', backgroundColor: '#020C1E' });
      nextTick(() => {
        const bodyEl = document.body;
        // bodyEl.className = config.value.mode === 'dark' || config.value.dark === true ? 'thmee-dark' : '';
        bodyEl.style.setProperty('--um-primary-color-light', primaryColors[0]);
        bodyEl.style.setProperty('--um-primary-color-hover', primaryColors[4]);
        bodyEl.style.setProperty('--um-primary-color-normal', primaryColors[5]);
        bodyEl.style.setProperty('--um-dark-primary-color-light', darkPrimaryColors[0]);
        bodyEl.style.setProperty('--um-dark-primary-color-hover', darkPrimaryColors[4]);
        bodyEl.style.setProperty('--um-dark-primary-color-normal', darkPrimaryColors[5]);
        bodyEl.style.setProperty('--c-color-primary-7', primaryColors[7]);
        bodyEl.style.setProperty('--c-color-primary-5', primaryColors[4]);
        bodyEl.style.setProperty('--c-color-primary-6', primaryColors[5]);
        bodyEl.style.setProperty('--c-color-primary-2', primaryColors[1]);
        bodyEl.style.setProperty('colorPrimary', primaryColors[0]);
      });
    },
    {
      immediate: true,
      deep: true
    }
  );

  watch(
    () => config.value.mode,
    (val) => {
      const bodyEl = document.body;
      bodyEl.className = val === 'dark' ? 'theme-dark' : '';
    },
    {immediate: true}
  );
}
export default themeAlgorithm;
