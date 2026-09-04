<template>
  <div class="tagCard">
    <TagItem v-for="item in visitedViews" :key="item.path" :tagItem="item" @click="handleClick(item)"></TagItem>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import TagItem from './components/tagItem.vue'
import { useTagsView, type TagView } from '@/store/modules/tagsView.ts'
import { useRouter, useRoute } from 'vue-router'

const tagStore = useTagsView()
const router = useRouter()
const route = useRoute()

const visitedViews = computed(() => {
  return tagStore.visitedViews
})

const routes = computed(() => {
  return router.getRoutes()
})

onMounted(() => {
  initTags() // 先初始化固定标签
  addTags() // 添加标签
})

watch(
  () => route.fullPath,
  () => {
    addTags()
    // moveToCurrentTag()
  }
)

const handleClick = (tag: TagView) => {
  router.push(tag.fullPath || tag.path)
}

const filterAffixTags = (routes: any[], basePath = '/') => {
  let tags: TagView[] = []
  routes.forEach(route => {
    const tagPath = basePath === '/' ? route.path : `${basePath}${route.path}`
    if (route.meta.affix) {
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
        title: route.meta.title || route.name
      } as TagView)
    }

    if (route.children && route.children.length) {
      const childBasePath = basePath === '/' ? route.path : `${basePath}${route.path}`
      const tempTags = filterAffixTags(route.children, childBasePath)
      if (tempTags && tempTags.length) {
        tags = [...tags, ...tempTags]
      }
    }
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
  console.log("affixTags",affixTags)
  for (const tag of affixTags) {
    if (tag.name) {
      tagStore.addVisitedViews(tag)
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
}
</style>