import type { Router, RouteRecordRaw, RouteMeta } from 'vue-router';

// import { rsaPrivateKeyPem } from '@/libs/const/index';
// import decryptJsonField from '@/libs/utils/aes';

// type proxyKeysData = [RegExp, string];
// type MetaMore = RouteRecordRaw['meta'] & { cover: boolean };
type BreadcrumbList = {
  path: string;
  title: RouteRecordRaw['name'];
};

export type RoutersValue = {
  path: string;
  module: string;
  name: RouteRecordRaw['name'];
  meta: RouteMeta | undefined;
  breadcrumb?: BreadcrumbList[];
};
type RouterMode = 'hash' | 'history';

export default class RouterCenter {
  private router: Router;

  private routes: Map<string, Map<string, RoutersValue>>;

  private proxyKeys: Array<[RegExp, string]>;

  private specialUrl: string[];

  private excludePath: string[];

  private routerMode: {
    [key: string]: RouterMode;
  };

  private customAppName: string;

  defaultPage: {
    url: string;
    module: string;
  }[];

  constructor(router: Router) {
    this.router = router;
    this.routes = new Map();
    this.proxyKeys = [];
    this.excludePath = ['/404', '/403', '/500', 'Login', 'NotFound', 'NotAccess', 'Error'];
    this.specialUrl = [];
    this.defaultPage = [];
    this.routerMode = {};
    this.customAppName = '';
  }

  setCustomAppName(name: string) {
    this.customAppName = name;
  }

  getCustomName() {
    return this.customAppName;
  }

  getRoutes() {
    return this.routes;
  }

  static lowerCasePath(path: string) {
    if (path.indexOf('/') !== -1) {
      return path.toLowerCase();
    }
    return path;
  }

  set(
    key: string,
    path: string,
    module: string,
    name: RouteRecordRaw['name'],
    meta: RouteMeta | undefined,
    breadcrumb?: BreadcrumbList[]
  ) {
    if (this.excludePath.includes(key)) {
      if (!meta?.cover) {
        return;
      }
      this.specialUrl.push(key);
    }
    let routersMap = this.routes.get(module);
    if (!routersMap) {
      this.routes.set(module, (routersMap = new Map()));
    }
    routersMap.set(key, { module, path, meta, name, breadcrumb });
  }

  get(module: string, key: string): RoutersValue | undefined {
    // const newKey: string = key;
    // 判断在不在里面，在的话取真实的key
    this.proxyKeys.every((item) => {
      const [regExp, newKey] = item;
      if ((regExp as unknown as RegExp).test(key)) {
        key = newKey;
        return false;
      }
      return true;
    });
    return this.routes.get(module)?.get(key);
  }

  getModuleRouterMode(module: string) {
    return this.routerMode[module];
  }

  getMeta(path: string, name: string, hash: string) {
    if (this.get(name, path)) {
      return this.get(name, path)?.meta || {};
    }
    let [noQueryPath] = path.split('?');
    if (hash) {
      noQueryPath = noQueryPath.replace(`/${name}/#`, '');
    } else {
      noQueryPath = noQueryPath.replace(`/${name}`, '');
    }
    return this.get(name, noQueryPath)?.meta || {};
  }

  // getThisPageMeta() {
  //   const { hash } = window.location;
  //   if (!hash) return {};
  //   const [path] = hash.split('?');
  //   return this.get(path.replace('#', ''));
  // }

  has(key: string) {
    this.proxyKeys.every((item) => {
      if ((item[0] as unknown as RegExp).test(key)) {
        // key = item[1];
        return false;
      }
      return true;
    });
    return this.routes.has(key);
  }

  setModuleRoutes(routerData: RouteRecordRaw[], module: string, routerMode?: RouterMode) {
    if (routerData) {
      this.routerMode[module] = routerMode || 'hash';
      // const routes = decryptJsonField(config, rsaPrivateKeyPem); // 目前是没有加密的
      this.traverseRoutes(routerData, module);
    }
  }

  // 将路由中心的所有路由添加到proxyKeys
  initRegExpKeyToKey() {
    // for (const key of this.routes.keys()) {
    for (const [key] of this.routes) {
      const regexpKey = key.replace(/:\w+/, '\\w+');
      this.proxyKeys.push([new RegExp(`^${regexpKey}$`), key]);
    }
  }

  traverseRoutes(
    routes: RouteRecordRaw[],
    module: string,
    parentPath = '',
    parentBreadcrumb?: BreadcrumbList[] | null
  ) {
    if (Array.isArray(routes)) {
      routes.forEach((route) => {
        if (route.path === '*' || route.path === '/') {
          return;
        }
        let breadcrumb: BreadcrumbList[] = [];
        if (route.path) {
          if (!/^\//.test(route.path) && !['*'].includes(route.path)) {
            const fullPath = RouterCenter.getFullPath(parentPath, route.path);
            this.set(
              route.path,
              fullPath,
              module,
              route.name,
              route.meta,
              RouterCenter.getBreadcrumb(parentBreadcrumb, route.path, route.name)
            );
            route.path = fullPath;
          }

          breadcrumb = RouterCenter.getBreadcrumb(parentBreadcrumb, route.path, route.name);
          this.set(route.path, route.path, module, route.name, route.meta, breadcrumb);
          // 配置默认的页面
          if (route.meta?.module && route.meta.defaultPage) {
            this.defaultPage.push({
              url: route.path,
              module: route.meta.module as string
            });
          }
        }
        if (route.name) {
          this.set(route.name as string, route.path, module, route.name, route.meta);
        }
        if (route.children) {
          this.traverseRoutes(route.children, module, route.path, breadcrumb);
        }
      });
    }
  }

  static getFullPath(parentPath: string, routePath: string) {
    if (parentPath === '/') {
      return routePath.startsWith('/') ? routePath : `/${routePath}`;
    }
    return `${parentPath}/${routePath}`;
  }

  static getBreadcrumb(
    parentBreadcrumb: BreadcrumbList[] | undefined | null,
    routerPath: string,
    title: RouteRecordRaw['name']
  ) {
    return parentBreadcrumb ? [...parentBreadcrumb, { path: routerPath, title }] : [{ path: routerPath, title }];
  }
}
