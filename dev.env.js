const proxy = require('./.env.development.js');
module.exports = {
  proxy: {
    '^/assets':{
      target: proxy.DEV_PROXY_TARGET_local_server,
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/assets/, '')
    },
    '^/screen': {
      target: proxy.DEV_PROXY_TARGET_local_server,
      changeOrigin: true,
      secure: false
    },
    '^/api/user': {
      target: proxy.DEV_PROXY_TARGET_local_server,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    },
    '^/api': {
      target: proxy.DEV_PROXY_TARGET_local_server,
      changeOrigin: true,
      secure: false
    },
  }
};