import { defineStore } from "pinia";
import { ref } from 'vue'
export const useRouterStore = defineStore('router',() => {
  interface Route {
    id: number,
    name: string,
    route: string,
    icon: string,
    resourceType: string,
    children: Array<{ id: number, name: string, icon: string, route: string, resourceType: string}>
  }
  // state
  // 路由列表
  const routerList = ref<Route[]>([])
  const restoreRouter = () => {
    const stored = localStorage.getItem('resource') || sessionStorage.getItem('resource')
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) routerList.value = parsed
    } catch {
      routerList.value = []
    }
  }

  // actions
  // 从登录保存路由
  function saveRouter(r: Route[]) {
    localStorage.setItem('resource', JSON.stringify(r))
    sessionStorage.setItem('resource', JSON.stringify(r))
    routerList.value = r
  }

  function getRouter() {
    restoreRouter()
  }
  restoreRouter()
  return {
    routerList,
    saveRouter,
    getRouter,
    restoreRouter
  }
})
