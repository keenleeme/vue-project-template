import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'base::base-list',
    path: '/base-list',
    component: () => import('@/views/baseList/index.vue'),
    meta: {
      title: 'I18N.layout.lieBiaoYe',
      permissionId: 'base::home:index'
    }
  },
  {
    name: 'base::home',
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: 'I18N.common.home',
      permissionId: 'base::home:index'
    }
  },
  {
    name: 'base::theme',
    path: '/theme',
    component: () => import('@/views/theme/index.vue'),
    meta: {
      title: 'I18N.theme.zhuTi',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base::workBench',
    path: '/workBench',
    component: () => import('@/views/workBench/index.vue'),
    meta: {
      title: 'I18N.layout.gongZuoTai',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base-form',
    path: '/base-form',
    component: () => import('@/views/baseForm/index.vue'),
    meta: {
      title: 'I18N.layout.jiChuBiaoDan',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base-detail',
    path: '/base-detail',
    component: () => import('@/views/baseDetail/index.vue'),
    meta: {
      title: 'I18N.layout.jiChuXiangQing',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base-config',
    path: '/base-config',
    component: () => import('@/views/baseConfig/index.vue'),
    meta: {
      title: 'I18N.layout.jiChuPeiZhi',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base::dasUpgrade',
    path: '/dasUpgrade',
    component: () => import('@/views/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.zaiXianShengJi',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base::dasvScreen',
    path: '/dasvScreen',
    component: () => import('@/views/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.daPingZiDingYi',
      permissionId: 'base::home:index'
    }
  },
  {
    name: 'base::themeConfig',
    path: '/themeConfig',
    component: () => import('@/views/themeConfig/index.vue'),
    meta: {
      title: 'I18N.layout.zhuTiPeiZhiYe',
      permissionId: 'base::home:index'
    }
  },
  {
    name: 'base::loginConfig',
    path: '/loginConfig',
    component: () => import('@/views/loginConfig/index.vue'),
    meta: {
      title: 'I18N.layout.dengLuPeiZhiYe',
      permissionId: 'base::home:index'
    }
  },
  {
    name: 'base::vueTour',
    path: '/vueTour',
    component: () => import('@/views/vueTour/index.vue'),
    meta: {
      title: 'I18N.api.common.yinDaoYe',
      permissionId: 'base::home:index'
    }
  },
  {
    name: 'base::vueTour2',
    path: '/vueTour-page2',
    component: () => import('@/views/vueTour/page2.vue'),
    meta: {
      title: 'I18N.api.common.yinDaoYe2',
      permissionId: 'base::home:index'
    }
  },
  {
    name: 'sum-one',
    path: '/sum-one',
    component: () => import('@/views/RoutersMenus/index.vue'),
    meta: {
      title: 'sum-one',
      permissionId: 'sum-one'
    }
  },
  {
    name: 'sum-more',
    path: '/sum-more',
    meta: {
      title: 'sum-more',
      permissionId: 'sum-more'
    },
    children: [
      {
        name: 'sum-more-0',
        component: () => import('@/views/RoutersMenus/index.vue'),
        path: '/sum-more-0',
        meta: {
          permissionId: 'sum-more'
        }
      },
      {
        name: 'sum-more-1-0',
        component: () => import('@/views/RoutersMenus/index.vue'),
        path: '/sum-more-1-0',
        meta: {
          permissionId: 'sum-more'
        }
      },
      {
        name: 'sum-more-1-1',
        component: () => import('@/views/RoutersMenus/index.vue'),
        path: 'sum-more-1-1',
        meta: {
          permissionId: 'sum-more'
        }
      },
      {
        name: 'sum-more-1-2',
        component: () => import('@/views/RoutersMenus/index.vue'),
        path: '/sum-more/sum-more-1-2',
        meta: {
          permissionId: 'sum-more'
        }
      },
      {
        name: 'sum-more-2',
        path: 'sum-more-2',
        children: [
          {
            name: 'sum-more-2-1',
            component: () => import('@/views/RoutersMenus/index.vue'),
            path: 'sum-more-2-1',
            meta: {
              permissionId: 'sum-more'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'example',
    path: '/example',
    meta: {
      title: 'example',
      permissionId: 'base::theme:index'
    },
    component: () => import('@/views/example/index.vue')
  }
];

const wihitetRoutes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      fullScreen: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/NotFound/index.vue'),
    meta: {
      title: '404',
      fullScreen: true
    }
  }
];

export default [...routes, ...wihitetRoutes];
