import { Router } from 'vue-router';
import { getMenus, getPermissions, fetchDingTalkUserInfo, getUserInfo } from '@/api/common';
import { useAppStore, useMenusStore, useUserStore } from '@/store';

export const WHITE_LIST: string[] = ['/404', '/login', '/ai-agent'];

// GitHub Pages 静态部署时自动注入 mock 凭证，跳过登录
function injectMockAuth() {
  const userStore = useUserStore();
  if (!userStore.token) {
    userStore.setToken('mock-jwt-token-github-pages');
    userStore.setUserInfo({
      id: 'mock-user-001',
      username: 'zhen.li',
      name: 'zhen.li',
      email: 'zhen.li@example.com'
    });
  }
}

export function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, _, next) => {
    // 自动注入 mock 登录凭证（用于 GitHub Pages 等无后端环境）
    injectMockAuth();
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
      if (!menusStore.menusData || !menusStore.menusData.length) {
        const menusData = await getMenus();
        await menusStore.setMenus(menusData); // 等待菜单设置完成
      }
      // 判断是否获取权限 ids;
      if (!userStore.permissionIds || !userStore.permissionIds.length) {
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
