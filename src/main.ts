import { createApp } from 'vue';
import Vue3Tour from 'vue3-tour';
import 'vue3-tour/dist/vue3-tour.css';
// import Soul from '@ailpha/soul-ui';
// import '@ailpha/soul-ui/dist/styles/index.css';
import '@unocss/reset/normalize.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

/* eslint-disable */
import 'virtual:uno.css';
import '@/assets/styles/theme.css';
import App from './App.vue';
import i18n from './locale/index';
// micro按需生成
import { startMicro } from './micro';
import router from './router';
import pinia from './store';

const app = createApp(App);
app.use(pinia);

// micro按需生成
startMicro(router);

i18n(app);
app.use(Antd);
// app.use(Soul);
app.use(router);
app.use(Vue3Tour);
app.mount('#app');
