<template>
  <div class="login-container">
    <h2>用户登录</h2>
    <a-form name="login-form" ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form" @keyup.enter="handleLogin">
      <a-form-item label="用户名：" name="username">
        <a-input v-model:value="loginForm.username" placeholder="请输入用户名 (admin/user)"></a-input>
      </a-form-item>
      <a-form-item label="密码：" name="password">
        <a-input-password v-model:value="loginForm.password" placeholder="请输入密码(admin/user)"></a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button class="login-btn" type="primary" size="large" :loading="loading" block @click="handleLogin">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { login } from '@/api/auth';
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useRouterStore } from '@/store/modules/routerList'
import { message } from 'ant-design-vue';
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
interface userInfo {
  username: string,
  password: string
}

const loginForm: userInfo = reactive({
  username: '',
  password: ''
})

const userStore = useUserStore()
const routerStore = useRouterStore()
const router = useRouter()

// 获取表单组件实例
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
  ]
}

const handleLogin = async () => {
  // 这里写登录逻辑，比如调用接口
  console.log('登录信息：', loginForm.username,loginForm. password)
 // 检查表单实例是否存在
 if (!loginFormRef.value) return
 try {
  await loginFormRef.value.validate()

  loading.value = true
  const res = await login({
    username: loginForm.username,
    password: loginForm.password
  })

  console.log("res", res)
  // 保存token
  localStorage.setItem('token', res.token)

  // 保存用户信息到store
  userStore.setUserInfo({
    userId: res.userId,
    username: res.username,
    email: res.email,
    nickname: res.nickname,
    avatar: res.avatar ?? '',
    roles: res.roles,
  })
  // 保存路由到store
  routerStore.saveRouter(res.resourceList)

  message.success('登陆成功')
  // 跳转到重定向页面或首页
  router.push('/')
 } catch (e: any) {
  // 表单验证失败或登陆失败
  if (e?.errorFields) {
    //表单验证错误，不提示
    return
  }
  message.error(e?.message || e?.msg || '登陆失败')
 } finally {
  loading.value = false
 }
}

</script>

<style scoped lang="scss">
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
