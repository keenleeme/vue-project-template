/**
 * Image resource files used to compress the output of the production environment
 * 图片压缩
 * https://github.com/anncwb/vite-plugin-imagemin
 */
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
export default function configImageminPlugin() {
  const imageminPlugin = ViteImageOptimizer({
    jpg: {
      quality: 90,
    },
    png: {
      quality: 100
    }
  })
  return imageminPlugin;
}
