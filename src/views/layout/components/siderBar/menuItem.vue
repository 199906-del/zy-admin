<template>
  <template v-if="menuItem.children && menuItem.children.length">
    <a-sub-menu :key="menuItem.route || String(menuItem.id)">
      <template #title>
        <span>{{ menuItem.name }}</span>
      </template>
      <MenuItem v-for="child in menuItem.children" :key="child.route || child.id" :menu-item="child"></MenuItem>
    </a-sub-menu>
  </template>
  <a-menu-item v-else :key="menuItem.route" @click="handleMenuClick(menuItem.route)">
    {{ menuItem.name }}
  </a-menu-item>
</template>

<script setup lang="ts">
import { defineComponent, } from 'vue'
import { useRouter } from 'vue-router'
defineComponent({
  name: 'menuItem'
})
interface MenuItem {
  id: number
  name: string
  route: string
  resourceType: string
  children?: MenuItem[]
}
defineProps<{
  menuItem: MenuItem
}>()

const router = useRouter()

function handleMenuClick(route: string) {
  router.push(route)
}
</script>

<style scoped>
</style>
