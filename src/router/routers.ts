// 登陆时的vue组件
import LoginView from '../views/login/index.vue'
// type { RouteRecordRaw }TypeScript类型，用于类型检查（type关键字表示这是纯类型，打包时会被移除）
// RouteRecordRaw是Vue Router源码中定义的一个TypeScript类型/接口，规定了每个路由配置必须包含哪些字段、可选哪些字段、每个字段是什么类型
import type { RouteRecordRaw } from 'vue-router'  // 👈 加上 type 关键字
// 动态导入路由懒加载
const Layout = () => import('../views/layout/index.vue')

//  无权限公共路由
const constantRoutes: RouteRecordRaw[] = [
  {
    // 登录页用同步加载，因为是必须的
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false,
      hidden: true,
    }
  },
  {
    // 其他页面懒加载
    path: '/',
    name: 'Home',
    redirect: '/sysManage',
    meta: {
      requiresAuth: true,
      hidden: true,
    }
  },
  {
    // 404
    path: '/404',
    name: '404',
    component:() => import('@/views/error/404.vue'),
    meta: { 
      title: '404 - 页面未找到',
      hidden: true,
      requiresAuth: false  // 不需要登录
    }
  }
]

// 需要权限判断的异步加载路由
const asyncRouters: RouteRecordRaw[] = [
  {
    path: '/sysManage',
    name: 'sysManage',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'setting'
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

export {
  constantRoutes,
  asyncRouters
}