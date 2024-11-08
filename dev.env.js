const proxy = require('./.env.development.js');
module.exports = {
  proxy: {
    '^/assets':{
      target:'http://127.0.0.1:3000',
      changeorigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/assets/, '')
    },
    '^/screen': {
      target: proxy.DEV_PROXY_TARGET_xxy,
      changeOrigin: true,
      secure: false
    }
  }
};