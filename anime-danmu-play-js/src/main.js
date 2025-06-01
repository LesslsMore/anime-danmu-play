document.addEventListener('DOMContentLoaded', () => {
  const animeIdInput = document.getElementById('anime_id');
  const episodeInput = document.getElementById('episode');
  const titleInput = document.getElementById('title');
  const videoUrlInput = document.getElementById('video_url');
  const playButton = document.getElementById('play_button');
  const videoPlayer = document.getElementById('video_player');

  playButton.addEventListener('click', () => {
    const animeId = animeIdInput.value;
    const episode = episodeInput.value;
    const title = titleInput.value;
    const videoUrl = videoUrlInput.value;

    // 构建查询参数
    const queryParams = get_param_url(animeId, episode, title, videoUrl);

    // 更新 iframe 的 src 属性
    videoPlayer.src = `./play.html?${queryParams}`;
  });
});

function get_param_url(animeId, episode, title, videoUrl) {
    const queryParams = new URLSearchParams();
    if (animeId) queryParams.append('anime_id', animeId);
    if (episode) queryParams.append('episode', episode);
    if (title) queryParams.append('title', title);
    if (videoUrl) queryParams.append('video_url', videoUrl);
    return queryParams.toString();
}
