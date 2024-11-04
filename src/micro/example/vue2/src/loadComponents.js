(async () => {

  // 这是方式适用于vite打包出来的共享组件，因为是ems格式的

  // const container = await import(/* webpackIgnore: true */ "http://localhost:9003/assets/remoteEntry.js")
  // // await container.init(__webpack_share_scopes__.default);
  // const factory = await container.get('./dayjs');
  //  const module = factory(); // here is external exposed module
  // console.log(module.default().format('YYYY-MM-DD'))


  // import('myRemote/dayjs').then((dayjsModule) => {
  //   const dayjs = dayjsModule.default;
  //   console.log(dayjsModule);
  // });

  
})()

// 这是适用于基座单独针对共享的库 进行单独的构造MF识别的模式，使用umd模式进行打包 参考基座的 remote-lib.js 和 vite.config.lib.ts
import dayjs from 'myRemote/dayjs'
console.log(dayjs().format('YYYY-MM-DD'))
