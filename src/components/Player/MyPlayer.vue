<template>
  <div
    ref="playerRef"
    class="video-player"
    :class="{ 'is-fullscreen': isFullscreen }"
    @mousemove="showControls"
    @pointerdown="showControls"
    @mouseleave="hideControls"
  >
    <!-- 视频元素 -->
    <video
      ref="videoRef"
      :src="src"
      :poster="poster"
      playsinline
      webkit-playsinline
      preload="metadata"
      @click="togglePlay"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @progress="onProgress"
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
      @waiting="isBuffering = true"
      @canplay="isBuffering = false"
    ></video>

    <!-- 加载中 -->
    <div v-if="isBuffering" class="loading">加载中...</div>

    <!-- 大播放按钮（暂停时显示） -->
    <button v-if="!isPlaying" class="big-play" @click="togglePlay">
      ▶
    </button>

    <!-- 控制条 -->
    <div class="controls" :class="{ show: controlsVisible }">
      <!-- 进度条 -->
      <div
        class="progress"
        ref="progressRef"
        @pointerdown="startDrag"
        @pointermove="onDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      >
        <!-- 缓冲进度 -->
        <div class="buffered" :style="{ width: bufferedPercent + '%' }"></div>
        <!-- 已播放进度 -->
        <div class="played" :style="{ width: playedPercent + '%' }">
          <span class="thumb"></span>
        </div>
      </div>

      <!-- 按钮区 -->
      <div class="btns">
        <button class="btn" @click="togglePlay">
          {{ isPlaying ? '暂停' : '播放' }}
        </button>

        <span class="time">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </span>

        <div class="spacer"></div>

        <!-- 音量 -->
        <button class="btn" @click="toggleMute">
          {{ muted || volume === 0 ? '🔇' : '🔊' }}
        </button>
        <input
          class="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model.number="volume"
          @input="onVolumeChange"
        />

        <!-- 倍速 -->
        <select class="rate" v-model.number="playbackRate" @change="onRateChange">
          <option :value="0.5">0.5x</option>
          <option :value="0.75">0.75x</option>
          <option :value="1">1x</option>
          <option :value="1.25">1.25x</option>
          <option :value="1.5">1.5x</option>
          <option :value="2">2x</option>
        </select>

        <!-- 全屏 -->
        <button class="btn" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  src: string
  poster?: string
  autoplay?: boolean
}>()

const playerRef = shallowRef<HTMLDivElement | null>(null)
const videoRef = shallowRef<HTMLVideoElement | null>(null)
const progressRef = shallowRef<HTMLDivElement | null>(null)

// 状态
const isPlaying = ref(false)
const isBuffering = ref(false)
const isFullscreen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const buffered = ref(0)
const volume = ref(1)
const muted = ref(false)
const playbackRate = ref(1)
const controlsVisible = ref(true)

// 拖拽状态
let dragging = false

// 进度百分比
const playedPercent = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0
)
const bufferedPercent = computed(() =>
  duration.value ? (buffered.value / duration.value) * 100 : 0
)

// 播放 / 暂停
const togglePlay = () => {
  const v = videoRef.value
  if (!v) return
  if (v.paused) {
    v.play()
  } else {
    v.pause()
  }
}

// 静音切换
const toggleMute = () => {
  const v = videoRef.value
  if (!v) return
  v.muted = !v.muted
  muted.value = v.muted
}

// 时间更新
const onTimeUpdate = () => {
  if (videoRef.value && !dragging) {
    currentTime.value = videoRef.value.currentTime
  }
}

// 元数据加载完，拿到总时长
const onLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
    videoRef.value.volume = volume.value
    videoRef.value.playbackRate = playbackRate.value
    if (props.autoplay) videoRef.value.play()
  }
}

// 缓冲进度
const onProgress = () => {
  const v = videoRef.value
  if (!v || !v.buffered.length) return
  buffered.value = v.buffered.end(v.buffered.length - 1)
}

const onEnded = () => {
  isPlaying.value = false
  showControls()
}

// ===== 进度条拖拽 =====
const startDrag = (e: PointerEvent) => {
  dragging = true
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  seekTo(e)
}

const onDrag = (e: PointerEvent) => {
  if (!dragging) return
  seekTo(e)
}

const endDrag = (e: PointerEvent) => {
  if (!dragging) return
  dragging = false
  seekTo(e)
  ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
}

const seekTo = (e: PointerEvent) => {
  const v = videoRef.value
  const bar = progressRef.value
  if (!v || !bar) return
  const rect = bar.getBoundingClientRect()
  let ratio = (e.clientX - rect.left) / rect.width
  ratio = Math.max(0, Math.min(1, ratio))
  v.currentTime = ratio * duration.value
  currentTime.value = v.currentTime
}

// ===== 音量 =====
const onVolumeChange = () => {
  const v = videoRef.value
  if (!v) return
  v.volume = volume.value
  v.muted = volume.value === 0
  muted.value = v.muted
}

// ===== 倍速 =====
const onRateChange = () => {
  if (videoRef.value) videoRef.value.playbackRate = playbackRate.value
}

// ===== 全屏 =====
const toggleFullscreen = async () => {
  const el = playerRef.value
  const video = videoRef.value
  if (!el) return

  try {
    // iOS Safari 只允许 video 使用自己的原生全屏接口
    const nativeVideo = video as (HTMLVideoElement & {
      webkitEnterFullscreen?: () => void
      webkitExitFullscreen?: () => void
    }) | null

    if (nativeVideo?.webkitEnterFullscreen && !isFullscreen.value) {
      nativeVideo.webkitEnterFullscreen()
      isFullscreen.value = true
      return
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    if (el.requestFullscreen) {
      await el.requestFullscreen()
      return
    }

    console.warn('当前浏览器不支持全屏播放')
  } catch (err) {
    console.warn('全屏失败', err)
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

const onNativeFullscreenStart = () => {
  isFullscreen.value = true
}

const onNativeFullscreenEnd = () => {
  isFullscreen.value = false
}

// ===== 控制条自动隐藏 =====
let hideTimer: number | undefined
const scheduleControlsHide = () => {
  clearTimeout(hideTimer)
  if (!isPlaying.value) return

  hideTimer = window.setTimeout(() => {
    controlsVisible.value = false
  }, 3000)
}

const showControls = () => {
  controlsVisible.value = true
  scheduleControlsHide()
}

const onPlay = () => {
  isPlaying.value = true
  showControls()
}

const onPause = () => {
  isPlaying.value = false
  clearTimeout(hideTimer)
  controlsVisible.value = true
}

const hideControls = () => {
  if (isPlaying.value) controlsVisible.value = false
}

// ===== 键盘快捷键 =====
const onKeydown = (e: KeyboardEvent) => {
  const v = videoRef.value
  if (!v) return
  // 防止在输入框里触发
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return

  switch (e.key) {
    case ' ':
    case 'k':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      v.currentTime = Math.max(0, v.currentTime - 5)
      break
    case 'ArrowRight':
      v.currentTime = Math.min(duration.value, v.currentTime + 5)
      break
    case 'ArrowUp':
      e.preventDefault()
      volume.value = Math.min(1, volume.value + 0.1)
      onVolumeChange()
      break
    case 'ArrowDown':
      e.preventDefault()
      volume.value = Math.max(0, volume.value - 0.1)
      onVolumeChange()
      break
    case 'm':
      toggleMute()
      break
    case 'f':
      toggleFullscreen()
      break
  }
}

// ===== 时间格式化 =====
const formatTime = (sec: number) => {
  if (!sec || isNaN(sec) || !isFinite(sec)) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ===== 换源 =====
watch(() => props.src, (newSrc) => {
  const v = videoRef.value
  if (!v || !newSrc) return
  v.src = newSrc
  v.load()
  currentTime.value = 0
  duration.value = 0
  buffered.value = 0
})

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('keydown', onKeydown)
  videoRef.value?.addEventListener('webkitbeginfullscreen', onNativeFullscreenStart)
  videoRef.value?.addEventListener('webkitendfullscreen', onNativeFullscreenEnd)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('keydown', onKeydown)
  videoRef.value?.removeEventListener('webkitbeginfullscreen', onNativeFullscreenStart)
  videoRef.value?.removeEventListener('webkitendfullscreen', onNativeFullscreenEnd)
  clearTimeout(hideTimer)
  videoRef.value?.pause()
})

// 暴露方法给父组件
defineExpose({
  play: () => videoRef.value?.play(),
  pause: () => videoRef.value?.pause(),
  seek: (time: number) => { if (videoRef.value) videoRef.value.currentTime = time },
  getVideo: () => videoRef.value
})
</script>

<style lang="scss" scoped>
.video-player {
  position: relative;
  width: 80%;
  margin: 0 auto;
  height: 100%;
  background: #000;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  user-select: none;

  video {
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
    object-fit: contain;
  }

  &.is-fullscreen {
    width: 100vw;
    height: 100vh;

    video {
      height: 100%;
    }
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 14px;
  }

  .big-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  .controls {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px 12px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;

    &.show {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .progress {
      position: relative;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      cursor: pointer;
      touch-action: none;

      .buffered {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
      }

      .played {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: #409eff;
        border-radius: 3px;

        .thumb {
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
        }
      }
    }

    .btns {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 8px;

      .btn {
        color: #fff;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        padding: 3px 10px;
        cursor: pointer;
        font-size: 13px;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }

      .time {
        color: #ddd;
        font-size: 12px;
        white-space: nowrap;
      }

      .spacer {
        flex: 1;
      }

      .volume {
        width: 70px;
      }

      .rate {
        background: #222;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        padding: 2px 4px;
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 768px) {
  .video-player {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    height: auto;
    aspect-ratio: 16 / 9;

    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .big-play {
      width: 48px;
      height: 48px;
      font-size: 22px;
    }

    .controls {
      box-sizing: border-box;
      padding: 6px 8px;

      .progress {
        height: 8px;
      }

      .btns {
        gap: 6px;
        min-width: 0;

        .btn {
          min-width: 40px;
          padding: 4px 6px;
          font-size: 12px;
        }

        .time {
          font-size: 11px;
        }

        // 手机使用静音按钮即可，隐藏占空间的音量滑块
        .volume {
          display: none;
        }

        .rate {
          padding: 2px;
        }
      }
    }
  }
}
</style>
