import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import useAppStore from './uedModule/app';
import useLoginStore from './uedModule/login';
import useMenusStore from './uedModule/menus';
import useThemeStore from './uedModule/theme';
import useUserStore from './uedModule/user';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export { useAppStore, useLoginStore, useUserStore, useMenusStore, useThemeStore };
export default pinia;
