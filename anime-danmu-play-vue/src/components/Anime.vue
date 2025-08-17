<template>
  <div class="anime-container">
    <el-row :gutter="20">
      <el-col
          v-for="item in animeList"
          :key="item.vod_id"
          :span="3"
          class="anime-card-col"
      >
        <el-card :body-style="{ padding: '10px' }" class="anime-card">
          <div class="anime-image-placeholder">
            <el-image
                :src="defaultImage"
                fit="cover"
                class="anime-image"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="anime-info">
            <div class="anime-title" :title="item.vod_name">{{ item.vod_name }}</div>
            <div class="anime-time">
              <div class="created-at">创建: {{ formatDate(item.created_at) }}</div>
              <div class="updated-at">更新: {{ formatDate(item.updated_at) }}</div>
            </div>
            <div class="site-selection">
              <el-select
                  v-model="selectedSite[item.vod_id]"
                  placeholder="选择线路"
                  size="small"
                  @change="handleSiteChange(item.vod_id, item.vod_play_url, $event)"
              >
                <el-option
                    v-for="(site, siteName) in item.vod_play_url"
                    :key="siteName"
                    :label="siteName"
                    :value="siteName"
                />
              </el-select>
            </div>
            <div class="play-button">
              <el-button
                  type="primary"
                  size="small"
                  @click="playAnime(item)"
                  :disabled="!selectedSite[item.vod_id]"
              >
                播放
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="pagination-container">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36, 48]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { getAnimeVod } from '@/danmu/api/anime.js'
import { useRouter } from 'vue-router'

const router = useRouter()

// 数据相关
const animeList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)

// 站点选择
const selectedSite = reactive({})

// 默认图片
const defaultImage = 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'

// 格式化时间
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取动漫列表
const fetchAnimeList = async () => {
  try {
    const res = await getAnimeVod({
      page_num: currentPage.value,
      page_size: pageSize.value
    })

    if (res.code === 0) {
      animeList.value = res.data.rows
      total.value = res.data.total

      // 初始化每个项目的默认选中线路
      res.data.rows.forEach(item => {
        const sites = Object.keys(item.vod_play_url)
        if (sites.length > 0) {
          selectedSite[item.vod_id] = sites[0]
        }
      })
    }
  } catch (error) {
    console.error('获取动漫列表失败:', error)
  }
}

// 处理线路选择变化
const handleSiteChange = (vodId, playUrls, siteName) => {
  // 这里可以做一些线路切换后的操作
  console.log(`动漫 ${vodId} 切换到线路: ${siteName}`)
}

// 播放动漫
const playAnime = (anime) => {
  const site = selectedSite[anime.vod_id]
  const urls = anime.vod_play_url[site]
  const firstUrlKey = Object.keys(urls)[0]
  const url = urls[firstUrlKey]

  router.push({
    path: '/play',
    query: {
      url: url,
      title: anime.vod_name
    }
  })
}

// 分页相关
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchAnimeList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchAnimeList()
}

// 初始化
onMounted(() => {
  fetchAnimeList()
})
</script>

<style scoped>
.anime-container {
  padding: 20px;
}

.anime-card-col {
  margin-bottom: 20px;
}

.anime-card {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.anime-image-placeholder {
  height: 120px;
  overflow: hidden;
  border-radius: 4px;
}

.anime-image {
  width: 100%;
  height: 100%;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.anime-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.anime-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.anime-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.created-at,
.updated-at {
  margin-bottom: 5px;
}

.site-selection {
  margin-bottom: 10px;
}

.play-button {
  margin-top: auto;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
