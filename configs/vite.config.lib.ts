import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/remote-lib.js',
      name: 'remoteLib',
      formats: ['umd'],
      fileName: 'remoteLib'
    }
  }
});
