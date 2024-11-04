import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './components/home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
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
  },
  {
    path: '/',
    name: 'layout',
    redirect:'/home',
  },
];

export default routes;
