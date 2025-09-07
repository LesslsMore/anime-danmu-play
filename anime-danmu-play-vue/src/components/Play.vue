<template>
  <div class="video-container" width="100vw" height="100vw" allowfullscreen>
  </div>
</template>

<script setup>
// 弹幕相关依赖
import {init_player} from '@/danmu/player/player'
import {get_anime_list, init_danmu_player, set_anime_name} from '@/danmu/player/search'
import {db_info} from "@/danmu/db/db";
import posterImg from '@/assets/image/backgroud.png'
import {useRoute} from 'vue-router'
import {onMounted} from 'vue'
import {searchAnimeVod, upsertAnimeVod} from "../danmu/api/anime.js";


let artContainer = '.video-container'

// let art = null;


async function updateArtPlayer(art) {
  // 设置番剧名称
  await set_anime_name(art)

  // 更新番剧列表
  await get_anime_list(art)
}

const route = useRoute()

onMounted(async () => {
  // const episode = route.query.episode
  // const title = route.query.title
  // const url = route.query.video_url

  const urlParams = new URLSearchParams(window.location.search);

  const episode = urlParams.get('episode');
  const title = urlParams.get('title');
  let url = urlParams.get('url'); // 注意这里改为 video_url

// 如果 url 为空，则通过 searchAnimeVod 接口获取
  if (!url) {
    try {
      const searchData = {
        name: title,
        episode: episode
      };

      const response = await searchAnimeVod(searchData);

      if (response.success && response.data && response.data.length > 0) {
        url = response.data[0].url;
        console.log('通过接口获取到的视频地址:', url);
      } else {
        console.log('未找到视频地址');
      }
    } catch (error) {
      console.error('获取视频地址失败:', error);
    }
  }

  if (url) {
    // 初始化播放器
    let art = init_player(url, artContainer, posterImg)
    // 初始化弹幕
    init_danmu_player(art)


    // 获取播放信息
    let info = {
      title,
      url,
      episode,
    }

    let db_info = {
      anime_idx: 0,
      episode_dif: 0,
      animeTitle: null,
      animeId: null,
      // animes: [{animeTitle: title}],
    }
    art.storage.set('info', info)
    art.storage.set(title, db_info)

    await updateArtPlayer(art)
  } else {
    let art = init_player('.m3u8', artContainer, posterImg)
    console.log('视频URL未提供')
  }
})
</script>


<style scoped>
html, body {
  margin: 0;
  height: 100%;
  overflow: hidden; /* Prevent scrollbars if not needed */
}

.video-container {
  height: 100%;
  width: 100%;
}
</style>
