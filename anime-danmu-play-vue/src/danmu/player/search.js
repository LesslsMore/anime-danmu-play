import {db_danmu, db_info} from "@/danmu/db/db.js";
import {get_bangumi_details, get_comment, get_episodeId, get_search_episodes} from "@/danmu/api/api.js";
import {art_msgs, init_danmu, update_danmu} from "@/danmu/player/danmu.js";
import {db_anime} from "../db/db.js";
import {upsertAnimeVod} from "@/danmu/api/anime.js";

let UNSEARCHED = ['未搜索到番剧弹幕', '请按右键菜单', '手动搜索番剧名称',]

let SEARCHED = () => {
    let $danmu_count = document.querySelector("#danmu_count")
    let $anime_list = document.querySelector("#anime_list")
    let $episode_list = document.querySelector("#episode_list")
    try {
        return [`番剧：${$anime_list.options[$anime_list.selectedIndex].text}`, `章节: ${$episode_list.options[$episode_list.selectedIndex].text}`, `已加载 ${$danmu_count.textContent} 条弹幕`,]
    } catch (e) {
        console.log(e)
        return []
    }
}

function init_episode_list(art) {
    let $episode_list = document.querySelector("#episode_list")


    async function update_episode_select(art) {
        // 章节
        let {
            title,
            episode,
        } = art.storage.get('info')
        let db_info = art.storage.get(title)
        let $episodes = document.querySelector("#episode_list")

        const episodeId = $episodes.value
        const episode_idx = $episodes.selectedIndex
        console.log('$episodes', $episodes)
        console.log('value: ', episodeId)
        console.log('selectedIndex: ', episode_idx)

        // 存储选择的剧集序号
        let dif = episode_idx + 1 - episode
        if (dif !== db_info['episode_dif']) {
            db_info['episode_dif'] = dif
            art.storage.set(title, db_info)
            console.log('title', db_info)
        }

        // 获取选中的值
        const episode_id = $episodes.value;

        // 在控制台打印选中的值
        let danmu
        try {
            // 优先使用接口数据
            danmu = await get_comment(episode_id)
            await db_danmu.put(episode_id, danmu)
        } catch (error) {
            console.log('接口请求失败，尝试使用缓存数据: ', error)
            danmu = await db_danmu.get(episode_id)
            if (!danmu) {
                throw new Error('无法获取弹幕数据')
            }
        }
        update_danmu(art, danmu)
    }


    // 更新 episode select
    // 初始剧集选项与默认选择
    async function update_episode_list(art) {
        console.log('update_episode_list: ')

        let {
            title,
            episode,
            url,
        } = art.storage.get('info')

        let db_info = art.storage.get(title)
        console.log('animeId: ', db_info['animeId'])
        let animeId = parseInt(db_info['animeId'])
        let anime = await db_anime.get(animeId)

        // todo img
        if (anime['imageUrl'] === undefined){
            let bangumi = await get_bangumi_details(animeId)
            console.log('bangumi: ', bangumi)
            anime['imageUrl'] = bangumi.imageUrl
            await db_anime.put(animeId, anime)

            // 使用方式
            const animeData = {
                vod_id: animeId,
                name: anime.animeTitle,
                vod_pic: anime.imageUrl,
                episode,
                url,
            }

            upsertAnimeVod(animeData).then(response => {
                console.log('更新成功:', response)
            })
        }

        // 章节
        let $episodes = document.querySelector("#episode_list")

        const {episodes} = anime
        const html = episodes.reduce((html, episode) => html + `<option value="${episode.episodeId}">${episode.episodeTitle}</option>`, '')
        $episodes.innerHTML = html

        let episodeId = get_episodeId(db_info['animeId'], db_info['episode_dif'] + episode)

        $episodes.value = episodeId
        // $episodes.selectedIndex = db_info['episode_dif'] + episode
        console.log('episodeId: ', $episodes.value, episodeId)
        // console.log('episodeId: ', $episodes.selectedIndex, db_info['episode_dif'] + episode)

        const event = new CustomEvent('update_episode_select', {
            detail: {
                art,
            },
        });
        document.dispatchEvent(event);
    }

    // 监听input元素的keypress事件
    $episode_list.addEventListener('change', async function (e) {
        await update_episode_select(art)
    });

    document.addEventListener('update_episode_list', async function (e) {
        let {art} = e.detail
        await update_episode_list(art)
    });

    document.addEventListener('update_episode_select', async function (e) {
        let {art} = e.detail
        await update_episode_select(art)
    });
}

function init_anime_list(art) {
    let $anime_list = document.querySelector("#anime_list")

    $anime_list.addEventListener('change', async () => {

        let {
            title,
        } = art.storage.get('info')

        let db_info = art.storage.get(title)

        // 获取选中的值
        const new_animeId = $anime_list.value

        // let db_anime_info = await db_info.get(title)
        // const new_idx = $anime_list.selectedIndex
        // const {anime_idx, animes} = db_anime_info
        // 存储选择的番剧序号
        // if (new_idx !== anime_idx) {
        //     db_anime_info['anime_idx'] = new_idx
        //     // 更新选择的剧集
        //     await db_info.put(title, db_anime_info)
        //     await set_anime_name(art)
        //     await get_anime_list(art)
        // }
        if (new_animeId !== db_info['animeId']) {
            db_info['animeId'] = new_animeId
            art.storage.set(title, db_info)
            console.log('title', db_info)
            await set_anime_name(art)
            await get_anime_list(art)
        }
    });

    let $anime_name = document.querySelector("#anime_name")
// 监听input元素的keypress事件
    $anime_name.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {

            let animeTitle = $anime_name.value
            let info = art.storage.get('info')

            let db_info = art.storage.get(info['title'])
            db_info['animeTitle'] = animeTitle
            art.storage.set(animeTitle, db_info)
            info['title'] = animeTitle
            art.storage.set('info', info)

            await update_anime_list_req(art)
        }
    });
// 监听input元素的blur事件
    $anime_name.addEventListener('blur', async () => {

        let animeTitle = $anime_name.value
        let info = art.storage.get('info')

        let db_info = art.storage.get(info['title'])
        db_info['animeTitle'] = animeTitle
        art.storage.set(animeTitle, db_info)
        info['title'] = animeTitle
        art.storage.set('info', info)

        await update_anime_list_req(art)
    });
}

function init_danmu_player(art) {
    // let $danmu_count = document.querySelector("#danmu_count")
    // let $anime_list = document.querySelector("#anime_list")
    // let $episode_list = document.querySelector("#episode_list")
    // let $anime_name = document.querySelector("#anime_name")

    // 初始化播放器弹幕配置
    init_danmu(art)
    // 初始化番剧列表
    init_anime_list(art)
    // 初始化剧集列表
    init_episode_list(art)
}

// 设置番剧名称
async function set_anime_name(art) {
    let {
        title,
    } = art.storage.get('info')

    let db_info = art.storage.get(title)
    if (db_info['animeTitle'] === null) {
        db_info['animeTitle'] = title
        art.storage.set(title, db_info)
        console.log('title', db_info)
    }

    let $anime_name = document.querySelector("#anime_name")
    $anime_name.value = db_info['animeTitle']
}


// 请求接口，搜索番剧
async function update_anime_list_req(art) {
    let {
        title,
    } = art.storage.get('info')
    let db_info = art.storage.get(title)
    let animes
    try {
        animes = await get_search_episodes(db_info['animeTitle'])
    } catch (error) {
        console.log('弹幕服务异常，稍后再试: ', error)
    }
    if (animes.length > 0) {
        // db_anime_info.animes = animes
        // await db_info.put(title, db_anime_info)
        db_info['animeId'] = animes[0]['animeId']
        db_info['animes'] = animes
        art.storage.set(title, db_info)
        console.log('title', db_info)
        for (let anime of animes) {
            console.log('animeId: ', anime.animeId)
            await db_anime.put(anime.animeId, anime)
        }
        // await set_anime_name(art)
        await get_anime_list(art)
    } else {
        art_msgs(art, UNSEARCHED)
    }
}

// 初始番剧选项与默认选择
async function update_anime_list_dom(art) {
    let {
        title,
    } = art.storage.get('info')

    let db_info = art.storage.get(title)

    console.log('update_anime_list: ')
    // 番剧名称列表
    let $anime_list = document.querySelector("#anime_list")

    const html = db_info['animes'].reduce((html, anime) => html + `<option value="${anime.animeId}">${anime.animeTitle}</option>`, '')
    $anime_list.innerHTML = html


    $anime_list.value = db_info['animeId']


    const event = new CustomEvent('update_episode_list', {
        detail: {
            art
        },
    });
    document.dispatchEvent(event);
}

async function get_anime_list(art) {
    let {
        title,
    } = art.storage.get('info')

    let db_info = art.storage.get(title)

    if (db_info['animeId'] === null) {
        console.log('没有缓存，请求接口')
        await update_anime_list_req(art)
    } else {
        console.log('有缓存，请求弹幕')
        await update_anime_list_dom(art)
    }
}

export {
    init_danmu_player,
    get_anime_list,
    set_anime_name,
    SEARCHED,
    UNSEARCHED,
}
