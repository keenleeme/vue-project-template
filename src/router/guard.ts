import { Router } from 'vue-router';
import { getMenus, getPermissions, fetchDingTalkUserInfo, getUserInfo } from '@/api/common';
import { useAppStore, useMenusStore, useUserStore } from '@/store';

export const WHITE_LIST: string[] = ['/404', '/login', '/ai-agent'];

export function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore();
    if (to.query) {
      const { code, state } = to.query;
      if (code && state === 'relogin') {
        const res = await fetchDingTalkUserInfo(code as string);
        const userInfo = await getUserInfo();
        if (res.data && res.data.accessToken) {
          const { data } = res;
          const { accessToken } = data;
          userStore.setToken(accessToken);
        }
        if (userInfo.data) {
          userStore.setUserInfo(userInfo.data.user);
        }
      }
    }
    const appStore = useAppStore();
    const menusStore = useMenusStore();
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
        path: '/login'
        // query: { redirect: to.fullPath }
      });
    }
  });
}
