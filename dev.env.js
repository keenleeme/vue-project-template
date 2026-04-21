import { DEV_PROXY_TARGET_local_server } from './.env.development.js';

export const proxy = {
  '^/assets':{
    target: DEV_PROXY_TARGET_local_server,
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/assets/, '')
  },
  '^/screen': {
    target: DEV_PROXY_TARGET_local_server,
    changeOrigin: true,
    secure: false
  },
  '^/api/user': {
    target: DEV_PROXY_TARGET_local_server,
    changeOrigin: true,
    secure: false,
    logLevel: 'debug'
  },
  '^/api': {
    target: DEV_PROXY_TARGET_local_server,
    changeOrigin: true,
    secure: false
  },
};