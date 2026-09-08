<template>
  <div class="tagCard" ref="tagCardRef" @wheel="handleWheel">
    <TagItem v-for="item in visitedViews" :key="item.path" :tagItem="item" @click="handleClick(item)"></TagItem>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import TagItem from './components/tagItem.vue'
import { useTagsView, type TagView } from '@/store/modules/tagsView.ts'
import { useRouter, useRoute } from 'vue-router'

const tagStore = useTagsView()
const router = useRouter()
const route = useRoute()
const tagCardRef = ref<HTMLElement>()

const visitedViews = computed(() => {
  return tagStore.visitedViews
})

const routes = computed(() => {
  return router.getRoutes()
})

onMounted(async () => {
  initTags() // 先初始化固定标签
  addTags() // 添加标签
  await nextTick()
  // 窗口大小变化时重新定位
  window.addEventListener('resize', () => {
    moveToCurrentTag()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', moveToCurrentTag)
})

watch(
  () => route.fullPath,
  async () => {
    addTags()
    await nextTick()
    moveToCurrentTag()
  },
  { flush: 'post' }
)

const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  event.stopPropagation()

  const el = tagCardRef.value
  if (el) {
    const delta = event.deltaY || event.deltaX
    el.scrollLeft += delta
  }
}

const handleClick = (tag: TagView) => {
  router.push(tag.fullPath || tag.path)
}

const moveToCurrentTag = async () => {
  await nextTick()

  const container = tagCardRef.value
  if (!container) return

  const activeIndex = visitedViews.value.findIndex(tag => {
    return (tag.fullPath || tag.path) === route.fullPath ||
      tag.path === route.path
  })

  if (activeIndex === -1) return

  const activeTag = container.children[activeIndex] as HTMLElement | undefined
  if (!activeTag) return

  const tagRect = activeTag.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  if (tagRect.left < containerRect.left) {
    container.scrollBy({
      left: tagRect.left - containerRect.left - 10,
      behavior: 'smooth'
    })
  } else if (tagRect.right > containerRect.right) {
    container.scrollBy({
      left: tagRect.right - containerRect.right + 10,
      behavior: 'smooth'
    })
  }
}

const filterAffixTags = (routes: any[], basePath = '/') => {
  let tags: TagView[] = []
  routes.forEach(route => {
    if (route.children && route.children.length) {
      return
    }
    // const tagPath = basePath === '/' ? route.path : `${basePath}${route.path}`
    const tagPath = route.path.startsWith('/') ? route.path : `${basePath}${basePath.endsWith('/') ? '' : '/'}${route.path}`
    if (route.meta.affix) {
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
        title: route.meta.title || route.name
      } as TagView)
    }

    // if (route.children && route.children.length) {
    //   const childBasePath = route.path.startsWith('/') ? '' : tagPath
    //   console.log("childBasePath",childBasePath)
    //   const tempTags = filterAffixTags(route.children, childBasePath)
    //   if (tempTags && tempTags.length) {
    //     tags = [...tags, ...tempTags]
    //   }
    // }
  })
  return tags
}

// 辅助函数：安全获取路由名称
const getRouteName = (route: any): string | undefined => {
  if (!route?.name) return undefined
  if (typeof route.name === 'string') return route.name
  if (typeof route.name === 'symbol') return route.name.toString()
  return undefined
}

const initTags = () => {
  const affixTags = filterAffixTags(routes.value)
  for (const tag of affixTags) {
    if (tag.name) {
      tagStore.addVisitedViews(tag)
      tagStore.addCacheView(tag.name as string)
    }
  }
}

const addTags = () => {
  tagStore.addVisitedViews(route)
  const routeName = getRouteName(route)
  if (routeName) {
    tagStore.addCacheView(routeName)
  }
}
</script>

<style lang="scss" scoped>
.tagCard {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  flex-wrap: nowrap;
  scroll-behavior: smooth;

  
 /* 隐藏滚动条（可选） */
 &::-webkit-scrollbar {
  height: 0;
  display: none;
 }
 -ms-overflow-style: none;
 scrollbar-width: none;
}

.tagCard > * {
  flex-shrink: 0;       /* 不收缩，保持原始宽度 */
}
</style>