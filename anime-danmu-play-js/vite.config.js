import { defineConfig } from 'vite';
import path from 'path';  // 引入 path 模块

export default defineConfig({
    // 本地测试环境
    server: {
        proxy: {
            // "/proxy": {
            //     target: `http://127.0.0.1:8000`,
            //     changeOrigin: true, // 允许跨域
            //     // rewrite: path => path.replace(/^\/api/, '')
            // }
        },
    },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // 关键配置
    }
  }
});