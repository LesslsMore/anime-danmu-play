import {request} from '@/danmu/api/request'

let end_point = '/proxy'
let Comment_GetAsync = '/api/v2/comment/'


let Related_GetRealtedAsync = `/api/v2/related/`
let Comment_GetExtCommentAsync = `/api/v2/extcomment?url=`

// https://api.dandanplay.net/swagger/index.html#/%E5%BC%B9%E5%B9%95/Comment_GetComment
let API_comment = '/api/v2/comment/'

// https://api.dandanplay.net/swagger/index.html#/%E6%90%9C%E7%B4%A2/Search_SearchEpisodes
let API_search_episodes = `/api/v2/search/episodes`

// https://api.dandanplay.net/swagger/index.html#/%E6%90%9C%E7%B4%A2/Search_SearchAnime
let Search_SearchAnimeAsync = `/api/v2/search/anime?keyword=`

// https://api.dandanplay.net/swagger/index.html#/%E7%95%AA%E5%89%A7/Bangumi_GetBangumiDetails

async function get_danmus(title, id) {

    // let animeId = await get_animeId(title)

    id = id.padStart(4, "0");
    let episodeId = `${animeId}${id}`
    console.log(episodeId)

    let danmu = await get_danmu(episodeId)
    let urls = await get_related_url(episodeId)
    // console.log(urls)
    if (urls.length > 0) {
        for (let i = 0; i < urls.length; i++) {
            let danmu_ext = await get_danmu_ext(urls[i].url)
            danmu = [...danmu, ...danmu_ext]
        }
    }
    return danmu
}

function get_episodeId(animeId, id) {
    id = id.toString().padStart(4, "0");
    let episodeId = `${animeId}${id}`
    return episodeId
}

// 获取 danmu 中 animeId
async function get_animeId(title) {
    let url = `${end_point}${Search_SearchAnimeAsync}${title}`
    let data = await request.get(url)
    // data = JSON.parse(data)
    console.log(data)
    let {animeId, animeTitle} = data.animes[0]
    console.log(animeId)
    console.log(animeTitle)
    return animeId
}

// 获取 anime, episode
async function get_search_episodes(anime, episode) {
    const res = await request({
        url: `${end_point}${API_search_episodes}`,
        method: 'get',
        params: {anime, episode},
    })
    // const res = await request({
    //     url: `${end_point}${API_search_episodes}?anime=${anime}`,
    //     method: 'get',
    //     // params: {
    //     //     anime,
    //     //     episode,
    //     // },
    // })
    console.log(res)
    return res.animes
}

async function get_url(url) {
    let res
    try {
        res = await request({
            url: 'https://api.nnsvip.cn',
            method: 'get',
            params: {url},
        })
        console.log(res)
    } catch (error) {
        console.log('get_url error: ', error)
    }
    if (res.url) {
        if (res.url.endsWith('.m3u8')) {
            return res.url
        }
    }
    return url
}

// 获取原始 danmu
async function get_comment(episodeId) {
    const res = await request({
        url: `${end_point}${API_comment}${episodeId}?withRelated=true&chConvert=1`,
        method: 'get',
    })
    // console.log(res)
    return res.comments
}


// 获取原始 danmu
async function get_danmu(episodeId) {
    let url = `${end_point}${Comment_GetAsync}${episodeId}`
    console.log('获取原始 danmu')
    console.log(url)
    let data = await request.get(url)
    // data = JSON.parse(data)
    // let animeId = data.animes[0].animeId
    // console.log('获取原始 danmu 数目：')
    // console.log(data.count)
    return data.comments
}

// 获取视频相关 url
async function get_related_url(episodeId) {
    let url = `${end_point}${Related_GetRealtedAsync}${episodeId}`
    console.log('获取视频相关 url')
    console.log(url)
    let data = await request.get(url)
    // data = JSON.parse(data)
    // let animeId = data.animes[0].animeId
    // console.log(data)
    return data.relateds
}

// 获取扩展 danmu
async function get_danmu_ext(related_url) {
    let url = `${end_point}${Comment_GetExtCommentAsync}${related_url}`
    console.log('获取扩展 danmu')
    console.log(url)
    let data = await request.get(url)
    // data = JSON.parse(data)

    // let animeId = data.animes[0].animeId
    // console.log('获取扩展 danmu 数目：')
    // console.log(data.count)
    return data.comments
}

export {
    get_search_episodes,
    get_comment,
    get_episodeId,
    get_url,
}
