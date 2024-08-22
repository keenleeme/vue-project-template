import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'base::home',
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      permissionId: 'base::home:index'
    }
  },
  {
    name: 'base::theme',
    path: '/theme',
    component: () => import('@/views/theme/index.vue'),
    meta: {
      title: '主题',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base::dasUpgrade',
    path: '/dasUpgrade',
    component: () => import('@/views/iframe/index.vue'),
    meta: {
      title: '在线升级',
      permissionId: 'base::theme:index'
    }
  },
  {
    name: 'base::dasvScreen',
    path: '/dasvScreen',
    component: () => import('@/views/iframe/index.vue'),
    meta: {
      title: '大屏自定义',
      permissionId: 'base::theme:index'
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
