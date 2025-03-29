import { Router } from 'vue-router';
import { getMenus, getPermissions } from '@/api/common';
import { useAppStore, useMenusStore, useUserStore } from '@/store';

export const WHITE_LIST: string[] = ['/404', '/login', '/ai-agent'];

export function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const menusStore = useMenusStore();
    const userStore = useUserStore();
    if (to.path !== '/themeConfig') {
      appStore.setThemePanelVisible(false);
    }
    if (WHITE_LIST.includes(to.path)) {
      if (to.path === '/login' && userStore.token) {
        next({ path: '/' });
      }
      next();
    } else if (userStore.token) {
      // 判断是否登录
      // 判断是否获取菜单权限
      if (!menusStore.menusData.length) {
        const menusData = await getMenus();
        menusStore.setMenus(menusData);
      }
      // 判断是否获取权限 ids;
      if (!userStore.permissionIds.length) {
        const permissionIds = await getPermissions();
        userStore.setPermissionIds(permissionIds);
      }
      if (to.path === '/') {
        const firstMenu = menusStore.findFistSiderMenu();
        if (firstMenu && firstMenu.path) {
          next(firstMenu.path);
          return;
        }
        next('/404');
        return;
      }
      if (!userStore.permissionIds.includes(to.meta.permissionId as string) && !to.meta.public) {
        next('/404');
        return;
      }
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  });
}
