import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
// import VueDevTools from 'vite-plugin-vue-devtools';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      fs: {
        strict: true
      }
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
        emitWarning: false
      }),
      // VueDevTools()
    ]
  },
  baseConfig
);
