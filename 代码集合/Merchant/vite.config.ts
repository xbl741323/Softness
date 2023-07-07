import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "./src/assets/scss/index.scss";`,
  //     },
  //   },
  // },
  server: {
    host: 'localhost',
    // 指定服务器主机名
    port: 8000,
    // 指定服务器端口
    hmr: true,
    // 开启热更新
    open: true,
    // 在服务器启动时自动在浏览器中打开应用程序
    https: false,
    proxy: {
      '/service': {
        target: 'https://www.hnxmsq.cn/service/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/service/, '')
      }
    }
  }
})
