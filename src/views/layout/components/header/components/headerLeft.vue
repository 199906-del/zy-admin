<template>
  <div class="container">
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
.container {
  width: 50%;
  padding: 15px 20px;
}
.trigger {
  font-size: 18px;
}
// #components-layout-demo-custom-trigger .trigger {
//   font-size: 18px;
//   line-height: 64px;
//   padding: 0 24px;
//   cursor: pointer;
//   transition: color 0.3s;
// }
// #components-layout-demo-custom-trigger .trigger:hover {
//   color: #1890ff;
// }

// #components-layout-demo-custom-trigger .logo {
//   height: 32px;
//   background: rgba(255, 255, 255, 0.3);
//   margin: 16px;
// }

// .site-layout .site-layout-background {
//   background: #fff;
// }
</style>
