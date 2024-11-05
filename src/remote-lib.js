// 这种方式是利用vite.config.lib.ts打包成库的形式，并挂在到window上，子应用可以在window上获取
// 子应用加载<script src="path/to/button.umd.js"></script>
// import dayjs from 'dayjs';
// export default dayjs
import dayjs from 'dayjs';

window.webpackChunkload_myRemote = {
  get: (module) => {
    return Promise.resolve(() => {
      switch (module) {
        case './dayjs':
          return dayjs;
        default:
          throw new Error(`未知模块: ${module}`);
      }
    });
  },
  init: (shareScope) => {
    // 初始化代码（如果需要）
    console.log(shareScope);
  }
};

export { dayjs };
