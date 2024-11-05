import federation from '@originjs/vite-plugin-federation';
import vue from '@vitejs/plugin-vue';
import MicroRouterJsonPlugin from 'micro-router-json-plugin';
import { defineConfig } from 'vite';

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
  server: {
    port: 8090,
    host: true,
    fs: {
      strict: false
    }
  },
  base: `/vue3`
});
