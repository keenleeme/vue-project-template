import { message } from 'ant-design-vue';
import axios, { AxiosInstance } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
import pinia, { useUserStore, useMenusStore } from '@/store';
import { CreateAxiosConfig, ResponseType, RequestConfigType } from './types';

export default class Request {
  private instance: AxiosInstance;

  private userStore = useUserStore(pinia);

  private menusStroe = useMenusStore(pinia);

  constructor(createConfig: CreateAxiosConfig) {
    this.instance = axios.create(createConfig);
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { token } = this.userStore;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (err: any) => {
        message.error('接口请求配置错误');
        return Promise.reject(err);
      }
    );
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res;
      },
      (err: any) => {
        // 这里用来处理http常见错误，进行全局提示
        let msg = '';
        switch (err.response.status) {
          case 400:
            msg = '请求错误(400)';
            break;
          case 401:
            msg = '未授权，请重新登录(401)';
            this.userStore.reset();
            this.menusStroe.reset();
            router.replace('/login');
            break;
          case 403:
            msg = '拒绝访问(403)';
            break;
          case 404:
            msg = '请求出错(404)';
            break;
          case 408:
            msg = '请求超时(408)';
            break;
          case 500:
            msg = '服务器错误(500)';
            break;
          case 501:
            msg = '服务未实现(501)';
            break;
          case 502:
            msg = '网络错误(502)';
            break;
          case 503:
            msg = '服务不可用(503)';
            break;
          case 504:
            msg = '网络超时(504)';
            break;
          case 505:
            msg = 'HTTP版本不受支持(505)';
            break;
          default:
            msg = `连接出错(${err.response.status})!`;
        }
        message.error(msg);
        return Promise.reject(err);
      }
    );
  }

  request<D>(config: RequestConfigType): Promise<ResponseType<D>> {
    return new Promise((resolve, reject) => {
      this.instance(config)
        .then((res) => {
          // 当返回的 body 内的 code 小于 0 时，进入错误提示
          if (res.data.code < 0 && config.showError) {
            message.error(res.data.msg);
            reject(res.data);
            return;
          }
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public get<D = any>(url: string, params?: any, config?: RequestConfigType) {
    return this.request<D>({
      showError: true,
      ...(config || {}),
      method: 'GET',
      params,
      url
    });
  }

  public put<D = any>(url: string, data?: any, config?: RequestConfigType) {
    return this.request<D>({
      showError: true,
      ...(config || {}),
      method: 'PUT',
      data,
      url
    });
  }

  public post<D = any>(url: string, data?: any, config?: RequestConfigType) {
    return this.request<D>({
      showError: true,
      ...(config || {}),
      method: 'POST',
      data,
      url
    });
  }

  public delete<D = any>(url: string, params?: any, config?: RequestConfigType) {
    return this.request<D>({
      showError: true,
      ...(config || {}),
      method: 'DELETE',
      params,
      url
    });
  }
}
