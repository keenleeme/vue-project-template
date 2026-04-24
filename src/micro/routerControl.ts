import { h } from 'vue';
import { Router } from 'vue-router';
import router from '@/router';
import { useAppStore, useMenusStore } from '@/store';
// import type { MenuType } from '@/store/uedModule/menus/types';
import microApp, { monitorChildRouterChange, getMicroAppActiveApps } from './microApi';
import {
  decorateLocationPath,
  isActiveApp,
  getRouteMeta,
  getParentRoutes,
  getCustomParentRoute
} from './microApi/helper';
import { useMicroStore } from './store';

let customPath;

export function setupAddMicroRouter(router: Router) {
  setupMicroRouterGuards();
  const microStore = useMicroStore();
  microStore.apps.forEach((app) => {
    if (!router.hasRoute(app.name)) {
      router.addRoute({
        path: `${app.baseroute}/:page*`,
        name: app.name,
        // 必须动态加载：static import 会立刻执行 sub-app 里的 `import 'zone.js'`，
        // Zone 会全局打补丁，易与主应用 Vue 3 + antdv 冲突（如打开 Drawer 报 'type' in null）
        component: () =>
          import('./sub-app.vue').then((m) => h(m.default, { appInfo: app })),
        meta: {
          title: app.name,
          public: true,
          fullScreen: app.meta?.fullScreen || false
        }
      });
    }
  });
}

// export function setupMicroRouterGuards(router: Router) {
//   router.beforeEach((to, from, next) => {
//     const microStore = useMicroStore();
//   });
// }

export function proxySubAppsRouter(baseRouter: Router) {
  return {
    proxy(subAppRouter: Router) {
      subAppRouter.push = baseRouter.push.bind(baseRouter);
      subAppRouter.replace = baseRouter.replace.bind(baseRouter);
      subAppRouter.go = baseRouter.go.bind(baseRouter);
      subAppRouter.back = baseRouter.back.bind(baseRouter);
    }
  };
}

// 监听路由变化
export function setupMicroRouterGuards() {
  const appStore = useAppStore();
  const menusStore = useMenusStore();
  // 只能监听注册的子应用的变化
  monitorChildRouterChange((to, from, appName) => {
    console.log('全局前置守卫 beforeEach: ', to, from, appName);
    const activeApps = getMicroAppActiveApps();
    if (to.fullPath && activeApps.length === 1) {
      const microStore = useMicroStore();
      const app = microStore.apps.find(a => a.name === appName);
      const meta = getRouteMeta(to.fullPath, appName, to.hash);
      // 优先使用路由元数据中的全屏设置，如果没有则使用应用配置中的全屏设置
      appStore.setFullScreen(meta?.fullScreen ?? app?.meta?.fullScreen ?? false);
      
      if (customPath && customPath[to.fullPath]) {
        menusStore.setActiveRoutes([
          {
            path: customPath[to.fullPath],
            title: '',
            component: true
          }
        ]);
        customPath = null;
        return;
      }

      const fullPath = to.fullPath.split('?')[0];
      let microRoutes = getParentRoutes(appName, meta, fullPath);
      if (!microRoutes.length) {
        // 正常的定制页面走菜单进来，必然会存在，不存在的话 说明主线的定制页面，走到了子应用
        // 需要去掉子应用的前缀，后面部分就是主线的路由
        microRoutes = getCustomParentRoute(appName, to.fullPath);
      }
      menusStore.setActiveRoutes(microRoutes);
      // const {module, path,routerMode} = decorateLocationPath(to.fullPath,appName)
      // if(module && module !== appName) {
      //   const newFullPath = `/${module}/${routerMode==='hash'?'#':''}${path}`;
      //   router.push(newFullPath)
      // }
    }
  });

  // 基座的路由变化监听
  router.beforeEach((to, from, next) => {
    console.log('全局前置守卫 beforeEach -基座: ', to, from, next);
    const microStore = useMicroStore();
    
    // 如果是从根路径来的，直接放行
    if (from.fullPath === '/') {
      next();
      return;
    }

    // 第一个参数是基座的公共前缀 没有传空就好了
    const { module, path, routerMode } = decorateLocationPath(to.fullPath);
    if (module) {
      // 获取目标应用的配置
      const targetApp = microStore.apps.find(app => app.name === module);
      
      // 走的定制模块的内容
      const newFullPath = `/${module}${routerMode === 'hash' ? '/#' : ''}${path}`;
      customPath = {
        [newFullPath]: to.fullPath
      };
      
      if (newFullPath !== to.fullPath) {
        // 需要判断当前的激活应用在不在这个里面
        if (isActiveApp(module)) {
          // 设置全屏状态
          if (targetApp?.meta?.fullScreen) {
            useAppStore().setFullScreen(true);
          }
          
          microApp.router.push({
            name: module,
            path: newFullPath
          });
          return;
        }
        next(newFullPath);
        return;
      }
    }
    next();
  });
}
