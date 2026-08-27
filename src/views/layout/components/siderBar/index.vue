<template>
  <div class="menu-scrollbar">
    <a-menu mode="inline" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
      <MenuItem v-for="item in menuList" :key="item.route || item.id" :menu-item="item"></MenuItem>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch} from 'vue'
import { useRoute } from 'vue-router'
import { useRouterStore } from '@/store/modules/routerList'
import MenuItem from './menuItem.vue'

defineOptions({
  name: 'menu-scrollbar'
})

const route = useRoute()
const routerStore = useRouterStore()

const selectedKeys = ref<string[]>([route.path])
const openKeys = ref<string[]>([])
const menuList = computed(() => routerStore.routerList)

interface MenuRoute {
  route: string
  children?: MenuRoute[]
}

// 找出当前路由所属的所有父级菜单，用于初始化展开菜单
function findParentKeys(list: MenuRoute[], currentPath: string, parents: string[] = []): string[] {
  for (const item of list) {
    const nextParents = item.route ? [...parents, item.route] : parents

    if (item.route === currentPath) return parents

    if (item.children?.length) {
      const result = findParentKeys(item.children, currentPath, nextParents)
      if (result.length || item.children.some(child => child.route === currentPath)) return result
    }
  }

  return []
}

// 监听路由变化，自动高亮
watch(
  [() => route.path, menuList],
  ([newPath, list]) => {
    selectedKeys.value = [newPath]
    openKeys.value = findParentKeys(list as MenuRoute[], newPath)
  },
  { immediate: true }
)

</script>

<style lang="scss" scoped>
.menu-scrollbar {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 自定义滚动条样式 */
.menu-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.menu-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.menu-scrollbar::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
  transition: all 0.3s;
}

.menu-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* Firefox 兼容 */
.menu-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 transparent;
}
</style>
