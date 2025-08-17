<template>
  <div class="video-container" width="100vw" height="100vw" allowfullscreen>
  </div>
</template>

<script setup>
// 弹幕相关依赖
import { init_player } from '@/danmu/player/player'
import {init_danmu_player, get_anime_list, set_anime_name} from '@/danmu/player/search'
import {db_info} from "@/danmu/db/db";
// import {set_db_url_info} from "@/danmu/db/db_url";

import posterImg from '@/assets/image/backgroud.png'
// import posterImg from '@/assets/image/wallpaper.jpg'



let artContainer = '.video-container'
// let art = null;

// init_danmu_player(art)

async function updateArtPlayer(art, anime_id, title, url, episode) {
  anime_id = `${title}`

  // 获取播放信息
  let info = {
    anime_id,
    title,
    src_url: url,
    url,
    episode,
  }

  // 使用方式
  const animeData = {
    name: title,
    episode,
    url,
  }

  upsertAnimeVod(animeData).then(response => {
    console.log('更新成功:', response)
  })

  // await set_db_url_info(info)

  art.storage.set('info', info)
  console.log('info: ', info)
  let db_anime_info = await db_info.get(anime_id)
  if (db_anime_info) {

  } else {
    db_anime_info = {
      animes: [{ animeTitle: title }],
      anime_idx: 0,
      episode_dif: 0,
    }
    await db_info.put(anime_id, db_anime_info)
  }
  console.log('db_anime_info: ', db_anime_info)
  // let { src_url, db_anime_info, db_anime_url } = await save_anime_info_db(anime_id, title, url)

  // await art.switchUrl(info.src_url || url)

  // 设置番剧名称
  await set_anime_name(art)

  // 更新番剧列表
  await get_anime_list(art)
}

import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import {searchAnimeVod, upsertAnimeVod} from "../danmu/api/anime.js";
const route = useRoute()

onMounted(async () => {
  // const anime_id = route.query.anime_id
  // const episode = route.query.episode
  // const title = route.query.title
  // const url = route.query.video_url

  const urlParams = new URLSearchParams(window.location.search);
  const anime_id = urlParams.get('anime_id');

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

    await updateArtPlayer(art, anime_id, title, url, episode)
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
