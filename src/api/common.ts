import { AppConfigType } from '@/store/modules/app/types';
import type { MenuType } from '@/store/modules/menus/types';

// 获取菜单数据
export async function getMenus(): Promise<MenuType[]> {
  return [
    {
      id: 'workBench',
      title: '通用典型页面',
      icon: 'AppstoreOutlined',
      path: '/workBench',
      children: [
        {
          id: 'workBench',
          title: '工作台',
          icon: 'AppstoreOutlined',
          path: '/workBench'
        },
        {
          id: 'baseList',
          title: '列表页',
          icon: 'AppstoreOutlined',
          path: '/base-list'
        },
        {
          id: 'baseForm',
          title: '基础表单',
          icon: 'AppstoreOutlined',
          path: '/base-form'
        },
        {
          id: 'baseDetail',
          title: '基础详情',
          icon: 'AppstoreOutlined',
          path: '/base-detail'
        },
        {
          id: 'baseconfig',
          title: '基础配置',
          icon: 'AppstoreOutlined',
          path: '/base-config'
        }
      ]
    },
    {
      id: 'dasvScreen',
      title: '大屏自定义',
      icon: 'AppstoreOutlined',
      path: '/dasvScreen'
    },
    {
      id: 'themeConfig',
      title: '系统设置',
      icon: 'AppstoreOutlined',
      path: '/themeConfig',
      children: [
        {
          id: 'themeConfig',
          title: '主题配置页',
          icon: 'AppstoreOutlined',
          path: '/themeConfig'
        },
        {
          id: 'loginConfig',
          title: '登录配置页',
          icon: 'AppstoreOutlined',
          path: '/loginConfig'
        },
        {
          id: 'dasUpgrade',
          title: '在线升级',
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
      id: 'home',
      title: I18N.common.home,
      icon: 'AppstoreOutlined',
      path: '/home'
    },
    {
      id: 'theme',
      title: I18N.api.common.zhuTiYanShi,
      icon: 'AppstoreOutlined',
      path: '/theme'
    },
    {
      id: 'vueTour2',
      title: '引导页2',
      icon: 'AppstoreOutlined',
      path: '/vueTour-page2'
    },
    {
      id: 'sum-one',
      title: I18N.api.common.yiCengCaiDan,
      icon: 'AppstoreOutlined',
      path: '/sum-one'
    },
    {
      id: 'sum-more',
      title: I18N.api.common.duoCengCaiDan,
      icon: 'BarsOutlined',
      children: [
        {
          id: 'sum-more-0',
          title: I18N.api.common.erJiCaiDan,
          path: '/sum-more-0'
        },
        {
          id: 'sum-more-1',
          title: I18N.api.common.erJiCaiDanFen2,
          icon: 'BarsOutlined',
          children: [
            {
              id: 'sum-more-1-0',
              title: I18N.api.common.sanJiCaiDan,
              path: '/sum-more-1-0'
            },
            {
              id: 'sum-more-1-1',
              title: I18N.api.common.ziDongTianJiaQian,
              path: '/sum-more/sum-more-1-1'
            },
            {
              id: 'sum-more-1-2',
              title: I18N.api.common.youQianZhuiSanJi,
              path: '/sum-more/sum-more-1-2'
            }
          ]
        },
        {
          id: 'sum-more-2',
          title: I18N.api.common.erJiCaiDanFen,
          icon: 'BarsOutlined',
          children: [
            {
              id: 'sum-more-2-1',
              title: I18N.api.common.ziDongTianJiaDuo,
              path: '/sum-more/sum-more-2/sum-more-2-1'
            }
          ]
        }
      ]
    }
  ];
}

// 获取权限数据
export async function getPermissions() {
  return ['base::home:index', 'base::theme:index', 'base::workBench:index', 'sum-one', 'sum-two', 'sum-more'];
}

// 获取网站配置
export async function getWebsiteConfig(): Promise<
  Omit<AppConfigType, Extract<keyof AppConfigType, keyof { title?: string; subtitle?: string }>>
> {
  return {
    loginConfig: {
      //
    }
  };
}
