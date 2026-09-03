import type { RouteRecordRaw } from 'vue-router'

export type RouteConfig = RouteRecordRaw & {
  id?: string | number
  route?: string
  resourceType?: string
  orderStr?: number
  pPath?: string
  fullPath?: string
  children?: RouteConfig[]
}