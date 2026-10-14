<template>
  <div class="breadcrumb-wrapper">
    <a-breadcrumb>
      <template v-for="(item, index) in breadcrumbs" :key="item.path">
        <a-breadcrumb-item>
          <!--当前页面为最后一级-->
          <span v-if="index === breadcrumbs.length - 1" class="breadcrumb-current">
            {{ item.meta?.title || item.name }}
          </span>

          <!--有子路由：显示为下拉菜单-->
          <a-dropdown v-else-if="hasVisibleChildren(item)" :trigger="['click']" placement="bottomLeft"
            :overlayClassName="'breadcrumb-dropdown'">
            <span class="breadcrumb-link" @click.prevent>
              {{ item.meta?.title || item.name }}
              <DownOutlined class="dropdown-icon" />
            </span>
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <!--使用递归组件渲染多级菜单-->
                <RecursiveMenu :items="getVisibleChildren(item)"></RecursiveMenu>
              </a-menu>
            </template>
          </a-dropdown>

          <!--没有子路由： 直接跳转-->
          <router-link v-else :to="item.path" class="breadcrumb-link">
            {{ item.meta?.title || item.name }}
          </router-link>
        </a-breadcrumb-item>
      </template>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecursiveMenu from './components/RecursiveMenu.vue'
// import type { RouteRecordRaw } from 'vue-router'

const router = useRouter()
const route = useRoute()
const breadcrumbs = ref<any[]>([])

// 判断是否有可见的子路由
const hasVisibleChildren = (item: any): boolean => {
  if (!item.children || item.children.length === 0) return false
  return item.children.some((child: any) => {
    return child.meta?.title || child.name
  })
}

const getVisibleChildren = (item: any): any[] => {
  if (!item.children) return []
  return item.children.filter((child: any) => {
    return !child.redirect && (child.meta?.title || child.name)
  })
}

// 处理下拉菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  if (key) {
    router.push(key)
  }
}

// 生成面包屑
const getBreadcrumbs = () => {
  // 当前匹配到的所有路由记录
  const matched = route.matched
  const filtered = matched.filter((item: any) => {
    return item.meta?.title || item.name
  })
  breadcrumbs.value = filtered
}

watch(
  () => route.path,
  () => {
    getBreadcrumbs()
  },
  { immediate: true }
)

onMounted(() => {
  getBreadcrumbs()
})

</script>

<style lang="scss" scoped>
.breadcrumb-wrapper {
  margin-left: 20px;
  color: #797676;
  display: flex;
  align-items: center;

  :deep(.ant-breadcrumb) {
    display: flex;
    align-items: center;
    flex-wrap: nowrap !important;
    font-size: 14px !important;

    .ant-breadcrumb-link {
      display: inline-flex !important;
      align-items: center;
      gap: 4;
    }

    .ant-breadcrumb-item {
      display: flex;
      align-items: center;
    }

    .ant-breadcrumb-separator {
      margin: 0 8px;
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .breadcrumb-current {
    color:rgba(0, 0, 0, 0.85);
    font-weight: 500;
    cursor: default;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    vertical-align: middle;
    padding: 4px 0;
  }

  .breadcrumb-link {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.65);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 4px;
    transition: all 0.2s;
    vertical-align: middle;

    &:hover {
      color: #1890ff;
      background-color: rgba(24, 144, 255, 0.08);
    }

    .dropdown-icon {
      font-size: 14px;
      margin-left: 2px;
      transition: transform 0.3s ease;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}

// 下拉菜单样式
:deep(.breadcrumb-dropdown) {
  .ant-dropdown-menu {
    min-width: 180px;
    padding: 4px 0;
    border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

    .ant-dropdown-menu-item {
      padding: 10px 16px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s;

      &:hover {
        background-color: #f0f5ff;
      }
    }

    .menu-item-active {
      color: #1890ff;
      background-color: #f0f5ff;

      .menu-item-check {
        color: #1890ff;
        font-size: 14px;
      }
    }
  }

  .ant-dropdown-menu-sub {
    border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

    .ant-dropdown-menu-item {
      padding: 10px 16px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s;

      &:hover {
        background-color: #f0f5ff;
      }
    }
  }
}

:deep(.ant-dropdown-menu-submenu-title)     {
      padding: 10px 16px;
      font-size: 14px;
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s;

      &:hover {
        background-color: #f0f5ff;
      }
      
      .ant-dropdown-menu-submenu-arrow {
        color: rgba(0, 0, 0, 0.25);
        font-size: 12px;
      }
    }

</style>