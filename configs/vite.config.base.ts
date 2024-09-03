/*
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-22 16:50:45
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-03 16:11:38
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite';
import { loadEnv } from './utils';
import commonjs from '@rollup/plugin-commonjs';
import requireTransform from 'vite-plugin-require-transform';
const env = loadEnv();

export default defineConfig({
  base: env?.BASE_PATH || '/',
  plugins: [
    commonjs() as any,
    requireTransform({
      fileRegex: /.js$|.ts$/  // 使用正则表达式匹配需要作用的文件
    }),
    vue(
      // micro 按需生成
      {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => /^micro-app/.test(tag)
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
  css: {}
});
