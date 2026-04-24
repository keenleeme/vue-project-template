// 使用函数形式，确保在调用时 I18N 已经初始化
export default function getMenuMock() {
  return [
    {
      id: 1,
      title: I18N.layout.genericTypicalPage,
      icon: 'zq-icon zq-icon-zhihuitiaodu',
      path: '',
      url: '',
      children: [
        {
          id: 'workBench',
          title: I18N.layout.gongZuoTai,
          hideChildren: true,
          icon: 'zq-icon zq-icon-zhihuitiaodu',
          path: '/workBench',
          url: '/workBench',
          children: []
        },
        {
          id: 'dashboard',
          title: I18N.layout.yiBiaoPan,
          hideChildren: true,
          icon: 'zq-icon zq-icon-zhihuitiaodu',
          path: '/dashboard',
          url: '/dashboard',
          children: []
        },
        {
          id: 'workList',
          title: I18N.layout.lieBiaoYe,
          hideChildren: true,
          path: '/work-list',
          url: '/work-list',
          children: []
        },
        {
          id: 'baseForm',
          title: I18N.layout.biaoDanYe,
          hideChildren: true,
          path: '/base-form',
          url: '/base-form',
          children: []
        },
        {
          id: 'baseDetail',
          title: I18N.layout.xiangQingYe,
          hideChildren: true,
          path: '/base-detail',
          url: '/base-detail',
          children: []
        },
        {
          id: 'baseConfig',
          title: I18N.layout.peiZhiYe,
          hideChildren: true,
          path: '/base-config',
          url: '/base-config',
          children: []
        },
        {
          id: 'traceTask',
          title: I18N.layout.suYuanRenWu,
          hideChildren: true,
          path: '/trace-task',
          url: '/trace-task',
          children: []
        },
        {
          id: 'traceTaskSensitiveFlow',
          title: I18N.layout.minGanShuJuLiuZhuanLianLu,
          hideChildren: true,
          path: '/trace-task/sensitive-data-flow',
          url: '/trace-task/sensitive-data-flow',
          children: []
        },
        {
          id: 'announcementWarning',
          title: '公告预警',
          hideChildren: true,
          path: '/announcement-warning',
          url: '/announcement-warning',
          children: []
        },
        {
          id: 'announcementTodo',
          title: '我的公告待办',
          hideChildren: true,
          path: '/announcement-warning/todo',
          url: '/announcement-warning/todo',
          children: []
        }
      ]
    },
    {
      id: 'aiNengLi',
      title: I18N.layout.aiNengLi,
      icon: 'zq-icon zq-icon-jiancerenwuzhongxin',
      path: '',
      url: '',
      children: [
        {
          id: 'dasReaddy',
          title: I18N.layout.dasReaddy,
          icon: 'zq-icon zq-icon-jiancerenwuzhongxin',
          path: '/das-readdy',
          url: '/das-readdy',
          hideChildren: true,
          children: []
        },
        {
          id: 'chatV',
          title: I18N.layout.chatV,
          icon: 'zq-icon zq-icon-jiancerenwuzhongxin',
          path: '/chat-v',
          url: '/chat-v',
          hideChildren: true,
          children: []
        },
        {
          id: 'chatBI',
          title: I18N.layout.chatBI,
          icon: 'zq-icon zq-icon-jiancerenwuzhongxin',
          path: '/chat-bi',
          url: '/chat-bi',
          hideChildren: true,
          children: []
        }
      ]
    },
    {
      id: 'jiJian',
      title: I18N.layout.jiJian,
      icon: 'zq-icon zq-icon-shebeiguanli',
      path: '',
      url: '',
      children: [
        {
          id: 'dasComponent',
          title: I18N.layout.dasComponent,
          icon: 'zq-icon zq-icon-shebeiguanli',
          path: '/das-component',
          url: '/das-component',
          hideChildren: true,
          children: []
        },
        {
          id: 'dasComponentsX',
          title: I18N.layout.dasComponentsX,
          icon: 'zq-icon zq-icon-shebeiguanli',
          path: '/das-component-x',
          url: '/das-component-x',
          hideChildren: true,
          children: []
        }
      ]
    },
    {
      id: 'micro',
      title: I18N.layout.MicroApp,
      icon: 'zq-icon zq-icon-liuliangdaili',
      path: '/vue2/#/home',
      url: '/vue2/#/home',
      children: [
        {
          id: 'vue2',
          title: `vue2${I18N.layout.App}`,
          icon: 'zq-icon zq-icon-liuliangdaili',
          path: '',
          url: '',
          children: [
            {
              id: 'vue-home',
              title: `home${I18N.layout.Page}`,
              path: '/vue2/#/home',
              url: '/vue2/#/home',
              module: 'vue2'
            },
            {
              id: 'vue-about',
              title: `about${I18N.layout.Page}`,
              path: '/vue2/#/about',
              url: '/vue2/#/about',
              module: 'vue2'
            }
          ]
        },
        {
          id: 'vue3',
          title: `vue3${I18N.layout.App}`,
          path: '',
          url: '',
          children: [
            {
              id: 'vue3-home',
              title: `home${I18N.layout.Page}`,
              path: '/vue3/home',
              url: '/vue3/home',
              module: 'vue3'
            },
            {
              id: 'vue3-about',
              title: `about${I18N.layout.Page}`,
              path: '/vue3/about',
              url: '/vue3/about',
              module: 'vue3'
            }
          ]
        },
        {
          id: 'react',
          title: `react${I18N.layout.App}`,
          path: '',
          url: '',
          children: [
            {
              id: 'react-home',
              title: `home${I18N.layout.Page}`,
              path: '/react/home',
              url: '/react/home',
              module: 'react'
            },
            {
              id: 'react-about',
              title: `about${I18N.layout.Page}`,
              path: '/react/about',
              url: '/react/about',
              module: 'react'
            }
          ]
        },
        {
          id: 'angular',
          title: `angular${I18N.layout.App}`,
          path: '/angular/home',
          url: '/angular/home'
        },
        {
          id: 'multiple',
          title: `multiple${I18N.layout.App}`,
          path: '/multiple',
          url: '/multiple'
        },
        {
          id: 'custom',
          title: `${I18N.layout.Custom}${I18N.layout.Page}`,
          icon: 'zq-icon zq-icon-yewudingyi',
          path: '/custom',
          url: '/custom'
        }
      ]
    },
    {
      id: 8,
      title: I18N.layout.xiTongSheZhi,
      icon: 'zq-icon zq-icon-setting',
      path: '',
      url: '',
      children: [
        {
          id: 'themeConfig',
          title: I18N.layout.zhuTiPeiZhiYe,
          icon: 'zq-icon zq-icon-setting',
          path: '/themeConfig',
          url: '/themeConfig'
        },
        {
          id: 'loginConfig',
          title: I18N.layout.dengLuPeiZhiYe,
          path: '/loginConfig',
          url: '/loginConfig'
        },
        {
          id: 'dasUpgrade',
          title: I18N.layout.zaiXianShengJi,
          path: '/dasUpgrade',
          url: '/dasUpgrade'
        }
      ]
    }
  ];
}
