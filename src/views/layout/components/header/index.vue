<template>
  <div class="container">
    <div class="header_left">
      <!--移动端汉堡插槽-->
      <slot name="mobileTrigger" />
      <!--桌面端：面包屑 + 折叠按钮-->
      <template v-if="!isMobile">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="changeCollapsed"
        />
        <menu-fold-outlined v-else class="trigger" @click="changeCollapsed" />
        <Breadcrumb></Breadcrumb>
      </template>
    </div>
    <HeaderRight></HeaderRight>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCommon } from '@/composables/useCommon.ts'
import { useSettingStore } from '@/store/modules/setting.ts'
import Breadcrumb from './components/Breadcrumb/index.vue'
import HeaderRight from './headerRight.vue'

const settingStore = useSettingStore()
const { isMobile } = useCommon()

const collapsed = computed(() => {
  return settingStore.menuCollapse
})

function changeCollapsed() {
  settingStore.changeMenuCollapse()

}

</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  height: 56px;
}

.header_left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  margin-right: 8px;
}
</style>