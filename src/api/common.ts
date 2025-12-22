import createService from '@/service';
import { AppConfigType } from '@/store/uedModule/app/types';
import { defaultLoginConfig } from '@/store/uedModule/login/defaultConfig';
import type { MenuType } from '@/store/uedModule/menus/types';
import getMenuMock from './menuMock';

// 获取菜单数据
export async function getMenus(): Promise<MenuType[]> {
  const menuMock = getMenuMock();
  return menuMock.filter((item) => item.children.length > 0 || item.path || item.url);
}

// 获取权限数据
export async function getPermissions() {
  return ['base::example:index', 'base::theme:index', 'base::workBench:index'];
}

// 获取网站配置
export async function getWebsiteConfig(): Promise<
  Omit<AppConfigType, Extract<keyof AppConfigType, keyof { title?: string; subtitle?: string }>>
> {
  const ZQ_LOGIN_CONFIG = JSON.parse(localStorage.getItem('ZQ_LOGIN_CONFIG') || '{}');
  return {
    loginConfig: {
      ...defaultLoginConfig,
      ...ZQ_LOGIN_CONFIG
    }
  };
}

export async function onLogin(data: any): Promise<any> {
  return createService.post('/api/user/v1/login', data);
}

export async function onRegister(data: any): Promise<any> {
  return createService.post('/api/user/v1/register', data);
}

export async function onLogout(): Promise<any> {
  return createService.post('/api/user/v1/logout');
}

export async function getCaptcha(): Promise<any> {
  return createService.get('/api/user/v1/captcha');
}

export async function refreshToken(): Promise<any> {
  return createService.post('/api/user/v1/refresh-token', {
    refreshToken: localStorage.getItem('refreshToken')
  });
}

export async function verifyToken(): Promise<any> {
  return createService.get('/api/user/v1/verify-token');
}

export async function getLoginRedirectUrl(params: { state: string; redirectUri: string }): Promise<any> {
  return createService.get('/api/user/v1/dingtalk/login-url', params);
}

export async function fetchDingTalkUserInfo(code: string): Promise<any> {
  return createService.get(`/api/user/v1/dingtalk/callback?code=${encodeURIComponent(code)}`);
}

export async function getUserInfo(): Promise<any> {
  return createService.get(`/api/user/v1/user`);
}
