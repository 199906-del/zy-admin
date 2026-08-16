<template>
  <div class="login-container">
    <h2>用户登录</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>用户名：</label>
        <input type="text" v-model="username" placeholder="请输入用户名" />
      </div>
      <div>
        <label>密码：</label>
        <input type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  // 这里写登录逻辑，比如调用接口
  console.log('登录信息：', username.value, password.value)
  // 登录成功后跳转到首页
//   router.push('/home')
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