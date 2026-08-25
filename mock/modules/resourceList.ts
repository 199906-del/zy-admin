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
        resourceType: 'menu'
      },
      {
        id: 11,
        name: '菜单管理',
        resourceType: 'menu',
        route: '/sysManage/menuManage'
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