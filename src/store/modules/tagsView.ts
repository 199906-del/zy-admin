import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

// 导出 TagView 类型供其他组件使用
export interface TagView extends RouteLocationNormalized {
  title?: string
  icon?: string
  affix?: boolean
  fullPath: string
}

export const useTagsView = defineStore('tagsView', () => {
  const cacheViews = ref<string[]>([])
  const visitedViews = ref<TagView[]>([])

  // 新增标签页
  const addVisitedViews = (route: TagView) => {
    const exists = visitedViews.value.some(v => v.path === route.path)
    if (!exists) {
      visitedViews.value.push(
        Object.assign({}, route, { title: route.meta.title })
      )
    }
  }

  // 新增缓存
  const addCacheView = (name: string) => {
    cacheViews.value.push(name)
  }

  // 删除缓存
  const removeCache = (name: string) => {
    const index = cacheViews.value.indexOf(name)
    if (index > -1) {
      cacheViews.value.splice(index, 1)
    }
  }

  // 关闭标签页
  const closeVisitedView = (route: TagView) => {
    // 从visitedViews移除
    const index = visitedViews.value.findIndex(v => v.path === route.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
    if (route.name && typeof route.name === 'string') {
      removeCache(route.name)
    }
  }
  return {
    cacheViews,
    visitedViews,
    addVisitedViews,
    closeVisitedView,
    removeCache,
    addCacheView
  }
})