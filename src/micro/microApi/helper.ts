import microApp, {getMicroAppActiveApps, setData } from './index';
import router from '@/router';
import type { MenuType } from '@/store/uedModule/menus/types';
import {SubApp} from '../store'
import { routeCenter } from '../index'


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


export function getCustomApps(apps: SubApp[]):SubApp[] {
  return apps.filter(item => item.custom)
}

export function delPrefix (prefix:string, path: string) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^/?${escapedPrefix}(?:/|#/?)?(.*)$`);
  const match = path.match(regex);
  if (match) {
    const remaining = match[1].replace(/^#?\/?/, '');
    return remaining ? `/${remaining}` : '/';
  }
  return path;
};

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

export function decorateLocationPath(fullPath: string, baseurl=''): {
  module?: string;
  path: string;
  routerMode?: string
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


  const { module } = routeCenter.get(_path) || {};
  return {
    module: module || '',
    path: `${_path}${_query}`,
    routerMode:module ? routeCenter.getModuleRouterMode(module):''
  };
}

/**
 * @description 判断当前应用是不是激活的子应用
 * @param appName 当前路由的app名称
 * @returns true/false 
 */
export function isActiveApp(appName: string) {
  const activeApps = getMicroAppActiveApps();
  return activeApps.includes(appName)
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
export function getAppRealUrl(url:string):string {
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) {
    return window.location.protocol + url;
  }
  if (url.startsWith(':')) {
    return `${window.location.protocol}//${window.location.hostname}${url}`;
  }
  return `${window.location.protocol}//${window.location.host}${url}`;
}
