import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import devEnv from '../dev.env.js';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      fs: {
        strict: true
      },
      host: '0.0.0.0',
      port: 3000,
      proxy: devEnv.proxy
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
        emitWarning: false
      })
    ]
  },
  baseConfig
);
