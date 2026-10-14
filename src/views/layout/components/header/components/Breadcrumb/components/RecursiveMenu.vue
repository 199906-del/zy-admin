<template>
  <template v-for="item in items" :key="item.path">
    <!--有子菜单: 显示向右箭头-->
    <a-sub-menu v-if="hasVisibleChildren(item)" :key="item.path">
      <template #title>
        <span class="submenu-title">
          {{ item.meta?.title || item.name || '' }}
        </span>
        <!-- <RightOutlined class="submenu-arrow" /> -->
      </template>
      <!--递归调用自身，渲染更深层级的菜单-->
      <RecursiveMenu :items="getVisibleChildren(item)"></RecursiveMenu>
    </a-sub-menu>

    <!--叶子节点，直接展示-->
    <a-menu-item v-else :key="item.path" :class="{'menu-item-active': item.path === currentPath}">
      <span>
        {{ item.meta?.title || item.name || '' }}
      </span>
    </a-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'
// import { RightOutlined } from '@ant-design/icons-vue'

const route = useRoute()

defineProps<{
  items: any
}>()

const currentPath = computed(() => {
  return route.path
})

// 判断是否有可见的子路由
const hasVisibleChildren = (item: any) => {
  if (!item.children || item.children.length === 0) return false
  return item.children.some((child: any) => {
    return child.meta?.title || child.name
  })
}

// 获取了可见子路由
const getVisibleChildren = (item: any) => {
  if (!item.children || item.children.length === 0) return []
  return item.children.filter((item: any) => {
    return item.meta?.title || item.name
  })
}
</script>

<style scoped lang="scss">
.submenu-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

// 当前激活的菜单项
.menu-item-active {
  color: #1890ff;
  background-color: #f0f5ff;

  .menu-item-check {
    color: #1890ff;
    font-size: 12px;
    margin-left: 8px;
  }
}

// 下拉菜单子菜单样式
:deep(.ant-dropdown-menu-submenu-title) {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f5ff;
  }

  .ant-dropdown-menu-submenu-arrow {
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
  }
}

:deep(.ant-dropdown-menu-item) {
  padding: 10px 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f5ff;
  }
}
// 禁用默认的右箭头（如果还有残留）
// :deep(.ant-dropdown-menu-submenu-arrow) {
//   display: none !important;
// }
</style>