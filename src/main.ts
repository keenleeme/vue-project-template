import { createApp } from 'vue';
import '@unocss/reset/normalize.css';
// import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import 'virtual:uno.css';
import '@/theme/theme.css';
import '@/theme/themeAntdReset.css';
import App from './App.vue';
import './assets/font/iconfont.css';
import i18n from './locale/index';
// micro按需生成
import { startMicro } from './micro';
import router from './router';
import pinia from './store';
import { UedWBCInstall } from './views/uedModule/loginConfig/plugin';

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

app.use(UedWBCInstall);

(async () => {
  // micro按需生成
  await startMicro(router);
  app.use(router);
  app.mount('#app');
})();
