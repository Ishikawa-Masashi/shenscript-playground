import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  //   root: 'src',
  base: './',
  /**
   * [plugin:vite:css] '~antd/dist/antd.less' wasn't found.
   * less import no support webpack alias '~'
   *
   * Ref: https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
   */
  resolve: {
    alias: [{ find: /^~/, replacement: '' }],
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  build: {
    // outDir: './docs',

    rollupOptions: {
      //   external: ['react', 'react-dom'],
    },
  },
});
