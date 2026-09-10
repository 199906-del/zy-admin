<template>
  <a-layout :class="{ 'is-mobile': isMobile }">
    <!--桌面端，正常侧边栏-->
    <a-layout-sider v-if="!isMobile" class="siderBar" v-model:collapsed="collapsed" :trigger="null" collapsible
      :collapsedWidth="58">
      <div class="titleWrap">
        <img :src="defaultSetting.logo" />
        <div class="title" :class="{ collapsed: settingStore.menuCollapse }">{{ defaultSetting.name }}</div>
      </div>
      <SiderBar></SiderBar>
    </a-layout-sider>

    <!--移动端：Drawer抽屉侧边栏-->
    <a-drawer v-if="isMobile" :open="mobileMenuOpen" placement="left" :closable="false" :width="256" :body-style="{ padding: 0, overflow: 'hidden' }" @close="mobileMenuOpen = false">
      <div class="titleWrap">
        <img :src="defaultSetting.logo" />
        <div class="title">{{ defaultSetting.name }}</div>
      </div>
      <SiderBar @menu-click="mobileMenuOpen = false"></SiderBar>
    </a-drawer>

    <a-layout>
      <Header>
        <template v-if="isMobile" #mobileTrigger>
          <menu-unfold-outlined class="mobile-trigger" @click="mobileMenuOpen = true" />
        </template>
      </Header>
      <TabNav v-if="!isMobile" />
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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiderBar from './components/siderBar/index.vue'
import TabNav from './components/tag-view/index.vue'
import Header from './components/header/index.vue'
import { useSettingStore } from '@/store/modules/setting.ts'
import { useTagsView } from '@/store/modules/tagsView.ts'
import { useCommon } from '@/composables/useCommon.ts'
import defaultSetting from '@/commom/defaultSetting.ts'

defineOptions({
  name: 'Layout'
})

const settingStore = useSettingStore()
const tagsViewStore = useTagsView()
const route = useRoute()
const { isMobile } = useCommon()

const collapsed = computed(() => {
  return settingStore.menuCollapse
})
const cacheViews = computed(() => {
  return tagsViewStore.cacheViews
})
const mobileMenuOpen = ref(false)

// 移动端自动收起侧边栏
watch(isMobile, (val) => {
  if (val) {
    settingStore.menuCollapse = true
  } else {
    settingStore.menuCollapse = false
  }
})

// 路由切换关闭Drawer
watch(
  () => route.path,
  () => {
    if (isMobile.value) mobileMenuOpen.value = false
  }
)
</script>

<style scoped lang="scss">
.siderBar {
  background-color: #ffffff;
  color: #000000;
  font-size: 26px;
  // transition: width 2s ease !important;

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
    }
  }

}

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
  }
}

:deep(.ant-layout-sider) {
  transition: width 0.2s ease, min-width 0.2s ease, max-width 0.2s ease !important;
}

.title.collapsed {
  display: none;
}

.is-mobile .main-content {
  padding: 8px !important;
}

.mobile-trigger {
  font-size: 20px;
  cursor: pointer;
  margin-right: 12px;
}
</style>
