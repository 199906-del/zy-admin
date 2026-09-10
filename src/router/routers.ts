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
          title: '用户管理',
          affix: true
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
  },
  {
    path: '/functionalComponent',
    name: 'functionalComponent',
    component: Layout,
    meta: {
      title: '功能/组件',
      icon: 'setting'
    },
    redirect: '/functionalComponent/chart/draggableIcon',
    children: [
      {
        path: '/functionalComponent/chart',
        name: 'chart',
        // component: Layout,
        meta: {
          title: '图表'
        },
        // redirect: '/sysManage/userManage',
        children: [
          {
            path: '/functionalComponent/chart/draggableIcon',
            name: 'draggableIcon',
            component: () => import('@/views/functionalComponent/chart/draggableIcon/index.vue'),
            meta: {
              title: 'icon可拖拽'
            }
          },
          {
            path: '/functionalComponent/chart/echartsChart',
            name: 'echarts',
            component: () => import('@/views/functionalComponent/chart/echartsChart/index.vue'),
            meta: {
              title: 'echarts'
            }
          }
        ]
      },
      {
        path: '/functionalComponent/player',
        name: 'player',
        component: () => import('@/views/functionalComponent/player/index.vue'),
        meta: {
          title: '播放器'
        }
      },
      {
        path: '/functionalComponent/imagePreview',
        name: 'imagePreview',
        component: () => import('@/views/functionalComponent/imagePreview/index.vue'),
        meta: {
          title: '图片预览'
        }
      }
    ]
  },
  {
    path: '/Form',
    name: 'Form',
    component: Layout,
    meta: {
      title: '表单',
      icon: 'setting'
    },
    redirect: '/Form/simpleForm',
    children: [
      {
        path: '/Form/simpleForm',
        name: 'simpleForm',
        // component: Layout,
        component: () => import('@/views/Form/simpleForm/index.vue'),
        meta: {
          title: '简单图表'
        }
        // redirect: '/sysManage/userManage',
      },
      {
        path: '/Form/formValidation',
        name: 'formValidation',
        component: () => import('@/views/Form/formValidation/index.vue'),
        meta: {
          title: '表单验证'
        }
      },
      {
        path: '/Form/stepByStepForm',
        name: 'stepByStepForm',
        component: () => import('@/views/Form/stepByStepForm/index.vue'),
        meta: {
          title: '分步表单'
        }
      },
      {
        path: '/Form/draggableForm',
        name: 'draggableForm',
        component: () => import('@/views/Form/draggableForm/index.vue'),
        meta: {
          title: '表单拖拽'
        }
      }
    ]
  },
  {
    path: '/map',
    name: 'map',
    component: Layout,
    meta: {
      title: '地图',
      icon: 'setting'
    },
    redirect: '/map/Amap',
    children: [
      {
        path: '/map/Amap',
        name: 'Amap',
        component: () => import('@/views/map/Amap/index.vue'),
        meta: {
          title: '高德地图'
        }
      }
    ]
  }
]

export {
  constantRoutes,
  asyncRouters
}