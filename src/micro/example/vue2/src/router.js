import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './components/home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    // title:'home页面', // 此处的需要从菜单数据里面获取 
    children:[]
  },
  {
    path: '/home/add',
    name: 'HomeAdd',
    component: () => import(/* webpackChunkName: "home" */ './components/HomeAdd.vue'),
    meta:{
      parentName:'home',
      title:'新增'
    }
  },
  {
    path: '/home/edit',
    name: 'Add',
    component: () => import(/* webpackChunkName: "home" */ './components/HomeAdd.vue'),
    meta:{
      parentName:'HomeAdd',
      title:'新增-下级'
    }
  },
  {
    path: '/custom',
    name: 'custom',
    component: () => import(/* webpackChunkName: "custom" */ './components/custom.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ './components/about.vue'),
    meta:{
      fullScreen:true
    }
  },
  {
    path: '/',
    name: 'layout',
    redirect:'/home',
  },
];

export default routes;
