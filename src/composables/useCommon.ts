// src/composables/useCommon.ts
import { useMediaQuery } from "@vueuse/core";

const MOBILE_BREAKPOINT = '(max-width: 992px)' // 定义一个变量，屏幕宽度小于992时视为移动端

// 定义一个组合式函数，调用useMediaQuery，返回一个响应式ref，isMobile.value会随窗口大小变化自动更新，匹配时为true，不匹配时为false
export const useCommon = () => {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT)
  return { isMobile }
}