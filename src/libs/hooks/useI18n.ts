/**
 * 国际化 Hook
 * 统一管理国际化切换逻辑
 */
import { changeLocale } from '@international/vue3-i18n';
import { storeToRefs } from 'pinia';
import { useThemeStore, useLoginStore } from '@/store';

export function useI18n() {
  const themeStore = useThemeStore();
  const loginStore = useLoginStore();
  const { themeConfig } = storeToRefs(themeStore);

  /**
   * 统一的语言切换方法
   * @param locale - 语言代码 ('zh' | 'en')
   */
  const handleLocaleChange = (locale: string) => {
    themeConfig.value = { ...themeConfig.value, lang: locale };
    loginStore.set({ language: locale });
    changeLocale(locale);
    window.location.reload();
  };

  /**
   * Ant Design Menu 点击事件的适配器
   * @param event - { key: string } 格式的事件对象
   */
  const handleLocaleChangeFromMenu = (event: { key: string }) => {
    handleLocaleChange(event.key);
  };

  /**
   * 自定义事件的适配器
   * @param event - CustomEvent<{ data: string }> 格式的事件对象
   */
  const handleLocaleChangeFromCustomEvent = (event: CustomEvent<{ data: string }>) => {
    const locale = event.detail.data === 'en' ? 'en' : 'zh';
    handleLocaleChange(locale);
  };

  return {
    currentLocale: themeConfig.value.lang,
    handleLocaleChange,
    handleLocaleChangeFromMenu,
    handleLocaleChangeFromCustomEvent
  };
}
