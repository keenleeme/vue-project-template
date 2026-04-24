import { tmpdir } from 'os';
import { resolve } from 'path';
import { mergeConfig } from 'vite';
// import eslint from 'vite-plugin-eslint';
import { proxy } from '../dev.env.js';
import baseConfig from './vite.config.base';

/** 放在系统临时目录，避免项目目录被杀软/索引占用时 Vite 预构建 rename 失败（EPERM → 页面一直 Loading） */
const VITE_DEV_CACHE_DIR = resolve(tmpdir(), 'cjtest-vue-project-template-vite');

export default mergeConfig(
  {
    mode: 'development',
    cacheDir: VITE_DEV_CACHE_DIR,
    server: {
      fs: {
        strict: true
      },
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      proxy
    },
    optimizeDeps: {
      force: false // 使用稳定的开发缓存目录，避免 Windows 下频繁重建触发 EPERM
    },
    plugins: [
      // eslint({
      //   cache: false,
      //   include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      //   exclude: ['node_modules'],
      //   emitWarning: false
      // })
    ]
  },
  baseConfig
);
