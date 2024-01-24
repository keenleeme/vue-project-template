import { createApp } from 'vue';
import '@unocss/reset/normalize.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

/* eslint-disable */
import 'virtual:uno.css';
import App from './App.vue';
import i18n from './locale/index';
// micro按需生成
import { startMicro } from './micro';
import router from './router';
import pinia from './store';
import '@/assets/styles/theme.css'

const app = createApp(App);
app.use(pinia);

// micro按需生成
startMicro(router);

i18n(app);
app.use(Antd);
app.use(router);
app.mount('#app');
