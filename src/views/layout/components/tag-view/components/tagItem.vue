<template>
  <div class="tagItem" :class="{active: isActive}">
    <span style="margin-right: 10px">{{ tagItem?.meta.title }}</span>
    <CloseOutlined v-if="visitedViews.length > 1 && !tagItem.meta.affix " @click.stop="closeTag(tagItem)" />
  </div>
</template>

<script setup lang="ts">
import { useTagsView, type TagView} from '@/store/modules/tagsView'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const tagStore = useTagsView()
const route = useRoute()
const router = useRouter()
const props =  defineProps<{
  tagItem: TagView
}>()

const toNextView = (visitedViews: TagView[], view: TagView, nextPathIndex: number) => {
  const nextView = visitedViews[nextPathIndex] || visitedViews[nextPathIndex - 1]
  if (nextView) {
    router.push(nextView.fullPath)
  } else {
    // 默认跳转主页
    router.push('/')
  }
}

const closeTag = (tab: TagView) => {
  const nextPathIndex = visitedViews.value.findIndex(e => {
    return e.path === tab.path
  })
  tagStore.closeVisitedView(tab)
  // 如果关闭的是当前激活标签则跳转到其他标签
  if (props.tagItem.title === route.path || props.tagItem.fullPath === route.fullPath) {
    toNextView(visitedViews.value, tab, nextPathIndex)
  }
}

const visitedViews = computed(() => {
  return tagStore.visitedViews
})

const isActive = computed(() => {
  return props.tagItem.title === route.path || props.tagItem.fullPath === route.fullPath
})

</script>

<style lang="scss" scoped>
.tagItem {
  display: inline-flex;
  align-items: center;
  margin: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 0 11px;
  height: 32px;
  transition: all 0.3s ease;
}
.tagItem:hover {
  // background: #e6f7ff;
  // border-color: #40a9ff;
  color: #395ae3;
}
.tagItem.active {
  // background: #1890ff;
  // border-color: #1890ff;
  color: #395ae3;
  // box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.tagItem.active span {
  color: #395ae3;
}

.tagItem.active .anticon-close {
  color: #395ae3;
}
</style>