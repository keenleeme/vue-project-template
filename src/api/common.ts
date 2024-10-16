import { AppConfigType } from '@/store/modules/app/types';
import type { MenuType } from '@/store/modules/menus/types';

// 获取菜单数据
export async function getMenus(): Promise<MenuType[]> {
  return [
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
  return ['base::example:index', 'base::theme:index', 'base::workBench:index', 'sum-one', 'sum-two', 'sum-more'];
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
