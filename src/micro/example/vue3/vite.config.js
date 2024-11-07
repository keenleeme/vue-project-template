import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from "@originjs/vite-plugin-federation";
import MicroRouterJsonPlugin from 'micro-router-json-plugin'
import path from 'path'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host_app',
      remotes: {
        home: 'http://localhost:9003/assets/remoteEntry.js'
      }
    }),
    MicroRouterJsonPlugin({
      routerPath: `${process.cwd()}/src/router.js`,
      encrypt: false
    })
  ],
  build:{
    outDir: path.resolve(__dirname, '../../../../dist/vue3'), 
  },
  server: {
    port: 7002,
    host: true,
    fs: {
      strict: false
    }
  },
  base: `/vue3`
});
