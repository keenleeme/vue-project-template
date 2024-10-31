import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import compressPlugin from 'vite-plugin-compression';
import configImageminPlugin from './plugin/imagemin';

export default mergeConfig(
  {
    mode: 'production',
    plugins: [
      compressPlugin({
        ext: '.gz'
      }),
      configImageminPlugin()
    ],
    build: {
      rollupOptions: {
        // external: ['dayjs'],
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia']
          },
          // globals: {
          //   dayjs: 'dayjs'
          // },
        }
      },
      chunkSizeWarningLimit: 2000,
      // target: "esnext"
    }
  },
  baseConfig
);
