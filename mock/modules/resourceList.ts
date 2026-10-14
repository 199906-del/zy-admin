const adminRouterLists = [
  {
    id: 1,
    name: '系统管理',
    route: '/sysManage',
    display: true,
    resourceType: 'folder',
    icon: 'setting',
    permissionFlag: null,
    orderStr: 1,
    children: [
      {
        id: 11,
        name: '用户管理',
        route: '/sysManage/userManage',
        display: true,
        resourceType: 'menu',
        orderStr: 2,
        permissionFlag: null,
        children: [
          {
            id: 111,
            name: '新建用户',
            route: null,
            display: true,
            orderStr: 1,
            resourceType: 'button',
            permissionFlag: '新建用户'
          }
        ]
      },
      {
        id: 12,
        name: '菜单管理',
        resourceType: 'menu',
        display: true,
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
    orderStr: 2,
    display: true,
    children: [
      {
        id: 21,
        name: '图表',
        route: '/functionalComponent/chart',
        resourceType: 'folder',
        display: true,
        orderStr: 1,
        children: [
          {
            id: 211,
            name: 'icon可拖拽',
            resourceType: 'menu',
            route: '/functionalComponent/chart/draggableIcon',
            orderStr: 1,
            display: true,
          },
          {
            id: 212,
            name: 'echarts',
            resourceType: 'menu',
            display: true,
            route: '/functionalComponent/chart/echartsChart',
            orderStr: 2
          }
        ]
      },
      {
        id: 22,
        name: '播放器',
        display: true,
        resourceType: 'menu',
        route: '/functionalComponent/player',
        orderStr: 2
      },
      {
        id: 23,
        name: '图片预览',
        resourceType: 'menu',
        display: true,
        route: '/functionalComponent/imagePreview',
        orderStr: 3
      }
    ]
  },
  {
    id: 3,
    name: '表单',
    route: '/Form',
    display: true,
    resourceType: 'folder',
    icon: 'setting',
    orderStr: 3,
    children: [
      {
        id: 31,
        name: '简单图表',
        display: true,
        route: '/Form/simpleForm',
        resourceType: 'menu',
        orderStr: 1
      },
      {
        id: 32,
        name: '表单验证',
        resourceType: 'menu',
        display: true,
        route: '/Form/formValidation',
        orderStr: 2
      },
      {
        id: 33,
        name: '分步表单',
        resourceType: 'menu',
        display: true,
        route: '/Form/stepByStepForm',
        orderStr: 3
      },
      {
        id: 34,
        name: '表单拖拽',
        resourceType: 'menu',
        display: true,
        route: '/Form/draggableForm',
        orderStr: 4
      }
    ]
  },
  {
    id: 4,
    name: '地图',
    route: '/map',
    display: true,
    resourceType: 'folder',
    icon: 'setting',
    orderStr: 4,
    children: [
      {
        id: 41,
        name: '高德地图',
        route: '/map/Amap',
        display: true,
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
    display: true,
    resourceType: 'folder',
    icon: 'setting',
    orderStr: 1,
    children: [
      {
        id: 11,
        name: '用户管理',
        display: true,
        route: '/sysManage/userManage',
        resourceType: 'menu',
        orderStr: 1
      }
    ]
  }
]

export { adminRouterLists, userRouterLists }