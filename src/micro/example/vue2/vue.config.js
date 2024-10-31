const { defineConfig } = require('@vue/cli-service')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const MicroRouterJsonPlugin = require('micro-router-json-plugin')

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
  devServer: {
    hot: true,
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  lintOnSave: false,
})
