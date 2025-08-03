import { request } from '@/danmu/api/request'

const end_point = import.meta.env.VITE_anime_api
// 新增或更新 AnimeVod 接口
async function upsertAnimeVod(animeData) {
    const res = await request({
        url: `${end_point}/api/anime/upsert`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: animeData
    })
    return res
}

// 在 anime.js 文件中添加以下内容

// 根据 name 和 episode 查询 AnimeVod 接口
async function searchAnimeVod(searchData) {
    const res = await request({
        url: `${end_point}/api/anime/search`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: searchData
    })
    return res
}

export {
    upsertAnimeVod,
    searchAnimeVod  // 添加到导出列表
}

