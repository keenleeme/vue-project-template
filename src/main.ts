import { createApp } from 'vue';
import { ComponentLibrary } from '@ued-material/ued-wbc-vue3';
import '@unocss/reset/normalize.css';
// import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import 'virtual:uno.css';
import useDasComponent from '@/libs/hooks/useDasComponent';
import '@/theme/theme.css';
import '@/theme/themeAntdReset.css';
import App from './App.vue';
import './assets/font/iconfont.css';
import i18n from './locale/index';
// micro按需生成
import { startMicro } from './micro';
import router from './router';
import pinia from './store';

const app = createApp(App);
app.use(pinia);
app.config.globalProperties.$tours = {};
app.config.globalProperties.$oem = {
  ahText: '安恒',
  baasText: 'BAAS',
  ailphaText: 'AILPHA'
};
i18n(app);
// app.use(Antd);
// 引用das-component
useDasComponent(app);
app.use(ComponentLibrary);
// app.use(Soul);

(async () => {
  // micro按需生成
  await startMicro(router);
  app.use(router);
  app.mount('#app');
})();
