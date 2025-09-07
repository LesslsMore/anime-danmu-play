<template>
  <div class="container">
    <h1 style="display: flex; justify-content: center; align-items: center;">动漫弹幕播放</h1>
    <div class="input-row">
      <span style="margin-right: 4px;">标题</span>
      <el-input v-model="form.title" placeholder="标题" style="width: 160px; margin-right: 8px;"/>
      <el-button type="primary" @click="searchAnime">搜索</el-button>

      <span style="margin: 0 4px 0 16px;">线路</span>
      <el-select
          v-model="selectedSite"
          placeholder="选择线路"
          style="width: 160px; margin-right: 8px;"
          @change="onSiteChange"
          :disabled="!siteOptions.length"
      >
        <el-option
            v-for="site in siteOptions"
            :key="site"
            :label="site"
            :value="site"
        />
      </el-select>

      <span style="margin-right: 4px;">剧集</span>
      <el-select
          v-model="selectedEpisode"
          placeholder="选择剧集"
          style="width: 100px; margin-right: 8px;"
          :disabled="!episodeOptions.length"
      >
        <el-option
            v-for="episode in episodeOptions"
            :key="episode"
            :label="episode"
            :value="episode"
        />
      </el-select>
      <span style="margin-right: 4px;">视频URL</span>
      <el-input v-model="form.video_url" placeholder="视频URL" style="flex:1; margin-right: 8px;"/>
      <el-button type="primary" @click="handlePlay" :disabled="!form.video_url">播放</el-button>
    </div>
    <div class="video-container" style="width: 64vw; height: 36vw; margin: 0 auto;">
      <iframe id="video_player" src="./play" allowfullscreen style="width: 100%; height: 100%; border: none;"></iframe>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from 'vue'
import {searchAnimeVod} from '@/danmu/api/anime.js'

const form = reactive({
  episode: '8',
  title: '夏日口袋',
  video_url: 'https://artplayer.org/assets/sample/video.mp4'
})

// 线路相关
const selectedSite = ref('')
const siteOptions = ref([])

// 剧集相关
const selectedEpisode = ref('')
const episodeOptions = ref([])

// 线路和剧集的映射数据
const siteEpisodeMap = ref({})

const playUrls = ref({})

// 搜索动漫
const searchAnime = async () => {
  if (!form.title) {
    return
  }

  try {
    const searchData = {
      name: form.title
    }

    const res = await searchAnimeVod(searchData)

    if (res.code === 0) {
      const animeData = res.data
      form.anime_id = animeData.vod_id

      // 处理线路数据
      playUrls.value = animeData.vod_play_url || {}
      siteOptions.value = Object.keys(playUrls.value)

      if (siteOptions.value.length > 0) {
        selectedSite.value = siteOptions.value[0]

        // 构建线路和剧集的映射关系
        siteEpisodeMap.value = {}
        siteOptions.value.forEach(site => {
          siteEpisodeMap.value[site] = Object.keys(playUrls.value[site] || {})
        })
        console.log('siteEpisodeMap:', siteEpisodeMap.value)

        // 更新剧集选项
        updateEpisodeOptions(selectedSite.value)
      } else {
        episodeOptions.value = []
        selectedEpisode.value = ''
        form.video_url = ''
      }
    }
  } catch (error) {
    console.error('搜索动漫失败:', error)
  }
}

// 当线路改变时更新剧集选项
const onSiteChange = (site) => {
  updateEpisodeOptions(site)
}

// 更新剧集选项
const updateEpisodeOptions = (site) => {
  episodeOptions.value = siteEpisodeMap.value[site] || []

  if (episodeOptions.value.length > 0) {
    selectedEpisode.value = episodeOptions.value[0]
  } else {
    selectedEpisode.value = ''
  }
}

// 监听剧集变化，更新视频URL
watch([selectedSite, selectedEpisode], ([site, episode]) => {
  if (site && episode && siteEpisodeMap.value[site]) {
    console.log('playUrls:', playUrls)
    form.video_url = playUrls.value[site][episode] || ''
  } else {
    form.video_url = ''
  }
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
  const episode = selectedEpisode.value;
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

onMounted(() => {
  console.log('onMounted')
  // searchAnime()
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}
</style>
