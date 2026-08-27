import { defineStore } from "pinia"
import { ref } from 'vue'
import { getUserInfo } from '@/api/auth'

interface UserInfo {
  userId: string,
  username: string,
  nickname: string,
  avatar: string,
  roles: string[],
  email?:string,
  permissions?: string[]
}

export const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref<UserInfo | null>(null)

  // action
  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const info = await getUserInfo()
      userInfo.value = {
        userId: info.id,
        username: info.username,
        nickname: info.nickname,
        avatar: info.avatar,
        roles: info.roles,
        email: info.email,
        permissions: info.permissions,
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return userInfo.value
    } catch (error) {
      throw error
    }
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 从 localStorage 恢复用户信息
  const restoreUserInfo = () => {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      try {
        userInfo.value = JSON.parse(stored)
      } catch {
        userInfo.value = null
      }
    }
  }

  return {
    userInfo,
    setUserInfo,
    fetchUserInfo,
    clearUserInfo,
    restoreUserInfo
  }
})
