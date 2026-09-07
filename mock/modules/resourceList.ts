const adminRouterLists = [
  {
    id: 1,
    name: '系统管理',
    route: '/sysManage',
    resourceType: 'folder',
    icon: 'setting',
    children: [
      {
        id: 11,
        name: '用户管理',
        route: '/sysManage/userManage',
        resourceType: 'menu',
        orderStr: 2
      },
      {
        id: 12,
        name: '菜单管理',
        resourceType: 'menu',
        route: '/sysManage/menuManage',
        orderStr: 1
      }
    ]
  },
  {
    id: 2,
    name: '功能/组件',
    route: '/functionalComponent',
    resourceType: 'folder',
    icon: 'setting',
    children: [
      {
        id: 21,
        name: '图表',
        route: '/functionalComponent/chart',
        resourceType: 'menu',
        orderStr: 1,
        children: [
          {
            id: 31,
            name: 'icon可拖拽',
            resourceType: 'menu',
            route: '/functionalComponent/chart/draggableIcon',
            orderStr: 1
          },
          {
            id: 32,
            name: 'echarts',
            resourceType: 'menu',
            route: '/functionalComponent/chart/echarts',
            orderStr: 2
          }
        ]
      },
      {
        id: 22,
        name: '播放器',
        resourceType: 'menu',
        route: '/functionalComponent/player',
        orderStr: 2
      },
      {
        id: 23,
        name: '图片预览',
        resourceType: 'menu',
        route: '/functionalComponent/imagePreview',
        orderStr: 3
      }
    ]
  },
  {
    id: 3,
    name: '表单',
    route: '/Form',
    resourceType: 'folder',
    icon: 'setting',
    children: [
      {
        id: 31,
        name: '简单图表',
        route: '/Form/simpleForm',
        resourceType: 'menu',
        orderStr: 1
      },
      {
        id: 32,
        name: '表单验证',
        resourceType: 'menu',
        route: '/Form/formValidation',
        orderStr: 2
      },
      {
        id: 33,
        name: '分步表单',
        resourceType: 'menu',
        route: '/Form/stepByStepForm',
        orderStr: 3
      },
      {
        id: 34,
        name: '表单拖拽',
        resourceType: 'menu',
        route: '/Form/draggableForm',
        orderStr: 4
      }
    ]
  },
  {
    id: 4,
    name: '地图',
    route: '/map',
    resourceType: 'folder',
    icon: 'setting',
    children: [
      {
        id: 41,
        name: '高德地图',
        route: '/map/Amap',
        resourceType: 'menu',
        orderStr: 1
      }
    ]
  }
]

const userRouterLists = [
  {
    id: 1,
    name: '系统管理',
    route: '/sysManage',
    resourceType: 'folder',
    icon: 'setting',
    children: [
      {
        id: 11,
        name: '用户管理',
        route: '/sysManage/userManage',
        resourceType: 'menu'
      }
    ]
  }
]

export { adminRouterLists, userRouterLists }