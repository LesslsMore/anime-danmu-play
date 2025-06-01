// 弹幕相关依赖
import { init_player } from '@/danmu/player/player'
import {init_danmu_player, get_anime_list, set_anime_name} from '@/danmu/player/search'
import {db_info} from "@/danmu/db/db";
import {set_db_url_info} from "@/danmu/db/db_url";

import posterImg from '@/assets/image/backgroud.png'
// import posterImg from '@/assets/image/wallpaper.jpg'

let artContainer = '.video-container'
// let art = null;

// init_danmu_player(art)

async function updateArtPlayer(art, anime_id, title, url, episode) {


    // 获取播放信息
    let info = {
      anime_id,
      title,
      src_url: url,
      url,
      episode,
    }
  
    await set_db_url_info(info)
  
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
    await set_anime_name(art)
    await get_anime_list(art)
  }

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const anime_id = urlParams.get('anime_id');
    const episode = urlParams.get('episode');
    const title = urlParams.get('title');
    const url = urlParams.get('video_url'); // 注意这里改为 video_url

    // document.getElementById('anime_id').textContent = anime_id || '未提供';
    // document.getElementById('episode').textContent = episode || '未提供';
    // document.getElementById('title').textContent = title || '未提供';
    // document.getElementById('video_url').textContent = url || '未提供';

    // const videoPlayer = document.getElementById('video_player'); // 这一行不再需要，因为 art 已经初始化
    if (url) {
        let art = init_player(url, artContainer, posterImg) // 在这里初始化 art
        init_danmu_player(art)
        await updateArtPlayer(art, anime_id, title, url, episode);

    } else {
        // videoPlayer.src = ''; // 清空src，避免显示错误
        // 可以添加一个提示，例如：
        // videoPlayer.alt = '视频URL未提供';
        console.log('视频URL未提供');
    }
});

