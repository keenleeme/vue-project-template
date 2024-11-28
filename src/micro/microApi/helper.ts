import type { RouteMeta } from 'vue-router';
import router from '@/router';
import type { MenuType } from '@/store/uedModule/menus/types';
import { routeCenter } from '../index';
import { SubApp } from '../store';
import microApp, { getMicroAppActiveApps } from './index';

export function menuNavigationRewrite(menu: MenuType) {
  if (!menu.url) {
    return;
  }
  // 跳转到子应用相关模块
  if (menu.module) {
    // const activeApps = getMicroAppActiveApps();
    // if (activeApps.includes(menu.module)) {
    if (isActiveApp(menu.module)) {
      microApp.router.push({
        name: menu.module,
        path: menu.url // 此处需要修改 后续需要判断子应用是hash还是history
      });
      return;
    }
  }
  router.push(menu.url);
}

export function microMenuNavigation(menu: MenuType) {
  menuNavigationRewrite(menu);
}

export function getCustomApps(apps: SubApp[]): SubApp[] {
  return apps.filter((item) => item.custom);
}

export function delPrefix(prefix: string, path: string) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^/?${escapedPrefix}(?:/|#/?)?(.*)$`);
  const match = path.match(regex);
  if (match) {
    const remaining = match[1].replace(/^#?\/?/, '');
    return remaining ? `/${remaining}` : '/';
  }
  return path;
}

/**
 * @description 匹配 hash 值中的路径部分和参数部分，并将它们分别捕获到一个分组中。分离路径和参数
 * @param hash 路径
 * @returns {path,query}
 */
export function getPathAndQuery(hash: string) {
  const result = /([^?]+?)(\?.+)?$/.exec(hash);
  if (result) {
    const [, path, query = ''] = result;
    return { path, query };
  }
  return {
    path: '',
    query: ''
  };
}

export function decorateLocationPath(
  fullPath: string,
  baseurl = ''
): {
  module?: string;
  path: string;
  routerMode?: string;
} {
  fullPath = delPrefix(baseurl, fullPath); // 去除一些特定的前缀
  if (!fullPath) {
    return {
      path: '/404'
    };
  }
  const { path: _path, query: _query } = getPathAndQuery(fullPath);
  if (['/404', '/403', '/500', '/login', '/'].includes(_path)) {
    return { path: _path };
  }

  const customName = routeCenter.getCustomName();
  const { module } = routeCenter.get(customName, _path) || {};
  return {
    module: module || '',
    path: `${_path}${_query}`,
    routerMode: module ? routeCenter.getModuleRouterMode(module) : ''
  };
}

/**
 * @description 判断当前应用是不是激活的子应用
 * @param appName 当前路由的app名称
 * @returns true/false
 */
export function isActiveApp(appName: string): boolean {
  const activeApps = getMicroAppActiveApps();
  return activeApps.length === 1 && activeApps[0] === appName;
}

/**
 * @description 获取子应用的路由前缀
 * @param appName 当前路由的app名称
 * @returns true/false
 */
//  export function getAppPrefix(url: string) {
//   const activeApps = getMicroAppActiveApps();
//   return activeApps.includes(appName)
//  }

/**
 * @description 获取子应用的完成的路径
 * @param url 当前app应用的url地址
 * @returns realurl
 */
export function getAppRealUrl(url: string): string {
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) {
    return window.location.protocol + url;
  }
  if (url.startsWith(':')) {
    return `${window.location.protocol}//${window.location.hostname}${url}`;
  }
  return `${window.location.protocol}//${window.location.host}${url}`;
}

/**
 * @description 根据环境判断获取线上或者本地url
 * @param url 当前app应用的url地址
 * @returns url
 */
export function getRegistryUrl(appName: string, port: string): string {
  const isLocal = window.location.origin.startsWith('http://localhost');
  return `${isLocal ? `:${port}` : ''}/subapp/${appName}/`;
}

export function getRouteMeta(path: string, name: string, hash: string) {
  return routeCenter.getMeta(path, name, hash);
}

export function getRoute(module: string, pathOrName: string) {
  return routeCenter.get(module, pathOrName);
}

export function getParentRoutes(module: string, meta: RouteMeta, path: string) {
  const routes: {
    path: string;
    title: string;
    component: boolean;
  }[] = [
    {
      path,
      title: meta?.title as string,
      component: true
    }
  ];
  while (meta.parentName) {
    const routerInfo = routeCenter.get(module, meta.parentName as string);
    if (routerInfo) {
      const routerMode = routeCenter.getModuleRouterMode(module);
      routes.push({
        path: `/${module}${routerMode === 'hash' ? '/#' : ''}${routerInfo.path}`,
        title: routerInfo.meta?.title as string,
        component: true
      });
    }
    meta = routerInfo?.meta || ({} as RouteMeta);
  }

  return [...routes.slice(0, -1).reverse(), routes[routes.length - 1]];
}

// 根据子应用的路由 获取主线的原始路由，从而获取菜单的面包屑内容
export function getCustomParentRoute(module: string, path: string) {
  const mode = routeCenter.getModuleRouterMode(module);
  const url = path.replace(`/${module}${mode === 'history' ? '' : '/#'}`, '');
  return [
    {
      path: url,
      title: '',
      component: true
    }
  ];
}
