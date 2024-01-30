import { Router } from 'vue-router';
import microApp from '@micro-zoe/micro-app';
import { setupAddMicroRouter } from './routerControl';

export function startMicro(router: Router) {
  setupAddMicroRouter(router);
  microApp.start();
}
