import { AppConfigType } from '@/store/uedModule/app/types';
import { defaultLoginConfig } from '@/store/uedModule/login/defaultConfig';
import type { MenuType } from '@/store/uedModule/menus/types';

// 获取菜单数据
export async function getMenus(): Promise<MenuType[]> {
  return [
    {
      id: 'example',
      title: I18N.layout.gongZuoTaiZiDingYi,
      icon: 'zq-icon zq-icon-jiancerenwuzhongxin',
      path: '/custom-workbench'
    },
    {
      id: 'example',
      title: I18N.layout.baoBiaoZiDingYi,
      icon: 'AppstoreOutlined',
      path: '/custom-report'
    },
    {
      id: 'workBench',
      title: I18N.layout.genericTypicalPage,
      icon: 'AppstoreOutlined',
      path: '/workBench',
      children: [
        {
          id: 'workBench',
          title: I18N.layout.gongZuoTai,
          icon: 'AppstoreOutlined',
          path: '/workBench'
        },
        {
          id: 'baseList',
          title: I18N.layout.lieBiaoYe,
          icon: 'AppstoreOutlined',
          path: '/base-list'
        },
        {
          id: 'baseForm',
          title: I18N.layout.jiChuBiaoDan,
          icon: 'AppstoreOutlined',
          path: '/base-form'
        },
        {
          id: 'baseDetail',
          title: I18N.layout.jiChuXiangQing,
          icon: 'AppstoreOutlined',
          path: '/base-detail'
        },
        {
          id: 'baseConfig',
          title: I18N.layout.jiChuPeiZhi,
          icon: 'AppstoreOutlined',
          path: '/base-config'
        }
      ]
    },
    {
      id: 'dasvScreen',
      title: I18N.layout.daPingZiDingYi,
      icon: 'AppstoreOutlined',
      path: '/dasvScreen'
    },
    {
      id: 'themeConfig1',
      title: I18N.layout.xiTongSheZhi,
      icon: 'AppstoreOutlined',
      path: '/themeConfig',
      children: [
        {
          id: 'themeConfig',
          title: I18N.layout.zhuTiPeiZhiYe,
          icon: 'AppstoreOutlined',
          path: '/themeConfig'
        },
        {
          id: 'loginConfig',
          title: I18N.layout.dengLuPeiZhiYe,
          icon: 'AppstoreOutlined',
          path: '/loginConfig'
        },
        {
          id: 'dasUpgrade',
          title: I18N.layout.zaiXianShengJi,
          icon: 'AppstoreOutlined',
          path: '/dasUpgrade'
        },
        {
          id: 'vueTour',
          title: I18N.api.common.yinDaoYe,
          icon: 'AppstoreOutlined',
          path: '/vueTour'
        }
      ]
    },
    {
      id: 'example',
      title: I18N.common.example,
      icon: 'AppstoreOutlined',
      path: '/example'
    },
    {
      id: 'theme',
      title: I18N.api.common.zhuTiYanShi,
      icon: 'AppstoreOutlined',
      path: '/theme'
    },
    {
      id: 'vueTour2',
      title: I18N.api.common.yinDaoYe2,
      icon: 'AppstoreOutlined',
      path: '/vueTour-page2'
    },
    {
      id: 'micro',
      title: I18N.layout.MicroApp,
      children: [
        {
          id: 'vue2',
          title: `vue2${I18N.layout.App}`,
          path: '',
          children: [
            {
              id: 'vue-home',
              title: `home${I18N.layout.Page}`,
              path: '/vue2/#/home',
              module: 'vue2'
            },
            {
              id: 'vue-about',
              title: `about${I18N.layout.Page}`,
              path: '/vue2/#/about',
              module: 'vue2'
            }
          ]
        },
        {
          id: 'vue3',
          title: `vue3${I18N.layout.App}`,
          path: '',
          children: [
            {
              id: 'vue3-home',
              title: `home${I18N.layout.Page}`,
              path: '/vue3/home',
              module: 'vue3'
            },
            {
              id: 'vue3-about',
              title: `about${I18N.layout.Page}`,
              path: '/vue3/about',
              module: 'vue3'
            }
          ]
        },
        {
          id: 'react',
          title: `react${I18N.layout.App}`,
          path: '',
          children: [
            {
              id: 'react-home',
              title: `home${I18N.layout.Page}`,
              path: '/react/home',
              module: 'react'
            },
            {
              id: 'react-about',
              title: `about${I18N.layout.Page}`,
              path: '/react/about',
              module: 'react'
            }
          ]
        },
        {
          id: 'angular',
          title: `angular${I18N.layout.App}`,
          path: '/angular/home'
        },
        {
          id: 'multiple',
          title: `multiple${I18N.layout.App}`,
          path: '/multiple'
        },
        {
          id: 'custom',
          title: `${I18N.layout.Custom}${I18N.layout.Page}`,
          path: '/custom'
        }
      ]
    }
  ];
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
