<template>
  <a-popover placement="bottomRight" v-model:open="popoverVisible" trigger="hover" @openChange="handleOpenChange">
    <template #title>
      <div>
        <div class="popoverTitle">
          <a-image :width="35" :height="35" :src="userInfo?.avatar" style="border-radius: 50%; object-fit: cover;"
        :preview="false" />
          <div class="userInfo">
            <div class="username">{{ userInfo?.username }}</div>
            <div class="useremail">{{ userInfo?.email }}</div>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="popoverContent">
        <a-divider />
        <div>
          功能区
        </div>
        <a-divider />
        <a-button block @click="handleLoginOut">
          <template #icon><ArrowLeftOutlined /></template>
          退出登录
        </a-button>
      </div>
    </template>
    <div>
      <a-image :width="35" :height="35" :src="userInfo?.avatar" style="border-radius: 50%; object-fit: cover;"
        :preview="false" />
    </div>
  </a-popover>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from "vue-router";
import { Modal } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'
import { useRouterStore } from '@/store/modules/routerList'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { logout } from '@/api/auth'

const userStore = useUserStore()
const userRouter = useRouterStore()
const router = useRouter();

const { userInfo } = storeToRefs(userStore)

const popoverVisible = ref(false)
const handleOpenChange = (visible: boolean) => {
  // 如果鼠标移出，允许关闭
  if (!visible) {
    popoverVisible.value = false
  }
}

const handleLoginOut = (e: MouseEvent) => {
  // 阻止事件冒泡，防止触发hover关闭逻辑
  e.stopPropagation()

  // 手动关闭popover
  popoverVisible.value = false
  nextTick(() => {
    LoginOut()
  })
}

function LoginOut() {
  Modal.confirm({
    title: '温馨提示',
    content: '确认退出吗？',
    okText: '确认',
    cancelText: '取消',
    centered: true,
    getContainer: document.body, // 强制挂载到body上
    async onOk() {
      await logout()
      userStore.clearUserInfo()
      userRouter.clearRouter()
      router.replace(`/login`)
    },
    onCancel() {}
  })
}
</script>

<style lang="scss" scoped>
.popoverTitle {
  display: flex;
  justify-content: center;
  align-items: center;

  .userInfo {
    padding-left: 15px;

    .username {
      font-size: 16px;
    }

    .useremail {
      color: #a3a0a0;
      font-weight: 400;
    }
  }
}
</style>
