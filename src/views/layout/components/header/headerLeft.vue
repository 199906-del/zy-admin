<template>
  <div class="headerLeft">
    <menu-unfold-outlined
      v-if="collapsed"
      class="trigger"
      @click="changeCollapsed"
    />
    <menu-fold-outlined v-else class="trigger" @click="changeCollapsed" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '@/store/modules/setting.ts'

const settingStore = useSettingStore()

const collapsed = computed(() => {
  return settingStore.menuCollapse
})

function changeCollapsed() {
  settingStore.changeMenuCollapse()

}
</script>

<style lang="scss" scoped>
.headerLeft {
  display: flex;
  align-items: center;
  justify-content: center;
}
.trigger {
  font-size: 18px;
}
</style>
