import { Router } from 'vue-router';
import microApp from '@micro-zoe/micro-app';
import axios from 'axios';
import { setupAddMicroRouter } from './routerControl';
import { useMicroStore } from './store';
import { SubApp } from './store';
import RouterCenter from './routerCenter/index'
import { getCustomApps,getAppRealUrl } from './microApi/helper'

export let routeCenter: RouterCenter;
// 获取定制的路由文件信息
async function registerRouterCenter(router: Router, apps: SubApp[]) {
  // 获取定制的app的router.json文件
  const customApps = getCustomApps(apps);
  routeCenter = new RouterCenter(router);
  const res = await Promise.allSettled([
    ...customApps.map((app: SubApp) =>
    {
      const realUrl = getAppRealUrl(app.url)
      return  axios.get(`${realUrl}${realUrl.endsWith('/') ? '' : '/'}router.json`, {
        timeout: 500
      })
    }
    )
  ]);

  Array.from(res).forEach((item, index) => {
    if (item.status === 'fulfilled' && item.value.data) {
      if(customApps[index]) {
        const {baseroute, routerMode} = customApps[index]
        routeCenter.setModuleRoutes(item.value.data.data, baseroute.slice(1),routerMode);
      }
    }
  });

  // setTimeout(() => {
  //   console.log('routeCenter', routeCenter.getRoutes());
  // }, 5000);

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
