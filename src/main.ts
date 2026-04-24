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

const removeSplashLoader = () => {
  const loader = document.getElementById('loader');
  loader?.parentNode?.removeChild(loader);
};

(async () => {
  try {
    await startMicro(router);
    app.use(router);
    app.mount('#app');
  } catch (error) {
    console.error('[bootstrap] 应用启动失败', error);
    removeSplashLoader();
    const root = document.getElementById('app');
    if (root) {
      root.innerHTML =
        '<div style="padding:24px;line-height:1.6;color:#cf1322;font-family:sans-serif">' +
        '应用启动失败，请打开开发者工具 (F12) 查看控制台错误。<br/>' +
        '若与 Vite 预构建有关，可尝试：结束本机所有 node 进程后删除临时目录 ' +
        '<code style="word-break:break-all">%TEMP%\\\\cjtest-vue-project-template-vite</code> 再执行 npm run dev。' +
        '</div>';
    }
  }
})();
