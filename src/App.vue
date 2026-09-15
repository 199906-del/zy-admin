<script setup lang="ts">
import { useIdleTimeout } from './composables/useIdleTimeout';

// 6小时无操作自动登出
useIdleTimeout()
</script>

<template>
  <router-view />
</template>
