<template>
  <div ref="playerRef" class="video-container"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

const props = defineProps<{
  url: string
  poster?: string
}>()

const playerRef = shallowRef<HTMLDivElement | null>(null)
const playerInstance = shallowRef<Player | null>(null)

onMounted(() => {
  if (!playerRef.value) return
  playerInstance.value = new Player({
    el: playerRef.value, // 直接传DOM元素，挂载的目标容器
    url: props.url, // 视频地址
    poster: props.poster || '', // 视频封面图
    fluid: false, // 尺寸由外层容器控制，避免改变 PC 端现有布局
    videoFillMode: 'cover', // PC 端保持原有的铺满效果
    autoplay: false, // 不自动播放
    volume: 0.6, // 初始音量，范围0-1
    lang: 'zh-cn', // 播放器UI语言中文简
    controls: {
      autoHide: true, // 鼠标不动时自动隐藏控制栏
      autoHideTime: 3000, // 3s后隐藏
      items: ['play', 'volume', 'time', 'fullscreen'] // 控制栏从左到右显示哪些按钮，数组顺序即显示顺序
    },
    playbackRate: [0.5, 0.75, 1, 1.25, 1.5, 2] // 倍速选项列表
  })
  playerInstance.value.on('ready', () => {
    console.log('播放器就绪')
  })

  playerInstance.value.on('ended', () => {
    console.log('播放结束')
  })
})

onBeforeUnmount(() => {
  playerInstance.value?.destroy()
  playerInstance.value = null
})

defineExpose({
  play: () => playerInstance.value?.play(),
  pause: () => playerInstance.value?.pause(),
  destroy: () => playerInstance.value?.destroy(),
  getInstance: () => playerInstance.value
})

</script>

<style scoped>
.video-container {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}
</style>
