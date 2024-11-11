import { mergeConfig } from 'vite';
import compressPlugin from 'vite-plugin-compression';
import configImageminPlugin from './plugin/imagemin';
import baseConfig from './vite.config.base';

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
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia']
          }
        }
      },
      chunkSizeWarningLimit: 2000
    }
  },
  baseConfig
);
