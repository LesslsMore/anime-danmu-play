import { defineConfig } from 'vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import AutoImport from 'unplugin-auto-import/vite';
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: [util.unimportPreset],
    }),
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: '动漫弹幕播放',
        namespace: 'https://github.com/LesslsMore/anime-danmu-play',
        version: '0.4.0',
        author: 'lesslsmore',
        license: 'MIT',
        description: '自动匹配加载动漫剧集对应弹幕并播放，目前支持樱花动漫、风车动漫',
        icon: 'https://cdn.yinghuazy.xyz/webjs/stui_tpl/statics/img/favicon.ico',
        include: [
          // 'https://www.dmla*.com/play/*', // 风车动漫
          /^https:\/\/www\.dmla.*\.com\/play\/.*$/,
          'https://danmu.yhdmjx.com/*',
          'https://www.tt776b.com/play/*', // 风车动漫
          'https://www.dm539.com/play/*', // 樱花动漫
          // 'https://www.agedm.org/play/*',
          // 'https://43.240.156.118:8443/vip/?url=age_*',

        ],
        connect: [
          'https://api.dandanplay.net/*',
          'https://danmu.yhdmjx.com/*',
          'http://v16m-default.akamaized.net/*',
          'self',
          '*',
        ],
        'run-at': 'document-end',
      },
      build: {
        externalGlobals: {
          axios: cdn.jsdelivr('axios', 'dist/axios.min.js'),
          'crypto-js': cdn.jsdelivr('CryptoJS', 'crypto-js.js'),
          'artplayer': cdn.jsdelivr('Artplayer', 'dist/artplayer.js'),
          'artplayer-plugin-danmuku': cdn.jsdelivr('artplayerPluginDanmuku', 'dist/artplayer-plugin-danmuku.js'),
          'dexie': cdn.jsdelivr('Dexie', 'dist/dexie.min.js'),
          'file-saver': cdn.jsdelivr('saveAs', 'dist/FileSaver.min.js'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
});
