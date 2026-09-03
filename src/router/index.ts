// src/router/index.ts
// createRouter创建路由实例的函数，createWebHistory使用HTML5 History模式（URL不带 # ）
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
// import Layout from '../views/layout/index.vue'
import { constantRoutes } from './routers'
import { usePermissionStore } from '@/store/modules/permission'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用history模式
  routes: constantRoutes
})

// 路由守卫(to:目标路由对象,from: 来源路由对象,next()：控制跳转)
router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  console.log("token",token)
  console.log("to",to)

  // 如果页面需要认证
  if (to.meta.requiresAuth !== false) {
    if (!token) {
      // 未登录，跳到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 记录原本想访问的地址
      })
      return
    }
    // 如果已登录但没有用户信息，尝试获取
    if (!userStore.userInfo) {
      userStore.restoreUserInfo() // 从localStorage中恢复

      // 如果恢复后还为空，则重新获取用户信息
      if (!userStore.userInfo) {
        try {
          await userStore.fetchUserInfo()
        } catch {
          // 获取信息失败，清除token跳转登录
          userStore.clearUserInfo()
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
          return
        }
      }
      
    }
    // permissionStore.routes是最终有权限的路由数组
    if (!permissionStore.routes.length) {
      // 路由合并（与后端返回的有权限的路由取交集）
      try {
        // routerStore.getRouter()
        // 拿到后端resource
        const resourceStr = localStorage.getItem('resource') || '[]'
        const resource = JSON.parse(resourceStr)
        if (resource && Array.isArray(resource) && resource.length) {
          // 得到最终过滤后的路由
          const accessRoutes = await permissionStore.generateRoutes(resource)
          resetRouter(accessRoutes)
          // 动态路由注册后重新匹配原始目标地址
          next({ ...to, replace: true })
          return
        }
      } catch (e) {
        // 如果动态路由加载失败，重置token跳转登录页，并记住目标路径
        userStore.resetToken()
        next(`/login?redirect=${to.path}`)
      }
    }
    // 已经登录并且有用户信息
    next()
  } else {
    // 已经登陆的情况下访问登录页，跳转首页
    if (token && to.path === '/login') {
      next('/')
      return
    }
    // 页面不需要认证
    next()
  }
})

const dynamicRouteNames = new Set<string>()
// 404 通配符必须在所有动态路由之后加
const catchAllRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'pathMatch',
  redirect: '/404'
}

// 清除动态路由
const clearDynamicRoutes = () => {
  // 移除所有动态路由
  dynamicRouteNames.forEach(name => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
  dynamicRouteNames.clear()

  // 重新添加通配符，保证404功能
  router.addRoute(catchAllRoute)
  dynamicRouteNames.add('pathMatch')
}

const resetRouter = (accessRoutes?: RouteRecordRaw[]) => {
  clearDynamicRoutes()
  // 添加动态路由（排在通配符之前）
  if (accessRoutes && accessRoutes.length) {
    accessRoutes.forEach(route => {
      if (!route.name) {
        route.name = route.path
      }
      router.addRoute(route)
      dynamicRouteNames.add(route.name as string)
    })
  }

  // 最后添加通配符
  router.addRoute(catchAllRoute)
  dynamicRouteNames.add('pathMatch')
}

//导出路由
export default router
export { resetRouter, clearDynamicRoutes }
