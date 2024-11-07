const { defineConfig } = require('@vue/cli-service')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const MicroRouterJsonPlugin = require('micro-router-json-plugin')
const path = require('path');
console.log(process.cwd() +'/src/router.js')
module.exports = defineConfig({
  publicPath: '/vue2/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'consumer',
        filename: 'remoteLib.umd.js',
        remotes: {
          myRemote: 'webpackChunkload_myRemote@http://localhost:9003/remoteLib.umd.js',
        },
      }),
      new MicroRouterJsonPlugin({
        routerPath: process.cwd() +'/src/router.js',
        encrypt:false
      })
    ],
  },
  outputDir: path.resolve(__dirname, '../../../../dist/vue2'), 
  devServer: {
    hot: true,
    port: 7001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  lintOnSave: false,
})
