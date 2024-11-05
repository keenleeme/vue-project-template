import { h } from 'vue';
import { Router } from 'vue-router';
import router from '@/router';
import type { MenuType } from '@/store/uedModule/menus/types';
import microApp, { monitorChildRouterChange } from './microApi';
import { decorateLocationPath, isActiveApp, microMenuNavigation } from './microApi/helper';
import { useMicroStore } from './store';
import SubApp from './sub-app.vue';

export function setupAddMicroRouter(router: Router) {
  setupMicroRouterGuards();
  const microStore = useMicroStore();
  microStore.apps.forEach((app) => {
    if (!router.hasRoute(app.name)) {
      router.addRoute({
        path: `${app.baseroute}/:page*`,
        name: app.name,
        component: () => h(SubApp, { appInfo: app }),
        meta: {
          title: app.name,
          public: true
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
  // 只能监听注册的子应用的变化
  monitorChildRouterChange((to, from, appName) => {
    console.log('全局前置守卫 beforeEach: ', to, from, appName);
    if (to.fullPath) {
      // const {module, path,routerMode} = decorateLocationPath(to.fullPath,appName)
      // if(module && module !== appName) {
      //   const newFullPath = `/${module}/${routerMode==='hash'?'#':''}${path}`;
      //   router.push(newFullPath)
      // }
    }
  });

  // 基座的路由变化监听
  router.beforeEach((to, from, next) => {
    // debugger;
    console.log('全局前置守卫 beforeEach -基座: ', to, from, next);
    if (from.fullPath === '/') {
      next();
      return;
    }
    // 第一个参数是基座的公共前缀 没有传空就好了
    const { module, path, routerMode } = decorateLocationPath(to.fullPath);
    if (module) {
      const newFullPath = `/${module}${routerMode === 'hash' ? '/#' : ''}${path}`;
      if (newFullPath !== to.fullPath) {
        // 需要判断当前的激活应用在不在这个里面
        if (isActiveApp(module)) {
          microApp.router.push({
            name: module,
            path: newFullPath // 此处需要修改 后续需要判断子应用是hash还是history
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
