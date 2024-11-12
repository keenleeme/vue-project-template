import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'base::base-list',
    path: '/base-list',
    component: () => import('@/views/uedTypical/baseList/index.vue'),
    meta: {
      title: 'I18N.layout.lieBiaoYe',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::example',
    path: '/example',
    component: () => import('@/views/uedTypical/example/index.vue'),
    meta: {
      title: 'I18N.common.example',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::workBench',
    path: '/workBench',
    component: () => import('@/views/uedTypical/workBench/index.vue'),
    meta: {
      title: 'I18N.layout.gongZuoTai',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base-form',
    path: '/base-form',
    component: () => import('@/views/uedTypical/baseForm/index.vue'),
    meta: {
      title: 'I18N.layout.jiChuBiaoDan',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base-detail',
    path: '/base-detail',
    component: () => import('@/views/uedTypical/baseDetail/index.vue'),
    meta: {
      title: 'I18N.layout.jiChuXiangQing',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base-config',
    path: '/base-config',
    component: () => import('@/views/uedTypical/baseConfig/index.vue'),
    meta: {
      title: 'I18N.layout.jiChuPeiZhi',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base::dasUpgrade',
    path: '/dasUpgrade',
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.zaiXianShengJi',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base::dasvScreen',
    path: '/dasvScreen',
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.daPingZiDingYi',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'custom-workbench',
    path: '/custom-workbench',
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.gongZuoTaiZiDingYi',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'custom-report',
    path: '/custom-report',
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.baoBiaoZiDingYi',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::themeConfig',
    path: '/themeConfig',
    component: () => import('@/views/uedModule/themeConfig/index.vue'),
    meta: {
      title: 'I18N.layout.zhuTiPeiZhiYe',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::loginConfig',
    path: '/loginConfig',
    component: () => import('@/views/uedModule/loginConfig/index.vue'),
    meta: {
      title: 'I18N.layout.dengLuPeiZhiYe',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::vueTour',
    path: '/vueTour',
    component: () => import(/* webpackChunkName: "vueTour" */ '@/views/uedTypical/vueTour/index.vue'),
    meta: {
      title: 'I18N.api.common.yinDaoYe',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::vueTour2',
    path: '/vueTour-page2',
    component: () => import(/* webpackChunkName: "vueTour" */ '@/views/uedTypical/vueTour/page2.vue'),
    meta: {
      title: 'I18N.api.common.yinDaoYe2',
      permissionId: 'base::workBench:index'
    }
  },
  {
    path: '/multiple/:page*',
    name: 'multiple',
    component: () => import(/* webpackChunkName: "multiple" */ '@/micro/example/multiple/index.vue'),
    meta: {
      public: true
    }
  },
  {
    path: '/custom',
    name: 'custom',
    component: () => import(/* webpackChunkName: "multiple" */ '@/views/uedTypical/example/custom.vue'),
    meta: {
      public: true
    }
  }
];

const wihitetRoutes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/uedModule/login/index.vue'),
    meta: {
      title: '登录',
      fullScreen: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/uedTypical/NotFound/index.vue'),
    meta: {
      title: '404',
      fullScreen: true
    }
  }
];

export default [...routes, ...wihitetRoutes];
