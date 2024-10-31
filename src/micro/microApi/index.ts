// import { Record } from '@micro-app/types';
import type { Router } from 'vue-router';
import type { RouterGuard, prefetchParamList } from '@micro-app/types';
import microApp from '@micro-zoe/micro-app';
import type { unmountAppParams, microData } from './types';

/**
 * @description 获取正在运行的子应用，不包含已卸载和预加载的应用
 * @param excludeHiddenApp 是否过滤处于隐藏状态的keep-alive应用，默认false
 */
export function getMicroAppActiveApps(excludeHiddenApp?: boolean): string[] {
  return microApp.getActiveApps({
    excludeHiddenApp
  });
}

/**
 * @description 获取所有子应用，包含已卸载和预加载的应用
 * @returns
 */
export function getMicroAllApps(): string[] {
  return microApp.getAllApps();
}

/**
 * @description 手动卸载应用
 * @returns Promise<boolean>
 */
export function unmountMicroApp(appName: string, options?: unmountAppParams): Promise<boolean> {
  return microApp.unmountApp(appName, options);
}

/**
 * @description 手动卸载所有应用
 * @returns Promise<boolean>
 */
export function unmountMicroAllApps(options?: unmountAppParams): Promise<boolean> {
  return microApp.unmountAllApps(options);
}

/**
 * @description 向指定的子应用发送数据
 */
export function setData(appName: string, data: microData): void {
  microApp.setData(appName, data);
}

/**
 * @description 获取指定的子应用data数据
 * @returns 返回appName子应用的data数据
 */
export function getData(appName: string): microData | null {
  return microApp.getData(appName);
}

/**
 * @description 绑定监听函数
 * @param appName: 应用名称
 * @param dataListener: 绑定函数
 * @param autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
export function microAppAddDataListener(appName: string, dataListener: CallableFunction, autoTrigger?: boolean): void {
  microApp.addDataListener(appName, dataListener, autoTrigger);
}

/**
 * @description 解除基座绑定的指定子应用的数据监听函数
 * @param appName: 应用名称
 * @param dataListener: 绑定函数
 */
export function microAppRemoveDataListener(appName: string, dataListener: CallableFunction): void {
  microApp.removeDataListener(appName, dataListener);
}

/**
 * @description 清空基座绑定的指定子应用的所有数据监听函数
 * @param appName: 应用名称
 */
export function microAppClearDataListener(appName: string): void {
  microApp.clearDataListener(appName);
}

/**
 * @description 获取全局数据
 */
export function microAppGetGlobalData(): microData | null {
  return microApp.getGlobalData();
}

/**
 * @description 绑定监听函数
 * @param dataListener: 绑定函数
 * @param autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
export function microAppAddGlobalDataListener(dataListener: CallableFunction, autoTrigger?: boolean): void {
  microApp.addGlobalDataListener(dataListener, autoTrigger);
}

/**
 * @description 解绑全局数据监听函数
 */
export function microAppRemoveGlobalDataListener(dataListener: CallableFunction): void {
  microApp.removeGlobalDataListener(dataListener);
}

/**
 * @description 清空基座应用绑定的所有全局数据监听函数
 */
export function microAppClearGlobalDataListener(): void {
  microApp.clearGlobalDataListener();
}

/**
 * @description 清空基座应用绑定的所有全局数据监听函数
 */
export function microAppSetGlobalData(data: microData) {
  microApp.setGlobalData(data);
}

/**
 * @description 预加载代码
 */
export function microAppPreFetch(apps: prefetchParamList) {
  microApp.preFetch(apps);
}

// 设置主应用的路由信息，方便给子应用跳转  const baseRouter = window.microApp.router.getBaseAppRouter() baseRouter.主应用路由的方法(...)
export function setBaseAppRouter(router: Router) {
  microApp.router.setBaseAppRouter(router);
}

export function monitorChildRouterChange(guard: RouterGuard): () => boolean {
  return microApp.router.beforeEach(guard);
}
// window.microApp = microApp;
export default microApp;
