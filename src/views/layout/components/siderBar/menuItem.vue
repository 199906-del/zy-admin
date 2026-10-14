<template>
  <template v-if="menuItem.children && menuItem.children.length && isHidden(menuItem) ">
    <a-sub-menu :key="menuKey(menuItem)">
      <template #icon>
        <SvgIcon v-if="menuItem.meta?.icon" :name="menuItem.meta?.icon" size="18px"></SvgIcon>
      </template>
      <template #title>
        {{ menuItem.meta?.title }}
      </template>
      <MenuItem v-for="child in menuItem.children" :key="menuKey(child)" :menu-item="child"></MenuItem>
    </a-sub-menu>
  </template>

  <a-menu-item v-else-if="isHidden(menuItem)" :key="menuKey(menuItem)" @click="handleMenuClick(menuKey(menuItem))">
    <template #icon>
      <SvgIcon v-if="menuItem.meta?.icon" :name="menuItem.meta?.icon" size="18px"></SvgIcon>
    </template>
    {{ menuItem.meta?.title }}
  </a-menu-item>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
import { useRouter } from 'vue-router'
// import { useSettingStore } from '@/store/modules/setting'
import type { RouteConfig } from '@/api/types'
defineOptions({
  name: 'menuItem'
})

defineProps<{
  menuItem: RouteConfig
}>()

const router = useRouter()
// const settingStore = useSettingStore()

// 获取折叠状态
// const collapsed = computed(() => settingStore.menuCollapse)


function menuKey(menuItem: RouteConfig) {
  return menuItem.path || menuItem.route || String(menuItem.id)
}

function isHidden(menuItem: RouteConfig) {
  if (menuItem.meta?.hidden) {
    return false
  } else {
    return true
  }
}

function handleMenuClick(route: string | undefined) {
  if (route) {
    router.push(route)
  }
}
</script>

<style lang="scss" scoped>
// .menu-title-wrapper {
//   display: inline-flex;
//   align-items: center;
//   gap: 10px;
// }
:deep(.ant-menu-item) {
  height: 40px !important;
  line-height: 4px !important;
  transition: none !important;
}
:deep(.ant-menu-submenu-title) {
  height: 40px !important;
  transition: none !important;
  line-height: 40px !important;
}
:deep(.ant-menu) {
  transition: none !important;
}
</style>
