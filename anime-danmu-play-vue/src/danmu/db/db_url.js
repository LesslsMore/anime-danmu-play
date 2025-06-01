import {db_url} from "@/danmu/db/db.js";
import {get_url} from "@/danmu/api/api.js";


async function set_db_url_info(web_video_info) {

    let {anime_id, title, episode, url} = web_video_info

    let var_anime_url = {
        "episodes": {},
    }
    let db_anime_url = await db_url.get(anime_id)

    if (db_anime_url != null) {
        var_anime_url = db_anime_url
    }

    let src_url
    if (!var_anime_url['episodes'].hasOwnProperty(episode)) {
        // src_url = await get_url(url)
        src_url = url
        if (src_url.endsWith('.m3u8')) {
            var_anime_url['episodes'][episode] = src_url
            // 更新解析地址
            await db_url.put(anime_id, var_anime_url)
        }
        console.log('接口获取: ', src_url)
    } else {
        src_url = var_anime_url['episodes'][episode]
        console.log('缓存获取: ', src_url)
    }
    web_video_info['src_url'] = src_url
    return {
        var_anime_url,
    }
}

export {
    set_db_url_info
}
