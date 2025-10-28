import federation from '@originjs/vite-plugin-federation';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { dasComponentResolver } from 'das-component-vue';
// import extra from 'fs-extra';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { loadEnv } from './utils';

const env = loadEnv();

export default defineConfig({
  base: env?.BASE_PATH || '/',
  plugins: [
    vue(
      // micro 按需生成
      {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => /^(micro-app|ued-)/.test(tag)
            // isCustomElement: (tag) => /^micro-app/.test(tag)
          }
        }
      }
    ),
    vueJsx(),
    federation({
      name: 'home',
      filename: 'remoteEntry.js',
      // library: { type: 'var', name: 'core' },
      exposes: {
        './axios': 'axios',
        './ant-design-vue': 'ant-design-vue',
        './dayjs': 'dayjs'
      }
      // shared: require('../package.json').dependencies,
    }),
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: './auto-imports.d.ts',
      eslintrc: {
        enabled: false,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      },
      vueTemplate: false
    }),
    Components({
      directoryAsNamespace: true,
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        }),
        dasComponentResolver()
      ]
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src')
      },
      {
        find: 'vue/server-renderer',
        replacement: '@vue/server-renderer'
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js' // compile template
      }
    ],
    extensions: ['.ts', '.js']
  },
  define: {
    'process.env': JSON.stringify(env)
  },
  build: {},
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true // 启用JavaScript表达式
      }
    }
  }
});
