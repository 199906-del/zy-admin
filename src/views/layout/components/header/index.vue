<template>
  <div class="container">
    <HeaderLeft></HeaderLeft>
    <HeaderRight></HeaderRight>
  </div>
</template>

<script setup lang="ts">
import HeaderLeft from './headerLeft.vue'
import HeaderRight from './headerRight.vue'

</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
}
</style>