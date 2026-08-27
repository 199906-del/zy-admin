<template>
  <template v-if="menuItem.children && menuItem.children.length">
    <a-sub-menu :key="menuItem.route || String(menuItem.id)">
      <template #title>
        <span class="menu-title-wrapper">
          <SvgIcon v-if="menuItem.icon" :name="menuItem.icon" size="18px"></SvgIcon>
          <span v-if="!collapsed">{{ menuItem.name }}</span>
        </span> 
      </template>
      <MenuItem v-for="child in menuItem.children" :key="child.route || child.id" :menu-item="child"></MenuItem>
    </a-sub-menu>
  </template>
  <a-menu-item v-else :key="menuItem.route" @click="handleMenuClick(menuItem.route)">
    {{ menuItem.name }}
  </a-menu-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingStore } from '@/store/modules/setting'
defineOptions({
  name: 'menuItem'
})

interface MenuItem {
  id: number
  name: string
  route: string
  resourceType: string
  icon?: string,
  children?: MenuItem[]
}
defineProps<{
  menuItem: MenuItem
}>()

const router = useRouter()
const settingStore = useSettingStore()

const collapsed = computed(() => {
  return settingStore.menuCollapse
})

function handleMenuClick(route: string) {
  router.push(route)
}
</script>

<style lang="scss" scoped>
.menu-title-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
:deep(.ant-menu-item) {
  height: 40px !important;
  line-height: 4px !important;
}
:deep(.ant-menu-submenu-title) {
  height: 40px !important;
  line-height: 40px !important;
}
</style>
