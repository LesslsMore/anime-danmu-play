import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';  // 引入 path 模块
// import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  // 关键配置
    }
  }
})
