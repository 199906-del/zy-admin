<template>
  <div class="headerRight">
    <UserAvatar></UserAvatar>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from './components/user-avatar/index.vue'

defineOptions({
  name: 'headerRight'
})
</script>

<style scoped>
</style>