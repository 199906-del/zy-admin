import { defineStore } from "pinia";
import { ref } from 'vue'
import { asyncRouters, constantRoutes } from '@/router/routers'
import { useRouterStore } from './routerList'
import type { RouteConfig } from '@/api/types'
import { clearDynamicRoutes } from '@/router/index'

export const usePermissionStore = defineStore('usePermission', () => {
  const routes = ref<RouteConfig[]>([])
  const routerStore = useRouterStore()

  //  遍历树形结构，收集所有路径，便于过滤
  const treeToSet = (resource: RouteConfig[]) => {
    const set = new Set<string>()
    listToSet(resource, '', set)
    return set
  }

  //  递归函数，开始遍历路由树
  const listToSet = (routes: RouteConfig[], parentPath: string, set: Set<string>) => {
    routes.forEach(r => {
      // 获取当前路径
      const path = r.path || r.route // 先用path再用route
      if (!path) return
      // 构建完整路径(如果path以/开头则说明是绝对路径，可以直接使用，如果不是则需要拼接parentPath)
      const fullPath = path.startsWith('/') ? path : `${parentPath}/${path}`
      set.add(fullPath) // 添加当前路径
      // 处理当前路径下的children,如果children里有子路由则接着递归，folder下的才是路由菜单，menu下的children放着权限按钮
      if (r.resourceType === 'folder' && r.children && r.children.length) {
        listToSet(r.children, fullPath, set)
      }
    })
  }

// 深拷贝
  const deepClone = <T>(obj: T, seen = new WeakMap<object, any>()): T => {
    // 基础类型 + function + null 直接返回
    if (obj === null || typeof obj !== 'object') return obj
    // 循环引用：已拷贝过就直接返回之前的副本
    if (seen.has(obj as object)) return seen.get(obj as object) as T
    // Date
    if (obj instanceof Date) return new Date(obj.getTime()) as T
    // RegExp
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as T
    // 数组
    if (Array.isArray(obj)) {
      const arr: any[] = []
      seen.set(obj as object, arr)
      obj.forEach((item, i) => { arr[i] = deepClone(item, seen) })
      return arr as T
    }
    // 对象：保留原型链 + 拷贝全部自有属性（含不可枚举）
    const cloned = Object.create(Object.getPrototypeOf(obj))
    seen.set(obj as object, cloned)
    const keys = Object.getOwnPropertyNames(obj)
    for (const key of keys) {
      const desc = Object.getOwnPropertyDescriptor(obj, key)!
      if ('value' in desc) {
        // 普通属性：递归拷贝 value，保留描述符
        Object.defineProperty(cloned, key, {
          enumerable: desc.enumerable,
          configurable: desc.configurable,
          writable: desc.writable,
          value: deepClone(desc.value, seen)
        })
      } else {
        // getter/setter：直接复用原描述符，不递归
        Object.defineProperty(cloned, key, desc)
      }
    }
    return cloned as T
  }

  // 检查path是否存在于routeArray中
  const hasPermission = (routeArray: string[], path: string) => {
    const match = routeArray.find(r => {
      // r.startsWith(path + '/')  检查path是否为r父路由
      // 意思是，如果path存在在routeArray里，或者path是routeArray中某一项的父路由，那么就代表有权限
      return r === path || r.startsWith(path + '/')
    })
    return !!match
  }

  //  路由过滤，遍历全量路由副本，如果routeArray中包含，就说明是需要展示的路由
  const filterAsyncRoutes = (routes: RouteConfig[], parentPath: string, routeArray: string[]): RouteConfig[] => {
    const res: RouteConfig[] = []
    // 遍历routes
    for (const r of routes) {
      const path = r.path || r.route
      const fullPath = path?.startsWith('/') ? path : `${parentPath}/${path}`
      // 给路由对象添加属性
      r.fullPath = fullPath
      r.pPath = parentPath
      // 权限判断
      if (hasPermission(routeArray, fullPath)) {
        if (r.children && r.children.length) {
          r.children = filterAsyncRoutes(r.children, fullPath, routeArray)
        }
        res.push(r)
      }
    }
    return res
  }

  // 递归查找子节点,在treeData中查找keyName属性中和key一样的值
  const findItemKey = (treeData: any[], key: string, keyName: string): any | null => {
    for (const item of treeData) {
      // 检查当前节点是否匹配
      if (item[keyName] === key) {
        return item
      }
      // 如果有子节点，接着递归查找
      if (item.children && item.children.length) {
        const found = findItemKey(item.children, key, keyName)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  // 给新路由排序
  const setOrder = (newRoutes: RouteConfig[], oldRoutes: RouteConfig[]) => {
    // 遍历新路由,从旧路由中查找并复制排序值
    newRoutes.forEach(nr => {
      // 首次登录的接口资源使用 route，刷新后持久化的路由使用 path。
      const match = nr.path
        ? findItemKey(oldRoutes, nr.path, 'route') ?? findItemKey(oldRoutes, nr.path, 'path')
        : null
      if (match) {
        nr.orderStr = match.orderStr
      }
      if (nr.children?.length) {
        setOrder(nr.children, oldRoutes)
      }
    })

    // 排序
    newRoutes.sort((a, b) => {
      return (a.orderStr ?? Number.MAX_SAFE_INTEGER) - (b.orderStr ?? Number.MAX_SAFE_INTEGER)
    })

  }

  const generateRoutes = (resource: RouteConfig[]) => {
    // 保存原始resource到localStorage，刷新时需要用他重新生成路由（而非序列化后丢失component的最终路由）
    localStorage.setItem('resource', JSON.stringify(resource))
    const routeArray = [...treeToSet(resource)] // 后端返回的所有权限路由（Array<string>），包括子路由
    // 建立一个前端中有权限路由的全量副本
    const asyncRoutes_copy = deepClone(asyncRouters)
    // 过滤
    const accessedRoutes = filterAsyncRoutes(asyncRoutes_copy, '', routeArray)
    if (accessedRoutes.length) {
      // 排序
      setOrder(accessedRoutes, resource)
      
      // 重新设置重定向
      accessedRoutes.forEach(e => {
        e.redirect = e.children?.[0].path ?? ''
      })
      // 找到根路径 / 的路由，将它的 redirect 设置为第一个动态路由的路径
      const root = constantRoutes.find(e => e.path === '/')
      if (root) {
        root.redirect = accessedRoutes[0].path
      }
    }
    // 合并常量路由和动态路由
    let permission_routes = accessedRoutes.concat(constantRoutes)
    // 处理应用路由（以/app-开头的）,预留微前端
    // const apps = resource.filter(r => r.route?.startsWith('/app-'))
    // apps.forEach(r => {
    //   if (r.route) {
    //     r.path = r.route
    //     delete r.route
    //   }
    // })
    // permission_routes = permission_routes.concat(apps)
    routes.value = permission_routes
    // 保存到pinia（仅内存状态，不再写lacalStorage）
    routerStore.saveRouter(permission_routes)
    return accessedRoutes
  }

  const clearRoutes = () => {
    routes.value = []
    clearDynamicRoutes()
  }
  return {
    routes,
    generateRoutes,
    findItemKey,
    clearRoutes
  }
})