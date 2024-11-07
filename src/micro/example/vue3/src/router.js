import { createWebHistory, createRouter } from 'vue-router';
import AboutView from './components/About.vue';
import Custom from './components/Custom.vue';
import HomeView from './components/Home.vue';

const routes = [
  { path: '/home', component: HomeView },
  { path: '/', redirect: '/home' },
  { path: '/about', component: AboutView },
  { path: '/custom', component: Custom }
];

const router = createRouter({
  history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || '/vue3'), // history mode
  routes
});

export default router;
