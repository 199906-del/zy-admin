import type { RouteConfig } from '@/api/types'
import { usePermissionStore } from '@/store/modules/permission'

const checkPermission = (p: string) => {
  if (!p) {
    return true
  }
  const permissionStore = usePermissionStore()
  if (permissionStore.permission) {
    return permissionStore.permission.includes(p)
  }
  return false

}

const getPermission = (resourceList: RouteConfig[]) => {
  const permission = _getPermission(resourceList)
  return [...new Set(permission)]
}

const _getPermission = (resourceList?: RouteConfig[]): string[] => {
  if (!resourceList?.length) {
    return []
  }
  return resourceList.reduce<string[]>((acc, item) => {
    if (item.resourceType === 'button') {
      if (item.permissionFlag) {
        acc.push(item.permissionFlag)
      }
    } else {
      acc.push(..._getPermission(item.children))
    }
    return acc
  }, [])
}

export { checkPermission, getPermission }