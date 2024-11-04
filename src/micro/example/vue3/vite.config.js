import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import federation from "@originjs/vite-plugin-federation";

import MicroRouterJsonPlugin from 'micro-router-json-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host_app',
      remotes: {
        home: "http://localhost:9003/assets/remoteEntry.js",
      },
  }),
  MicroRouterJsonPlugin({
    routerPath: process.cwd() +'/src/router.js',
    encrypt:false
  })
  ],
  server: {
    port: 8090,
    host: true,
     fs: {
      strict: false
    },
  },
  base: `/vue3`
})
