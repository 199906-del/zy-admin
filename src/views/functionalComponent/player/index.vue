<template>
  <div class="container">
    <div class="section">
      <div class="title">实例化xgplayer</div>
      <VideoPlayer :url="url" :poster="poster"></VideoPlayer>
    </div>
    <div class="section">
      <div class="title">原生video + 自定义控制条</div>
      <MyPlayer ref="playerRef" :src="url" :poster="poster"></MyPlayer>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoPlayer from '@/components/Player/VideoPlayer.vue';
import MyPlayer from '@/components/Player/MyPlayer.vue';

const url = 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4'
const poster = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg'

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    text-align: left;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .section {
    // flex: 1;
    width: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
  }
  :deep(.video-container) {
    width: 100%;
    max-width: 100%;
    min-height: 0;
    aspect-ratio: 16 / 9;
    margin: 0 auto;
  }
  :deep(video) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 移动端：宽高自适应 */
@media (max-width: 768px) {
  .container {
    height: 100%;
    min-height: 0;
    min-width: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 8px;
    box-sizing: border-box;

    .title {
      font-size: 16px;       /* 字号小一点 */
      padding: 4px 0;
    }

    .section {
      flex: 0 0 auto;
      margin-bottom: 16px;
      min-width: 0;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(.video-container) {
      width: 100%;
      max-width: 100%;
      height: auto;
      max-height: none;
      aspect-ratio: 16 / 9;
      margin: 0;
    }

    :deep(video) {
      // object-fit: contain !important;
      object-fit: cover;
    }
  }
}


</style>
