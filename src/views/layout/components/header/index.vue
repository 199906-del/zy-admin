<template>
  <div class="container">
    <HeaderLeft></HeaderLeft>
    <HeaderRight></HeaderRight>
  </div>
</template>

<script setup lang="ts">
import HeaderLeft from './components/headerLeft.vue'
import HeaderRight from './components/headerRight.vue'

</script>

<style scoped>
.container {
  display: flex;
}
</style>