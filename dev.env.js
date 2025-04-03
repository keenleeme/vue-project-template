const proxy = require('./.env.development.js');
module.exports = {
  proxy: {
    '^/assets':{
      target: proxy.DEV_PROXY_TARGET_xxy,
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/assets/, '')
    },
    '^/screen': {
      target: proxy.DEV_PROXY_TARGET_xxy,
      changeOrigin: true,
      secure: false
    },
    '^/api/users': {
      target: 'http://10.11.42.160:3000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    },
    '^/api': {
      target: proxy.DEV_PROXY_TARGET_xxy,
      changeOrigin: true,
      secure: false
    },
  }
};