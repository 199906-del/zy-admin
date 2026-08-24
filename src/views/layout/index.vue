<template>
  <a-layout>
    <a-layout-sider class="siderBar" v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div> logo </div>
      <SiderBar></SiderBar>
    </a-layout-sider>
    <a-layout>
      <Header></Header>
      <a-layout-content class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component v-if="Component" :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { defineComponent, computed } from 'vue';
import SiderBar from './components/siderBar/index.vue'
import Header from './components/header/index.vue'
import { useSettingStore } from '@/store/modules/setting.ts'

defineComponent({
  name: 'siderBar'
})

const settingStore = useSettingStore()
const collapsed = computed(() => {
  return settingStore.menuCollapse
})
</script>

<style scoped lang="scss">
.siderBar {
  background-color: #ffffff;
  color: #000000;
  font-size: 26px;
}
</style>
