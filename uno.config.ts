import { defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';
export default defineConfig({
  rules: [],
  shortcuts: [
    ['f-c-c', 'flex justify-center items-center'],
    ['wh-full', 'w-full h-full'],
    ['text-ellipsis', 'truncate'],
    ['flex-col', 'flex flex-col'],
  ],
  presets: [
    presetRemToPx({
      baseFontSize: 4
    }),
    presetUno(),
    presetAttributify()
  ],
  transformers: [transformerDirectives()]
});
