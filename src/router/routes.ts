import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import TraceTaskDetail from '@/views/uedTypical/trace-task/detail.vue';
import TraceTaskIndex from '@/views/uedTypical/trace-task/index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/workBench' // 默认重定向到工作台，实际跳转由路由守卫控制
  },
  {
    name: 'base::das-readdy',
    path: '/das-readdy',
    beforeEnter() {
      const { token } = useUserStore();
      window.open(`https://10.20.114.19:8888/das-readdy?readdyAuthToken=${token}`, '_blank');
      return false; // 阻止原页面跳转
    },
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.dasReaddy',
      permissionId: 'base::workBench:index',
      fullScreen: true
    }
  },
  {
    name: 'base::chat-v',
    path: '/chat-v',
    beforeEnter() {
      window.open('https://chatv.das-security.cn/chat', '_blank');
      return false; // 阻止原页面跳转
    },
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.chatV',
      permissionId: 'base::workBench:index',
      fullScreen: true
    }
  },
  {
    name: 'base::chat-bi',
    path: '/chat-bi',
    beforeEnter() {
      window.open('http://10.20.114.19:8383/', '_blank');
      return false; // 阻止原页面跳转
    },
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.chatBI',
      permissionId: 'base::workBench:index',
      fullScreen: true
    }
  },
  {
    name: 'base::das-component',
    path: '/das-component',
    beforeEnter() {
      window.open('http://10.20.114.19:2081/', '_blank');
      return false; // 阻止原页面跳转
    },
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.dasComponent',
      permissionId: 'base::workBench:index',
      fullScreen: true
    }
  },
  {
    name: 'base::das-component-x',
    path: '/das-component-x',
    beforeEnter() {
      window.open('http://10.20.114.19:8091/', '_blank');
      return false; // 阻止原页面跳转
    },
    component: () => import('@/views/uedTypical/iframe/index.vue'),
    meta: {
      title: 'I18N.layout.dasComponentsX',
      permissionId: 'base::workBench:index',
      fullScreen: true
    }
  },
  {
    name: 'base::work-list',
    path: '/work-list',
    component: () => import('@/views/uedTypical/baseList/index.vue'),
    meta: {
      title: 'I18N.layout.lieBiaoYe',
      permissionId: 'base::workBench:index'
    },
    children: [
      {
        name: 'base::work-list-add',
        path: 'add',
        component: () => import('@/views/uedTypical/baseList/components/Add.vue'),
        meta: {
          title: '新增',
          permissionId: 'base::workBench:index'
        }
      }
    ]
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
  // {
  //   name: 'base::workBench-list',
  //   path: '/workBench-list',
  //   component: () => import('@/views/uedTypical/dashboardManage/index.vue'),
  //   meta: {
  //     title: 'I18N.layout.yiBiaoPanGuanLi',
  //     permissionId: 'base::workBench:index'
  //   }
  // },
  {
    name: 'base::dashboard',
    path: '/dashboard',
    component: () => import('@/views/uedTypical/dashboardManage/index.vue'),
    meta: {
      title: 'I18N.layout.yiBiaopan',
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
    name: 'base::trace-task',
    path: '/trace-task',
    component: TraceTaskIndex,
    meta: {
      title: 'I18N.layout.suYuanRenWu',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::trace-task-detail',
    path: '/trace-task/detail/:id',
    component: TraceTaskDetail,
    meta: {
      title: 'I18N.layout.suYuanRenWuXiangQing',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::trace-task-sensitive-flow',
    path: '/trace-task/sensitive-data-flow',
    component: () => import('@/views/uedTypical/trace-task/sensitive-data-flow/index.vue'),
    meta: {
      title: 'I18N.layout.minGanShuJuLiuZhuanLianLu',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::announcement-warning',
    path: '/announcement-warning',
    component: () => import('@/views/uedTypical/announcement-warning/index.vue'),
    meta: {
      title: '公告预警',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::announcement-warning-editor',
    path: '/announcement-warning/editor',
    component: () => import('@/views/uedTypical/announcement-warning/editor.vue'),
    meta: {
      title: '公告编辑',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::announcement-warning-todo',
    path: '/announcement-warning/todo',
    component: () => import('@/views/uedTypical/announcement-warning/todo.vue'),
    meta: {
      title: '公告待办',
      permissionId: 'base::workBench:index'
    }
  },
  {
    name: 'base::announcement-warning-confirm',
    path: '/announcement-warning/confirm/:id',
    component: () => import('@/views/uedTypical/announcement-warning/confirm.vue'),
    meta: {
      title: '公告确认',
      permissionId: 'base::workBench:index'
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
    name: 'base::componentsGuide',
    path: '/componentsGuide',
    component: () => import(/* webpackChunkName: "componentsGuide" */ '@/views/uedTypical/componentsGuide/index.vue'),
    meta: {
      title: 'I18N.api.common.yinDaoTiShiZuJian',
      permissionId: 'base::workBench:index',
      fullScreen: true
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
      title: 'I18N.layout.App',
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
