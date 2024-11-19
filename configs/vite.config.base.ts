import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite';
import { loadEnv } from './utils';
// import extra from 'fs-extra'


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
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
      ],
      dts: './auto-imports.d.ts',
      eslintrc: {
        enabled: false,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      vueTemplate: false,
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        })
      ]
    })
    // extra.copy(
    //   resolve(__dirname, '../node_modules/@ued-material/ued-wbc/dist/assets/ued-wbc'),
    //   resolve(__dirname, '../public/assets/ued-wbc'),
    // )
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src')
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
  build: {
    // rollupOptions: {
    //   plugins: [
    //     copy(
    //       {
    //         targets: [{
    //           src: resolve(__dirname, '../node_modules/@ued-material/ued-wbc/dist/components/assets'),
    //           dest: resolve(__dirname, '../dist/components/assets'),
    //         }]
    //       }
    //     )
    //   ]
    // }
    // copyPublicDir: true,

    // onEnd() {  
    //   // 根据环境变量判断是否在生产环境下复制文件  
    //   if (process.env.NODE_ENV === 'production') {  
    //     copy('source/static', 'dist/static').catch(err => console.error('复制静态文件失败:', err));  
    //   }  
    // }  
  },
  css: {}
});
