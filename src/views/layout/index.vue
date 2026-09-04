<template>
  <a-layout>
    <a-layout-sider class="siderBar" v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="titleWrap"> 
        <img :src="defaultSetting.logo"/>
        <div class="title" :class="{collapsed: settingStore.menuCollapse}">{{ defaultSetting.name }}</div>
      </div>
      <SiderBar></SiderBar>
    </a-layout-sider>
    <a-layout>
      <Header></Header>
      <TabNav />
      <a-layout-content class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cacheViews">
              <component v-if="Component" :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SiderBar from './components/siderBar/index.vue'
import TabNav from './components/tag-view/index.vue'
import Header from './components/header/index.vue'
import { useSettingStore } from '@/store/modules/setting.ts'
import { useTagsView } from '@/store/modules/tagsView.ts'
import defaultSetting from '@/commom/defaultSetting.ts'

defineOptions({
  name: 'Layout'
})

const settingStore = useSettingStore()
const tagsViewStore = useTagsView()
const collapsed = computed(() => {
  return settingStore.menuCollapse
})
const cacheViews = computed(() => {
  return tagsViewStore.cacheViews
})
</script>

<style scoped lang="scss">
.siderBar {
  background-color: #ffffff;
  color: #000000;
  font-size: 26px;

  .titleWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    height: 64px;
    padding: 0 16px;

    .title {
        font-size: 16px;
        margin-left: 15px;
        white-space: nowrap;
        overflow: hidden;
        max-width: 200px;
        opacity: 1;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-left 0.3s ease;
      }
  }
  
}
.title.collapsed {
  opacity: 0;
  margin-left: 0;
  max-width: 0;
}
</style>
