import { h } from 'vue';
import { Router } from 'vue-router';
import { useMicroStore } from './store';
import SubApp from './sub-app.vue';

export function setupAddMicroRouter(router: Router) {
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

export function setupMicroRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const microStore = useMicroStore();
  });
}

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
