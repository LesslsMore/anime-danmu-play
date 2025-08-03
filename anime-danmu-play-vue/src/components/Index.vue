<template>
  <div class="container">
    <h1 style="display: flex; justify-content: center; align-items: center;">动漫弹幕播放</h1>
    <div class="input-row">
      <span style="margin-right: 4px;">动漫ID</span>
      <el-input v-model="form.anime_id" placeholder="动漫ID" style="width: 120px; margin-right: 8px;" />
      <span style="margin-right: 4px;">剧集</span>
      <el-input v-model="form.episode" placeholder="剧集" style="width: 80px; margin-right: 8px;" />
      <span style="margin-right: 4px;">标题</span>
      <el-input v-model="form.title" placeholder="标题" style="width: 160px; margin-right: 8px;" />
      <span style="margin-right: 4px;">视频URL</span>
      <el-input v-model="form.video_url" placeholder="视频URL" style="flex:1; margin-right: 8px;" />
      <el-button type="primary" @click="handlePlay">播放</el-button>
    </div>
    <div class="video-container" style="width: 64vw; height: 36vw; margin: 0 auto;">
      <iframe id="video_player" src="./play" allowfullscreen style="width: 100%; height: 100%; border: none;"></iframe>
    </div>
    <!-- <div class="video-container" style="width: 64vw; height: 36vw; margin: 0 auto; background: url('src/assets/image/backgroud.png') center center / cover no-repeat;">
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  anime_id: '9256',
  episode: '8',
  title: '夏日口袋',
  video_url: 'https://artplayer.org/assets/sample/video.mp4'
})

function get_param_url(animeId, episode, title, videoUrl) {
    const queryParams = new URLSearchParams();
    if (animeId) queryParams.append('anime_id', animeId);
    if (episode) queryParams.append('episode', episode);
    if (title) queryParams.append('title', title);
    if (videoUrl) queryParams.append('url', videoUrl);
    return queryParams.toString();
}

function handlePlay() {
  const animeId = form.anime_id;
  const episode = form.episode;
  const title = form.title;
  const videoUrl = form.video_url;

  // 构建查询参数
  const queryParams = get_param_url(animeId, episode, title, videoUrl);

  // 更新 iframe 的 src 属性
  const videoPlayer = document.getElementById('video_player');
  if (videoPlayer) {
    videoPlayer.src = `./play?${queryParams}`;
  }
}

onMounted(()=>{
  console.log('onMounted')
  handlePlay()
})
</script>

<style scoped>
h1 {
  margin: 0px 0px 16px 0px;
}
.container {
  background: #f5f7fa;
  width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
}
.input-row {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 16px;
  gap: 0;
}
.video-container {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}
</style>
