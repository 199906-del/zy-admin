import { defineStore } from "pinia";
import { ref } from 'vue'
import type { RouteConfig } from '@/api/types'

export const useRouterStore = defineStore('router',() => {
  // interface Route {
  //   id: number,
  //   name: string,
  //   route: string,
  //   icon?: string,
  //   resourceType: string,
  //   children?: Route[]
  // }
  // state
  // 路由列表
  const routerList = ref<RouteConfig[]>([])
  // const restoreRouter = () => {
  //   const stored = localStorage.getItem('resource') || sessionStorage.getItem('resource')
  //   if (!stored) return
  //   try {
  //     const parsed = JSON.parse(stored)
  //     if (Array.isArray(parsed)) routerList.value = parsed
  //   } catch {
  //     routerList.value = []
  //   }
  // }

  // actions
  // 从登录保存路由
  function saveRouter(r: RouteConfig[]) {
    localStorage.setItem('resource', JSON.stringify(r))
    sessionStorage.setItem('resource', JSON.stringify(r))
    routerList.value = r
  }

  // function getRouter() {
  //   restoreRouter()
  // }

  function clearRouter() {
    routerList.value = []
    localStorage.removeItem('resource')
    sessionStorage.removeItem('resource')
  }

  // restoreRouter()
  return {
    routerList,
    saveRouter,
    // getRouter,
    // restoreRouter,
    clearRouter
  }
})
