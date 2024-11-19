import { createApp } from 'vue';
import { ComponentLibrary } from '@ued-material/ued-wbc-vue3';
import '@ued-material/ued-wbc/css';
// import Soul from '@ailpha/soul-ui';
// import '@ailpha/soul-ui/dist/styles/index.css';
import '@unocss/reset/normalize.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

/* eslint-disable */
import 'virtual:uno.css';
import '@/theme/theme.css'
import '@/theme/themeAntdReset.css'
import App from './App.vue';
import i18n from './locale/index';
// micro按需生成
import { startMicro } from './micro';
import router from './router';
import pinia from './store';


const app = createApp(App);
app.use(pinia);
app.config.globalProperties.$tours = {};

// micro按需生成
startMicro(router);

i18n(app);
app.use(Antd);
app.use(ComponentLibrary);
// app.use(Soul);
app.use(router);
app.mount('#app');
