import { Router } from 'vue-router';
import microApp from '@micro-zoe/micro-app';
import axios from 'axios';
import { getAppRealUrl } from './microApi/helper';
// getCustomApps
import RouterCenter from './routerCenter/index';
import { setupAddMicroRouter } from './routerControl';
import { useMicroStore, SubApp } from './store';

// eslint-disable-next-line import/no-mutable-exports
export let routeCenter: RouterCenter;
// 获取定制的路由文件信息
async function registerRouterCenter(router: Router, apps: SubApp[]) {
  // 获取定制的app的router.json文件
  // const customApps = getCustomApps(apps);
  routeCenter = new RouterCenter(router);
  (window as any)._routeCenter = routeCenter;
  
  // 开发环境下，先检测哪些子应用已启动
  const isDev = process.env.NODE_ENV === 'development';
  let activeApps: SubApp[] = apps;
  
  if (isDev) {
    console.log('[Micro] 开发模式：检测子应用状态...');
    
    // 并行检测所有子应用是否可访问
    const checkResults = await Promise.all(
      apps.map(async (app) => {
        const realUrl = getAppRealUrl(app.url);
        try {
          await fetch(`${realUrl}`, { mode: 'no-cors', signal: AbortSignal.timeout(1000) });
          return { app, available: true };
        } catch {
          return { app, available: false };
        }
      })
    );
    
    // 过滤出可用的子应用
    activeApps = checkResults
      .filter((result) => result.available)
      .map((result) => result.app);
    
    const unavailableApps = checkResults
      .filter((result) => !result.available)
      .map((result) => result.app.name);
    
    if (unavailableApps.length > 0) {
      console.log(`[Micro] ℹ️  以下子应用未启动，将跳过路由注册: ${unavailableApps.join(', ')}`);
    }
    console.log(`[Micro] ✅ 可用子应用: ${activeApps.length}/${apps.length}`);
  }
  
  if (activeApps.length === 0) {
    console.log('[Micro] 没有可用的子应用，跳过路由加载');
    return;
  }
  
  console.log('[Micro] 开始加载子应用路由配置...');
  
  const res = await Promise.allSettled([
    ...activeApps.map((app: SubApp) => {
      if (app.custom) {
        routeCenter.setCustomAppName(app.name);
      }
      const realUrl = getAppRealUrl(app.url);
      return axios.get(`${realUrl}${realUrl.endsWith('/') ? '' : '/'}router.json`, {
        timeout: 1000,
        validateStatus: (status) => status < 500
      });
    })
  ]);

  let successCount = 0;
  let skipCount = 0;
  
  Array.from(res).forEach((item, index) => {
    if (item.status === 'fulfilled' && item.value.data) {
      if (activeApps[index]) {
        const { baseroute, routerMode } = activeApps[index];
        routeCenter.setModuleRoutes(item.value.data.data, baseroute.slice(1), routerMode);
        successCount++;
      }
    } else {
      skipCount++;
    }
  });
  
  console.log(`[Micro] 路由配置加载完成：${successCount} 个成功，${skipCount} 个跳过`);

  setTimeout(() => {
    console.log('routeCenter', routeCenter.getRoutes());
  }, 5000);

  // routeCenter.initRegExpKeyToKey();
  // const decorateRouter = new DecorateRouter(router, routeCenter);
  // decorateRouter.proxyWindowOpen();
  // // decorateRouter.proxyHomeRouter();
  // window.decorateRouter = decorateRouter;
}

export async function startMicro(router: Router) {
  const microStore = useMicroStore();
  const { apps } = microStore;
  // 获取定制页面的路由信息
  await registerRouterCenter(router, apps);
  setupAddMicroRouter(router);
  // 子应用预加载 https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/prefetch

  apps.forEach((app) => {
    // microApp.preFetch([{ name: app.name, url: app.url }]);
  });

  // https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/sandbox?id=iframe-source
  microApp.start({
    iframeSrc: '/empty.html'
  });
}
