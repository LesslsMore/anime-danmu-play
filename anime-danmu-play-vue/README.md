# 弹幕在线播放器 anime-danmu-play-vue
### 服务地址
- https://anime-danmu-play.vercel.app/
- https://anime-danmu-play.onrender.com/
### 引言

之前重构了【油猴脚本】[动漫弹幕播放](https://greasyfork.org/zh-CN/scripts/485364) ，拆分为播放和解析部分。

其中油猴脚本只负责地址解析，播放调用本服务实现，解耦后代码职责更清晰。

油猴脚本支持多网址解析更简单，

播放服务也可嵌入到其他视频网址，

结合 zfile 还能实现本地播放，

替换弹弹play (接口好用，但应用经常有小问题)。

![](https://raw.githubusercontent.com/LesslsMore/blog-img/master/picgo/20250803095822.png)

### 更新记录

v0.1.2 弹幕下载有下载本地缓存弹幕改为下载播放器当前弹幕，下载弹幕格式由 json 改为 xml 统一标准

v0.1.1 支持添加本地字幕

v0.1.0 由【油猴脚本】[动漫弹幕播放](https://greasyfork.org/zh-CN/scripts/485364) 拆分出 弹幕播放器服务
