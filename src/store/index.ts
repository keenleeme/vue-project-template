import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import useAppStore from './uedModule/app';
import useMenusStore from './uedModule/menus';
import useThemeStore from './uedModule/theme';
import useUserStore from './uedModule/user';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // 使用 pinia 数据持久化插件

export { useAppStore, useUserStore, useMenusStore, useThemeStore };
export default pinia;
