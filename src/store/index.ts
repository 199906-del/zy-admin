// src/store/index.ts
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出所有模块
export * from './modules/user'