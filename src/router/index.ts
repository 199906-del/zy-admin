// src/router/index.ts
// createRouter创建路由实例的函数，createWebHistory使用HTML5 History模式（URL不带 # ）
import { createRouter, createWebHistory } from 'vue-router'
// type { RouteRecordRaw }TypeScript类型，用于类型检查（type关键字表示这是纯类型，打包时会被移除）
// RouteRecordRaw是Vue Router源码中定义的一个TypeScript类型/接口，规定了每个路由配置必须包含哪些字段、可选哪些字段、每个字段是什么类型
import type { RouteRecordRaw } from 'vue-router'  // 👈 加上 type 关键字
// 登陆时的vue组件
import LoginView from '../views/login/index.vue'
import { useUserStore } from '@/store/modules/user'
import { useRouterStore } from '@/store/modules/routerList.ts'
// import Layout from '../views/layout/index.vue'
// 动态导入路由懒加载
const Layout = () => import('../views/layout/index.vue')

const routes: RouteRecordRaw[] = [
  {
    // 登录页用同步加载，因为是必须的
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    // 其他页面懒加载
    path: '/',
    name: 'Home',
    redirect: '/sysManage',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/sysManage',
    name: 'sysManage',
    component: Layout,
    meta: {
      title: '系统管理'
    },
    redirect: '/sysManage/userManage',
    children: [
      {
        path: '/sysManage/userManage',
        name: 'userManage',
        component: () => import('@/views/sys/UserManage/index.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/sysManage/menuManage',
        name: 'menuManage',
        component: () => import('@/views/sys/menuManage/index.vue'),
        meta: {
          title: '菜单管理'
        }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用history模式
  routes  // 传入路由表
})

// 路由守卫(to:目标路由对象,from: 来源路由对象,next()：控制跳转)
router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore()
  const routerStore = useRouterStore()
  console.log("token",token)

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

      // 如果回复后还为空，则重新获取用户信息
      if (!userStore.userInfo) {
        try {
          await userStore.fetchUserInfo()
          next()
        } catch {
          // 获取信息失败，清除token跳转登录
          userStore.clearUserInfo()
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }
        return
      }
      
    }
    if (!routerStore.routerList.length) {
      routerStore.getRouter()
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


//导出路由
export default router
