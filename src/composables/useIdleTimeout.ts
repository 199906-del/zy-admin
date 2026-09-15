import { useUserStore } from '@/store'
import { ref, onMounted, onUnmounted } from 'vue'
import router from '@/router'

const DEFAULT_TIMEOUT_MS = 6 * 60 * 60 * 1000

export function useIdleTimeout(timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  const userStore = useUserStore()
  const lastActivity = ref(Date.now())
  let timer: ReturnType<typeof setTimeout> | null = null

  const handleLogogout = () => {
    // 清除用户信息和token
    userStore.clearUserInfo()
    localStorage.removeItem('resource')
    // 跳转登录
    router.push({
      path: '/login',
      query: { reason: 'idle' }
    })
  }

  const resetTimer = () => {
    lastActivity.value = Date.now()
    if (timer) clearTimeout(timer)
    // 只有已登录状态才启动倒计时
    if (localStorage.getItem('token')) {
      timer = setTimeout(handleLogogout, timeoutMs)
    }
  }

  // 监听的事件类型
  const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'] as const

  const onUserActivity = () => {
    resetTimer()
  }

  const start = () => {
    events.forEach(event => {
      window.addEventListener(event, onUserActivity, { passive: true })
    })
    resetTimer()
  }

  const stop = () => {
    events.forEach(event => {
      window.removeEventListener(event, onUserActivity)
    })
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })

  return {
    lastActivity,
    resetTimer,
    start,
    stop
  }
}